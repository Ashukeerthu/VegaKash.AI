"""
AI Financial Planner Service
Integrates with OpenAI to generate personalized financial plans
"""
import json
import logging
import os
import re
import time
from typing import Optional, Dict, Any, List
from openai import OpenAI, OpenAIError, RateLimitError, APITimeoutError, APIConnectionError
from schemas import FinancialInput, SummaryOutput, AIPlanOutput
# from services.cache import get_cached_plan, set_cached_plan  # Temporarily disabled

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# AI Configuration Constants
AI_MAX_RETRIES = 3
AI_RETRY_DELAY = 2  # seconds
AI_TIMEOUT = 30  # seconds
AI_MAX_TOKENS = 1500  # Reduced from 2000 for cost optimization
AI_TEMPERATURE = 0.3  # Lower temperature for more predictable outputs


def extract_json_from_text(text: str) -> Optional[Dict[Any, Any]]:
    """
    Extract JSON from text with multiple fallback strategies.
    Handles cases where AI response contains additional text around JSON.
    
    Args:
        text: Raw text that may contain JSON
        
    Returns:
        Parsed JSON dict or None if extraction fails
    """
    if not text:
        return None
    
    # Strategy 1: Try direct JSON parsing
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    # Strategy 2: Extract JSON using regex (find content between curly braces)
    try:
        # Find the first complete JSON object
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(0))
    except (json.JSONDecodeError, AttributeError):
        pass
    
    # Strategy 3: Try to find JSON between markdown code blocks
    try:
        code_block_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if code_block_match:
            return json.loads(code_block_match.group(1))
    except (json.JSONDecodeError, AttributeError):
        pass
    
    logger.error(f"Failed to extract JSON from text. First 200 chars: {text[:200]}")
    return None


def validate_ai_response(data: Dict[Any, Any]) -> bool:
    """
    Validate that AI response contains all required fields.
    
    Args:
        data: Parsed JSON response from AI
        
    Returns:
        True if valid, False otherwise
    """
    required_fields = [
        "summary_text",
        "budget_breakdown",
        "expense_optimizations",
        "savings_and_investment_plan",
        "debt_strategy",
        "goal_plan",
        "action_items_30_days",
        "disclaimer"
    ]
    
    for field in required_fields:
        if field not in data:
            logger.warning(f"Missing required field in AI response: {field}")
            return False
        
        # Validate types
        if field in ["expense_optimizations", "action_items_30_days"]:
            if not isinstance(data[field], list):
                logger.warning(f"Field {field} should be a list")
                return False
        elif not isinstance(data[field], str):
            logger.warning(f"Field {field} should be a string")
            return False
    
    return True


def create_fallback_response() -> AIPlanOutput:
    """
    Create a fallback AI response when the API fails.
    This ensures the user always gets some guidance even if AI fails.
    
    Returns:
        Default AIPlanOutput with generic recommendations
    """
    return AIPlanOutput(
        summary_text="We're currently unable to generate a personalized plan. Please try again in a few moments.",
        budget_breakdown="Budget Breakdown:\n• Needs (50%): Housing, utilities, groceries, transport\n• Wants (30%): Entertainment, subscriptions, dining out\n• Savings (20%): Emergency fund, investments, goals",
        expense_optimizations=[
            "Review and cancel unused subscriptions",
            "Compare prices before making purchases",
            "Cook meals at home to reduce food expenses",
            "Use public transport when possible",
            "Set spending limits for discretionary categories"
        ],
        savings_and_investment_plan="Savings Strategy:\n• Build 3-6 months emergency fund first\n• Consider SIP in index mutual funds (60%)\n• Allocate to PPF or EPF (30%)\n• Keep liquid funds for short-term goals (10%)",
        debt_strategy="Focus on high-interest debts first (avalanche method). Make minimum payments on all loans, then put extra money toward the highest interest rate debt.",
        goal_plan="Goal Planning:\n1. Define specific financial goals with timelines\n2. Calculate monthly savings needed\n3. Automate savings transfers\n4. Review progress quarterly",
        action_items_30_days=[
            "Track all expenses for 30 days",
            "Create a detailed monthly budget",
            "Set up automatic savings transfers",
            "Review and optimize recurring expenses",
            "Research investment options suitable for your goals"
        ],
        disclaimer="This is educational guidance only and not certified financial advice. Please consult with a certified financial advisor for personalized recommendations. AI-generated suggestions are based on general best practices and may not suit your specific situation."
    )


def build_ai_prompt(financial_input: FinancialInput, summary: SummaryOutput) -> str:
    """
    Build a comprehensive prompt for the AI model
    
    Args:
        financial_input: User's financial input data
        summary: Calculated financial summary
        
    Returns:
        Formatted prompt string for the AI model
    """
    # Format loans information (support both EMI and principal modes)
    from services.calculations import calculate_loan_emi, get_loan_principal
    
    loans_info = ""
    if financial_input.loans:
        loan_details: List[str] = []
        for loan in financial_input.loans:
            emi = calculate_loan_emi(loan)
            principal = get_loan_principal(loan)
            loan_details.append(
                f"- {loan.name}: ₹{emi:,.2f}/month EMI, "
                f"₹{principal:,.2f} outstanding principal, "
                f"{loan.interest_rate_annual}% interest, {loan.remaining_months} months remaining"
            )
        loans_info = "\n".join(loan_details)
    else:
        loans_info = "No active loans"
    
    # Format primary goal
    goal_info = "Not specified"
    if financial_input.goals.primary_goal_type:
        goal_info = f"{financial_input.goals.primary_goal_type}"
        if financial_input.goals.primary_goal_amount:
            goal_info += f" (Target: ₹{financial_input.goals.primary_goal_amount:,.2f})"
    
    prompt = f"""
You are analyzing the financial situation of a person in India. Based on the data below, provide a comprehensive financial plan.

**FINANCIAL DATA:**

Income:
- Primary Monthly Income: ₹{financial_input.monthly_income_primary:,.2f}
- Additional Income: ₹{financial_input.monthly_income_additional:,.2f}
- Total Income: ₹{summary.total_income:,.2f}

Expenses (Monthly):
- Housing/Rent: ₹{financial_input.expenses.housing_rent:,.2f}
- Groceries & Food: ₹{financial_input.expenses.groceries_food:,.2f}
- Transport: ₹{financial_input.expenses.transport:,.2f}
- Utilities: ₹{financial_input.expenses.utilities:,.2f}
- Insurance: ₹{financial_input.expenses.insurance:,.2f}
- Entertainment: ₹{financial_input.expenses.entertainment:,.2f}
- Subscriptions: ₹{financial_input.expenses.subscriptions:,.2f}
- Others: ₹{financial_input.expenses.others:,.2f}
- Total Expenses: ₹{summary.total_expenses:,.2f}

Current Financial Status:
- Net Savings: ₹{summary.net_savings:,.2f}
- Savings Rate: {summary.savings_rate_percent:.1f}%
- Debt-to-Income Ratio: {summary.debt_to_income_ratio_percent:.1f}%
- Financial Status: {"DEFICIT ⚠️" if summary.has_deficit else "SURPLUS ✓"}

Goals:
- Monthly Savings Target: ₹{financial_input.goals.monthly_savings_target:,.2f}
- Emergency Fund Target: ₹{financial_input.goals.emergency_fund_target:,.2f}
- Primary Goal: {goal_info}

Active Loans:
{loans_info}

50-30-20 Rule Recommendation:
- Needs (50%): ₹{summary.rule_50_30_20_needs:,.2f}
- Wants (30%): ₹{summary.rule_50_30_20_wants:,.2f}
- Savings (20%): ₹{summary.rule_50_30_20_savings:,.2f}

**INSTRUCTIONS:**
Provide a detailed, personalized financial plan in JSON format with these exact keys:

1. "summary_text": STRING - Brief 2-3 sentence summary of their financial situation
2. "budget_breakdown": STRING (NOT OBJECT) - Detailed monthly budget recommendation as formatted text with line breaks (consider Indian context: rent, groceries, transport, etc.)
3. "expense_optimizations": ARRAY of STRINGS - 4-6 specific, actionable tips to reduce expenses
4. "savings_and_investment_plan": STRING (NOT OBJECT) - Detailed savings and investment strategy as formatted text. Mention generic Indian options like SIP in mutual funds, PPF, FD, EPF, NPS, etc. WITHOUT naming specific funds or companies. Include percentage allocation suggestions.
5. "debt_strategy": STRING - If they have loans, recommend a repayment strategy (snowball or avalanche method). If no loans, suggest how to stay debt-free.
6. "goal_plan": STRING (NOT OBJECT) - Step-by-step plan to achieve their primary goal with timeline and monthly savings needed, as formatted text
7. "action_items_30_days": ARRAY of STRINGS - 5-7 concrete action items they can do in the next 30 days
8. "disclaimer": STRING - Professional disclaimer stating this is educational guidance, not certified financial advice

**CRITICAL:**
- budget_breakdown, savings_and_investment_plan, and goal_plan MUST be strings with newlines (\n), NOT nested objects
- Use Indian Rupees (₹) in all monetary references
- Consider Indian financial products and context (SIP, PPF, FD, EPF, NPS, etc.)
- Be specific and actionable
- Use simple, clear language
- Return ONLY valid JSON matching the schema exactly, no additional text
"""
    return prompt


def generate_ai_plan(financial_input: FinancialInput, summary: SummaryOutput) -> AIPlanOutput:
    """
    Generate personalized AI financial plan using OpenAI with robust error handling.
    
    Features:
    - Response caching to reduce API costs
    - Automatic retries on failure (rate limits, timeouts)
    - Fallback JSON extraction for malformed responses
    - Token usage logging for cost monitoring
    - Graceful degradation with fallback response
    
    Args:
        financial_input: User's financial input data
        summary: Calculated financial summary
        
    Returns:
        AIPlanOutput with AI-generated recommendations
        
    Raises:
        Exception: If all retry attempts fail
    """
    # Check cache first to save API costs (temporarily disabled)
    # input_dict = financial_input.model_dump()
    # cached_plan = get_cached_plan(input_dict)
    
    # if cached_plan:
    #     logger.info("Returning cached AI plan")
    #     return AIPlanOutput(**cached_plan)
    
    # Get API key from environment
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY environment variable is not set")
        return create_fallback_response()
    
    # Initialize OpenAI client
    client = OpenAI(api_key=api_key, timeout=AI_TIMEOUT)
    
    # Build the prompt
    user_prompt = build_ai_prompt(financial_input, summary)
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    # Retry loop
    for attempt in range(1, AI_MAX_RETRIES + 1):
        try:
            logger.info(f"Calling OpenAI API (attempt {attempt}/{AI_MAX_RETRIES})...")
            
            # Call OpenAI API with optimized settings
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a helpful financial planning assistant for users in India. "
                            "You are NOT a certified financial advisor, but you provide general, "
                            "educational guidance on budgeting, saving, and debt strategy. "
                            "Always provide practical advice considering the Indian financial context. "
                            "Return responses in valid JSON format only with these exact keys: "
                            "summary_text, budget_breakdown, expense_optimizations, "
                            "savings_and_investment_plan, debt_strategy, goal_plan, "
                            "action_items_30_days, disclaimer. "
                            "Never include speculative or unrealistic recommendations."
                        )
                    },
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ],
                temperature=AI_TEMPERATURE,
                max_tokens=AI_MAX_TOKENS,
                response_format={"type": "json_object"}
            )
            
            # Log token usage for cost monitoring
            if response.usage:
                logger.info(
                    f"Token usage - Prompt: {response.usage.prompt_tokens}, "
                    f"Completion: {response.usage.completion_tokens}, "
                    f"Total: {response.usage.total_tokens}"
                )
            
            # Extract the response
            ai_response_text = response.choices[0].message.content
            
            if not ai_response_text:
                raise ValueError("AI response is empty")
            
            logger.info("Received response from OpenAI, parsing JSON...")
            
            # Try to extract JSON with fallback strategies
            ai_data = extract_json_from_text(ai_response_text)
            
            if not ai_data:
                raise ValueError("Failed to extract valid JSON from AI response")
            
            # Validate response structure
            if not validate_ai_response(ai_data):
                raise ValueError("AI response missing required fields")
            
            # Map to AIPlanOutput schema
            ai_plan = AIPlanOutput(
                summary_text=ai_data.get("summary_text", "Unable to generate summary"),
                budget_breakdown=ai_data.get("budget_breakdown", "Unable to generate budget breakdown"),
                expense_optimizations=ai_data.get("expense_optimizations", ["Review and optimize expenses"]),
                savings_and_investment_plan=ai_data.get("savings_and_investment_plan", "Unable to generate investment plan"),
                debt_strategy=ai_data.get("debt_strategy", "Unable to generate debt strategy"),
                goal_plan=ai_data.get("goal_plan", "Unable to generate goal plan"),
                action_items_30_days=ai_data.get("action_items_30_days", ["Start tracking expenses daily"]),
                disclaimer=ai_data.get(
                    "disclaimer",
                    "This is educational guidance only and not certified financial advice. "
                    "Please consult with a certified financial advisor for personalized recommendations."
                )
            )
            
            # Cache the successful response (temporarily disabled)
            # set_cached_plan(input_dict, ai_plan.model_dump())
            
            logger.info("Successfully generated and validated AI financial plan")
            return ai_plan
        
        except RateLimitError as e:
            logger.warning(f"Rate limit hit on attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                wait_time = AI_RETRY_DELAY * attempt  # Exponential backoff
                logger.info(f"Waiting {wait_time}s before retry...")
                time.sleep(wait_time)
            else:
                logger.error("Max retries reached due to rate limiting")
                return create_fallback_response()
        
        except APITimeoutError as e:
            logger.warning(f"API timeout on attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                logger.info(f"Retrying after timeout...")
                time.sleep(AI_RETRY_DELAY)
            else:
                logger.error("Max retries reached due to timeouts")
                return create_fallback_response()
        
        except APIConnectionError as e:
            logger.warning(f"Connection error on attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                logger.info(f"Retrying after connection error...")
                time.sleep(AI_RETRY_DELAY)
            else:
                logger.error("Max retries reached due to connection errors")
                return create_fallback_response()
        
        except OpenAIError as e:
            logger.error(f"OpenAI API error on attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                time.sleep(AI_RETRY_DELAY)
            else:
                logger.error("Max retries reached due to OpenAI errors")
                return create_fallback_response()
        
        except ValueError as e:
            logger.error(f"Validation error on attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                logger.info("Retrying with fresh request...")
                time.sleep(AI_RETRY_DELAY)
            else:
                logger.error("Max retries reached due to validation errors")
                return create_fallback_response()
        
        except Exception as e:
            logger.error(f"Unexpected error on attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                time.sleep(AI_RETRY_DELAY)
            else:
                logger.error(f"Max retries reached. Error: {e}")
                return create_fallback_response()
    
    # Fallback if all retries exhausted
    logger.error("All retry attempts exhausted")
    return create_fallback_response()


# ===========================================
# PHASE 2 ROADMAP (Future Enhancements)
# ===========================================
# - Save AI plans to database for user history
# - Add user-specific context to improve AI recommendations
# - Implement Redis caching to reduce API costs for similar queries
# See: https://github.com/Ashukeerthu/VegaKash.AI/issues
