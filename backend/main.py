"""
VegaKash.AI - FastAPI Backend Application
AI-powered Budget Planner & Savings Assistant
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from typing import Dict

from schemas import FinancialInput, SummaryOutput, AIPlanRequest, AIPlanOutput
from services.calculations import calculate_summary
from services.ai_planner import generate_ai_plan

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="VegaKash.AI API",
    description="AI Budget Planner & Savings Assistant - Backend API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
# Allow frontend to access backend from different origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React default dev server
        "http://127.0.0.1:3000",
        "http://localhost:5500",      # VS Code Live Server
        "http://127.0.0.1:5500",
        "http://localhost:5173",      # Vite default port
        "http://127.0.0.1:5173",
        # TODO: Phase 2 - Add production domain after hosting on Hostinger
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/health")
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint
    Used to verify the API is running
    
    Returns:
        Status message
    """
    logger.info("Health check requested")
    return {"status": "ok", "message": "VegaKash.AI API is running"}


@app.post("/api/calculate-summary", response_model=SummaryOutput)
async def calculate_financial_summary(financial_input: FinancialInput) -> SummaryOutput:
    """
    Calculate financial summary based on user input
    Performs rule-based calculations without AI
    
    Args:
        financial_input: User's financial data (income, expenses, goals, loans)
        
    Returns:
        SummaryOutput with calculated metrics and basic advice
        
    Raises:
        HTTPException: If calculation fails
    """
    try:
        logger.info(f"Calculating summary for income: ₹{financial_input.monthly_income_primary}")
        
        # Perform calculations
        summary = calculate_summary(financial_input)
        
        logger.info(f"Summary calculated - Net Savings: ₹{summary.net_savings}, "
                   f"Savings Rate: {summary.savings_rate_percent}%")
        
        return summary
        
    except Exception as e:
        logger.error(f"Error calculating summary: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate financial summary: {str(e)}"
        )


@app.post("/api/generate-ai-plan", response_model=AIPlanOutput)
async def generate_ai_financial_plan(request: AIPlanRequest) -> AIPlanOutput:
    """
    Generate personalized AI financial plan
    Uses OpenAI to create customized budget and savings recommendations
    
    Args:
        request: Contains both financial input and calculated summary
        
    Returns:
        AIPlanOutput with AI-generated recommendations
        
    Raises:
        HTTPException: If AI generation fails
    """
    try:
        logger.info("Generating AI financial plan")
        
        # Generate AI plan
        ai_plan = generate_ai_plan(request.input, request.summary)
        
        logger.info("AI plan generated successfully")
        
        return ai_plan
        
    except ValueError as e:
        # Configuration error (e.g., missing API key)
        logger.error(f"Configuration error: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
    except Exception as e:
        logger.error(f"Error generating AI plan: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate AI plan. Please try again later. Error: {str(e)}"
        )


# TODO: Phase 2 - Add authentication endpoints (login, register, logout)
# TODO: Phase 2 - Add endpoint to save/retrieve user financial plans
# TODO: Phase 2 - Add endpoint to get user dashboard data
# TODO: Phase 2 - Add endpoint to track financial goals over time
# TODO: Phase 2 - Add rate limiting to prevent API abuse
# TODO: Phase 2 - Add database integration for persistent storage


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
