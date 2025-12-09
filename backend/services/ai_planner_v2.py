"""
V2: AI Financial Budget Planner - Context-Aware Planning
Enhanced version with city tier, lifestyle, and cost-of-living considerations
"""
import json
import logging
import os
import re
import time
from typing import Optional, Dict, Any, List
from openai import OpenAI, OpenAIError, RateLimitError, APITimeoutError, APIConnectionError
from schemas import (
    FinancialInput, SummaryOutput, ExpensesInput,
    AIPlanOutputV2, AlertV2, MetadataV2, TotalsV2, SplitV2, ExplainersV2, ExpenseBreakdownV2
)

# Configure logging
logger = logging.getLogger(__name__)

# V2 Configuration
AI_MAX_RETRIES = 3
AI_RETRY_DELAY = 2
AI_TIMEOUT = 30
AI_MAX_TOKENS_V2 = 2000
AI_TEMPERATURE = 0.3

# City Tier Budget Split Rules (Modified 40-30-20)
TIER_SPLITS = {
    "Tier 1": {"needs": 45, "wants": 25, "savings": 30},    # Metro: High COL
    "Tier 2": {"needs": 40, "wants": 30, "savings": 30},    # City: Moderate COL
    "Tier 3": {"needs": 35, "wants": 30, "savings": 35},    # Town: Lower COL
}


def normalize_city_tier(city_tier: Optional[str]) -> str:
    """Normalize incoming city tier values to canonical labels used in TIER_SPLITS."""
    if not city_tier:
        return "Tier 2"

    tier_lower = city_tier.strip().lower()
    mapping = {
        "tier_1": "Tier 1",
        "tier1": "Tier 1",
        "tier 1": "Tier 1",
        "tier_2": "Tier 2",
        "tier2": "Tier 2",
        "tier 2": "Tier 2",
        "tier_3": "Tier 3",
        "tier3": "Tier 3",
        "tier 3": "Tier 3",
        "other": "Tier 2",  # Default other/unknown to Tier 2
    }

    return mapping.get(tier_lower, "Tier 2")

# Budget Plan Modes
PLAN_MODES = {
    "basic": "Standard budget following city tier guidelines",
    "aggressive": "Maximize savings to 40%+ for goal achievement",
    "smart": "Balance between comfort (wants) and financial security (savings)"
}


def extract_json_from_text(text: str) -> Optional[Dict[Any, Any]]:
    """Extract JSON from text with fallback strategies"""
    if not text:
        return None
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    try:
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(0))
    except (json.JSONDecodeError, AttributeError):
        pass
    
    try:
        code_block_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if code_block_match:
            return json.loads(code_block_match.group(1))
    except (json.JSONDecodeError, AttributeError):
        pass
    
    logger.error(f"Failed to extract JSON from text. First 200 chars: {text[:200]}")
    return None


def determine_plan_mode(net_savings: float, income: float, has_deficit: bool) -> str:
    """Determine appropriate budget plan mode based on financial health"""
    if has_deficit:
        return "basic"
    
    savings_rate = (net_savings / income) * 100 if income > 0 else 0
    
    if savings_rate >= 30:
        return "aggressive"
    elif savings_rate >= 15:
        return "smart"
    else:
        return "basic"


def get_city_tier_split(city_tier: Optional[str]) -> Dict[str, float]:
    """Get budget split percentages based on city tier (with normalization)."""
    normalized_tier = normalize_city_tier(city_tier)
    return {k: float(v) for k, v in TIER_SPLITS.get(normalized_tier, TIER_SPLITS["Tier 2"]).items()}


def build_ai_prompt_v2(financial_input: FinancialInput, summary: SummaryOutput) -> str:
    """Build context-aware prompt for AI budget planner"""
    from services.calculations import calculate_loan_emi, get_loan_principal
    
    # Format loans
    loans_info = ""
    if financial_input.loans:
        loan_details: List[str] = []
        for loan in financial_input.loans:
            emi = calculate_loan_emi(loan)
            principal = get_loan_principal(loan)
            loan_details.append(
                f"- {loan.name}: ₹{emi:,.0f}/month EMI, "
                f"₹{principal:,.0f} outstanding principal, "
                f"{loan.interest_rate_annual}% interest, {loan.remaining_months} months remaining"
            )
        loans_info = "\n".join(loan_details)
    else:
        loans_info = "No active loans"
    
    # Format primary goal
    goal_info = "Not specified"
    if financial_input.goals is not None and financial_input.goals.primary_goal_type:
        goal_info = f"{financial_input.goals.primary_goal_type}"
        if financial_input.goals.primary_goal_amount:
            goal_info += f" (Target: ₹{financial_input.goals.primary_goal_amount:,.0f})"
    
    # Get city tier split (normalize to align with TIER_SPLITS keys)
    city_tier = normalize_city_tier(financial_input.city_tier)
    col_index = financial_input.cost_of_living_index or 1.0
    tier_split = get_city_tier_split(city_tier)
    
    # Get expenses
    expenses = financial_input.expenses or ExpensesInput()
    
    prompt = f"""
You are an AI Financial Budget Planner specialized in Indian personal finance.
Your job is to generate a personalized MONTHLY BUDGET PLAN based on the user's income, expenses, city, and lifestyle.
You MUST return a STRICT JSON object following the schema below.
Do NOT return explanations outside of JSON. Do NOT include any additional text.

===========================
USER FINANCIAL DATA
===========================

Monthly Income: ₹{int(summary.total_income)}

City: {financial_input.city or "Not specified"}
City Tier: {city_tier}
Cost of Living Multiplier: {col_index}

Family Size: {financial_input.family_size or 1}
Lifestyle: {financial_input.lifestyle or "moderate"}

Fixed Expenses:
- Housing/Rent: ₹{int(expenses.housing_rent):,}
- Utilities: ₹{int(expenses.utilities):,}
- Insurance: ₹{int(expenses.insurance):,}
- Medical: ₹{int(getattr(expenses, "medical", 0)):,}
- EMI Total: ₹{int(getattr(expenses, "emi_total", 0)):,}

Variable Expenses (User Estimates):
- Groceries: ₹{int(expenses.groceries_food):,}
- Transport: ₹{int(expenses.transport):,}
- Entertainment: ₹{int(expenses.entertainment):,}
- Subscriptions: ₹{int(expenses.subscriptions):,}
- Shopping: ₹{int(getattr(expenses, "shopping", 0)):,}
- Dining: ₹{int(getattr(expenses, "dining", 0)):,}
- Others: ₹{int(expenses.others):,}

Debt Information:
{loans_info}

Primary Goal:
{goal_info}

===========================
BUDGET PLANNER REQUIREMENTS
3. Income bracket
4. Family size
Savings must never be negative. If income is too low, warn the user.

===========================
⚠️ ALERT RULES (Mandatory)
===========================

Return alerts for:
- HIGH_RENT → if rent > 35% of income (Tier 1 tolerance: 40%)
- HIGH_EMI → if EMI > 30–35% of income
- NEGATIVE_CASHFLOW → if expenses > income
- LOW_SAVINGS → if savings < recommended minimum (10%)
- HIGH_WANTS → if wants > 35%

===========================
OUTPUT JSON SCHEMA (STRICT)
===========================

{{
  "plan_mode": "<basic | aggressive | smart>",

  "metadata": {{
    "city_tier": "{city_tier}",
    "col_multiplier": {col_index},
    "reasoning_summary": "Brief explanation of adjustments"
  }},

  "totals": {{
    "income": {int(summary.total_income)},
    "total_expenses": {int(summary.total_expenses)},
    "needs_percent": {tier_split["needs"]:.0f},
    "wants_percent": {tier_split["wants"]:.0f},
    "savings_percent": {tier_split["savings"]:.0f}
  }},

  "breakdown": {{
    "needs": {{
      "rent": integer,
      "groceries": integer,
      "utilities": integer,
      "transport": integer,
      "emi": integer,
      "medical": integer,
      "insurance": integer,
      "other_needs": integer
    }},
    "wants": {{
      "dining": integer,
      "entertainment": integer,
      "shopping": integer,
      "subscriptions": integer,
      "other_wants": integer
    }},
    "savings": {{
      "emergency": integer,
      "sips_investment": integer,
      "fd_rd": integer,
      "goals_saving": integer
    }}
  }},

  "alerts": [
    {{
      "code": "ALERT_CODE",
      "message": "Alert message",
      "severity": "info | moderate | high | critical",
      "suggestion": "Actionable suggestion"
    }}
  ],

  "recommendations": [
    "Short actionable tip",
    "Short actionable tip"
  ],

  "explainers": {{
    "why_split": "Explain why this split was chosen based on city tier and lifestyle",
    "how_to_save": "Explain how to improve savings or redirect spending",
    "city_impact": "Explain how city tier ({city_tier}) affected the budget allocation"
  }}
}}

===========================
IMPORTANT RULES
===========================

- ALWAYS return valid JSON following the schema above.
- Monetary values MUST be integers (round values).
- Income must equal sum(needs + wants + savings) EXACTLY. Rebalance numbers to make them add up.
- Do NOT exceed total income. Do NOT produce negative values.
- If income is low, set wants to zero before reducing savings.
- City tier MUST influence Needs/Wants/Savings split.
- Include alerts whenever a rule triggers; omit empty alert objects.
- Output must be short, clear, actionable, India-specific.
- All amounts in Indian Rupees (₹).

Return ONLY the final JSON object. No additional text.
"""
    return prompt


def create_fallback_response_v2(income: float) -> AIPlanOutputV2:
    """Create a fallback budget plan when AI fails"""
    needs = int(income * 0.40)
    wants = int(income * 0.30)
    savings = int(income * 0.30)
    
    return AIPlanOutputV2(
        plan_mode="basic",
        metadata=MetadataV2(
            city="Unknown",
            city_tier="Tier 2",
            col_multiplier=1.0,
            reasoning_summary="Default fallback plan using conservative 40-30-30 split"
        ),
        totals=TotalsV2(
            income=int(income),
            total_expenses=int(income * 0.70),
            net_savings=int(income * 0.30),
            savings_rate_percent=30.0
        ),
        split=SplitV2(
            needs_percent=40,
            wants_percent=30,
            savings_percent=30
        ),
        breakdown=ExpenseBreakdownV2(
            needs={
                "rent": int(needs * 0.40),
                "groceries": int(needs * 0.25),
                "utilities": int(needs * 0.10),
                "transport": int(needs * 0.10),
                "emi": 0,
                "medical": int(needs * 0.10),
                "insurance": int(needs * 0.05),
                "other_needs": 0
            },
            wants={
                "dining": int(wants * 0.30),
                "entertainment": int(wants * 0.25),
                "shopping": int(wants * 0.25),
                "subscriptions": int(wants * 0.10),
                "other_wants": int(wants * 0.10)
            },
            savings={
                "emergency": int(savings * 0.40),
                "sips_investment": int(savings * 0.40),
                "fd_rd": int(savings * 0.15),
                "goals_saving": int(savings * 0.05)
            }
        ),
        alerts=[
            AlertV2(
                code="LOW_DATA",
                message="Unable to generate personalized plan",
                severity="info",
                suggestion="Please provide detailed expense information for a more accurate budget"
            )
        ],
        recommendations=[
            "Track all expenses for 30 days to understand spending patterns",
            "Build an emergency fund covering 3-6 months of expenses",
            "Review and cancel unused subscriptions",
            "Start with small SIPs (Systematic Investment Plan) in index funds",
            "Create a written budget and review it monthly"
        ],
        explainers=ExplainersV2(
            why_split="Conservative split prioritizes financial safety while building savings",
            how_to_save="Categorize expenses, automate transfers to savings account, use zero-based budgeting",
            city_impact="Default tier assumptions may need adjustment based on your actual city cost of living"
        )
    )


def generate_ai_plan_v2(financial_input: FinancialInput, summary: SummaryOutput) -> AIPlanOutputV2:
    """Generate context-aware AI budget plan using OpenAI"""
    
    # Get API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY not set")
        return create_fallback_response_v2(summary.total_income)
    
    # Initialize client
    client = OpenAI(api_key=api_key, timeout=AI_TIMEOUT)
    
    # Normalized city tier for consistent downstream usage
    default_city_tier = normalize_city_tier(financial_input.city_tier)

    # Build V2 prompt
    user_prompt = build_ai_prompt_v2(financial_input, summary)
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    # Retry loop
    for attempt in range(1, AI_MAX_RETRIES + 1):
        try:
            logger.info(f"Calling OpenAI API V2 (attempt {attempt}/{AI_MAX_RETRIES})...")
            
            # Call API
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a senior Indian financial planner who is conservative, practical, and detail-oriented. "
                            "Generate structured monthly budgets considering city tier, lifestyle, and family size. "
                            "Return ONLY valid JSON matching the exact schema provided. No prose before or after. "
                            "All monetary values must be integers. Income must equal needs + wants + savings exactly. "
                            "Never produce negative values. When constraints are tight, trim wants first, then savings, and raise alerts. "
                            "Always surface alerts when rules trigger. Keep recommendations short and action-focused for India."
                        )
                    },
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ],
                temperature=AI_TEMPERATURE,
                max_tokens=AI_MAX_TOKENS_V2,
                response_format={"type": "json_object"}
            )
            
            # Log token usage
            if response.usage:
                logger.info(
                    f"V2 Token usage - Prompt: {response.usage.prompt_tokens}, "
                    f"Completion: {response.usage.completion_tokens}, "
                    f"Total: {response.usage.total_tokens}"
                )
            
            # Extract response
            ai_response_text = response.choices[0].message.content
            if not ai_response_text:
                raise ValueError("Empty response from AI")
            
            logger.info("Received V2 response, parsing JSON...")
            
            # Parse JSON
            ai_data = extract_json_from_text(ai_response_text)
            if not ai_data:
                raise ValueError("Failed to extract JSON from V2 response")
            
            # Build alerts
            alerts: List[AlertV2] = []
            if "alerts" in ai_data and isinstance(ai_data["alerts"], list):
                for alert_item in ai_data["alerts"]:
                    alert_item: Any = alert_item  # Explicit type annotation
                    if isinstance(alert_item, dict):
                        alert_dict: Dict[str, Any] = alert_item
                        alerts.append(AlertV2(
                            code=str(alert_dict.get("code", "UNKNOWN")),
                            message=str(alert_dict.get("message", "")),
                            severity=str(alert_dict.get("severity", "info")),
                            suggestion=str(alert_dict.get("suggestion", ""))
                        ))
            
            # Build metadata
            metadata_data = ai_data.get("metadata", {})
            metadata = MetadataV2(
                city=metadata_data.get("city"),
                city_tier=metadata_data.get("city_tier", default_city_tier),
                col_multiplier=float(metadata_data.get("col_multiplier", financial_input.cost_of_living_index or 1.0)),
                reasoning_summary=metadata_data.get("reasoning_summary", "Budget plan generated")
            )
            
            # Build totals
            totals_data = ai_data.get("totals", {})
            income = int(totals_data.get("income", summary.total_income))
            
            # Calculate totals from breakdown if available
            breakdown_data = ai_data.get("breakdown", {})
            needs_total = sum(breakdown_data.get("needs", {}).values())
            wants_total = sum(breakdown_data.get("wants", {}).values())
            savings_total = sum(breakdown_data.get("savings", {}).values())
            
            total_expenses = needs_total + wants_total
            net_savings = savings_total
            savings_rate_percent = (net_savings / income * 100) if income > 0 else 0
            
            totals = TotalsV2(
                income=income,
                total_expenses=total_expenses,
                net_savings=net_savings,
                savings_rate_percent=savings_rate_percent
            )
            
            # Build split
            split_data = ai_data.get("split", {})
            split = SplitV2(
                needs_percent=float(split_data.get("needs_percent", 40)),
                wants_percent=float(split_data.get("wants_percent", 30)),
                savings_percent=float(split_data.get("savings_percent", 30))
            )
            
            # Build breakdown
            breakdown_data = ai_data.get("breakdown", {})
            breakdown = ExpenseBreakdownV2(
                needs={k: int(v) for k, v in breakdown_data.get("needs", {}).items()},
                wants={k: int(v) for k, v in breakdown_data.get("wants", {}).items()},
                savings={k: int(v) for k, v in breakdown_data.get("savings", {}).items()}
            )
            
            # Build explainers
            explainers_data = ai_data.get("explainers", {})
            explainers = ExplainersV2(
                why_split=explainers_data.get("why_split", ""),
                how_to_save=explainers_data.get("how_to_save", ""),
                city_impact=explainers_data.get("city_impact", "")
            )
            
            # Create final plan
            ai_plan = AIPlanOutputV2(
                plan_mode=ai_data.get("plan_mode", "basic"),
                metadata=metadata,
                totals=totals,
                split=split,
                breakdown=breakdown,
                alerts=alerts,
                recommendations=ai_data.get("recommendations", []),
                explainers=explainers
            )
            
            logger.info("Successfully generated V2 AI budget plan")
            return ai_plan
            
        except RateLimitError as e:
            logger.warning(f"Rate limit on V2 attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                wait_time = AI_RETRY_DELAY * attempt
                logger.info(f"Waiting {wait_time}s before retry...")
                time.sleep(wait_time)
            else:
                logger.error("Max retries reached (rate limit)")
                return create_fallback_response_v2(summary.total_income)
        
        except (APITimeoutError, APIConnectionError) as e:
            logger.warning(f"Connection error on V2 attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                logger.info("Retrying...")
                time.sleep(AI_RETRY_DELAY)
            else:
                logger.error("Max retries reached (connection)")
                return create_fallback_response_v2(summary.total_income)
        
        except (OpenAIError, ValueError) as e:
            logger.error(f"V2 error on attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                time.sleep(AI_RETRY_DELAY)
            else:
                logger.error("Max retries reached")
                return create_fallback_response_v2(summary.total_income)
        
        except Exception as e:
            logger.error(f"Unexpected V2 error on attempt {attempt}: {e}")
            if attempt < AI_MAX_RETRIES:
                time.sleep(AI_RETRY_DELAY)
            else:
                return create_fallback_response_v2(summary.total_income)
    
    logger.error("All V2 retries exhausted")
    return create_fallback_response_v2(summary.total_income)
