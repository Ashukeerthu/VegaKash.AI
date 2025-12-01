"""
AI Financial Planner Service
Integrates with OpenAI to generate personalized financial plans
"""
import json
import logging
import os
from openai import OpenAI
from schemas import FinancialInput, SummaryOutput, AIPlanOutput

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def build_ai_prompt(financial_input: FinancialInput, summary: SummaryOutput) -> str:
    """
    Build a comprehensive prompt for the AI model
    
    Args:
        financial_input: User's financial input data
        summary: Calculated financial summary
        
    Returns:
        Formatted prompt string for the AI model
    """
    # Format loans information
    loans_info = ""
    if financial_input.loans:
        loans_info = "\n".join([
            f"- {loan.name}: ₹{loan.outstanding_principal:,.2f} principal, "
            f"{loan.interest_rate_annual}% interest, {loan.remaining_months} months remaining"
            for loan in financial_input.loans
        ])
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
    Generate personalized AI financial plan using OpenAI
    
    Args:
        financial_input: User's financial input data
        summary: Calculated financial summary
        
    Returns:
        AIPlanOutput with AI-generated recommendations
        
    Raises:
        Exception: If OpenAI API call fails or response is invalid
    """
    try:
        # Get API key from environment
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        
        # Initialize OpenAI client
        client = OpenAI(api_key=api_key)
        
        # Build the prompt
        user_prompt = build_ai_prompt(financial_input, summary)
        
        logger.info("Calling OpenAI API for financial plan generation...")
        
        # Call OpenAI API
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
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
                        "Return responses in valid JSON format only."
                    )
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            temperature=0.7,
            max_tokens=2000,
            response_format={"type": "json_object"}  # Force JSON output
        )
        
        # Extract the response
        ai_response_text = response.choices[0].message.content
        logger.info("Received response from OpenAI")
        
        # Parse JSON response
        try:
            if ai_response_text is None:
                raise ValueError("AI response is empty")
            ai_data = json.loads(ai_response_text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            raise Exception("AI returned invalid JSON response")
        
        # Map to AIPlanOutput schema with validation
        try:
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
            
            logger.info("Successfully generated AI financial plan")
            return ai_plan
            
        except Exception as e:
            logger.error(f"Failed to map AI response to schema: {e}")
            raise Exception(f"Failed to process AI response: {str(e)}")
    
    except Exception as e:
        logger.error(f"Error generating AI plan: {e}")
        raise Exception(f"Failed to generate AI plan: {str(e)}")


# TODO: Phase 2 - Add functionality to save AI plans to database
# TODO: Phase 2 - Add user-specific context and history to improve AI recommendations
# TODO: Phase 2 - Implement caching to reduce API costs for similar queries
