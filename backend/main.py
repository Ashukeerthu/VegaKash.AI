"""
VegaKash.AI - FastAPI Backend Application
AI-powered Budget Planner & Savings Assistant
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler  # type: ignore
from slowapi.util import get_remote_address  # type: ignore
from slowapi.errors import RateLimitExceeded  # type: ignore
import logging
from typing import Dict
from datetime import datetime

from schemas import (
    FinancialInput, SummaryOutput, AIPlanRequest, AIPlanOutput,
    MultiLoanInput, DebtStrategyComparison, PDFExportRequest,
    SmartRecommendationsOutput
)
from services.calculations import calculate_summary
from services.ai_planner import generate_ai_plan
from services.multi_loan import compare_debt_strategies
from services.smart_recommendations import generate_smart_recommendations
from fastapi.responses import Response

# Import PDF generator (ReportLab - pure Python, no GTK needed)
from services.pdf_generator_reportlab import generate_pdf_bytes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI app
app = FastAPI(
    title="VegaKash.AI API",
    description="AI Budget Planner & Savings Assistant - Backend API",
    version="1.0.0",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore

# Configure CORS
# Allow frontend to access backend from different origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React default dev server
        "http://127.0.0.1:3000",
        "http://localhost:3001",      # Vite alternate port
        "http://127.0.0.1:3001",
        "http://localhost:3002",      # Vite alternate port 2
        "http://127.0.0.1:3002",
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


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors"""
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "An unexpected error occurred. Please try again later.",
            "detail": str(exc) if app.debug else None
        }
    )


@app.get("/health")
@app.get("/api/v1/health")
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint
    Used to verify the API is running
    
    Returns:
        Status message
    """
    logger.info("Health check requested")
    return {"status": "ok", "message": "VegaKash.AI API is running", "version": "1.0.0"}


@app.post("/api/calculate-summary", response_model=SummaryOutput)
@app.post("/api/v1/calculate-summary", response_model=SummaryOutput)
@limiter.limit("30/minute")  # type: ignore
async def calculate_financial_summary(request: Request, financial_input: FinancialInput) -> SummaryOutput:
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
@app.post("/api/v1/generate-ai-plan", response_model=AIPlanOutput)
@limiter.limit("5/minute")  # type: ignore
async def generate_ai_financial_plan(request: Request, ai_request: AIPlanRequest) -> AIPlanOutput:
    """
    Generate personalized AI financial plan
    Uses OpenAI to create customized budget and savings recommendations
    Rate limited to 5 requests per minute per IP
    
    Args:
        request: FastAPI request object (for rate limiting)
        ai_request: Contains both financial input and calculated summary
        
    Returns:
        AIPlanOutput with AI-generated recommendations
        
    Raises:
        HTTPException: If AI generation fails
    """
    try:
        logger.info(f"Generating AI financial plan for IP: {get_remote_address(request)}")
        
        # Generate AI plan
        ai_plan = generate_ai_plan(ai_request.input, ai_request.summary)
        
        logger.info("AI plan generated successfully")
        
        return ai_plan
        
    except ValueError as e:
        # Configuration error (e.g., missing API key)
        logger.error(f"Configuration error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": True,
                "message": "AI service configuration error",
                "detail": str(e)
            }
        )
        
    except Exception as e:
        logger.error(f"Error generating AI plan: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": True,
                "message": "Failed to generate AI plan. Please try again later.",
                "detail": str(e)
            }
        )


@app.post("/api/v1/compare-debt-strategies", response_model=DebtStrategyComparison)
@limiter.limit("10/minute")  # type: ignore
async def compare_debt_strategies_endpoint(request: Request, multi_loan_input: MultiLoanInput) -> DebtStrategyComparison:
    """
    Compare debt snowball vs avalanche strategies
    
    Args:
        multi_loan_input: List of loans and extra payment amount
        
    Returns:
        DebtStrategyComparison with both strategies and recommendation
    """
    try:
        logger.info(f"Comparing debt strategies for {len(multi_loan_input.loans)} loans")
        comparison = compare_debt_strategies(multi_loan_input)
        logger.info(f"Debt comparison complete - Interest saved: ₹{comparison.interest_saved}")
        return comparison
    except Exception as e:
        logger.error(f"Error comparing debt strategies: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compare debt strategies: {str(e)}"
        )


@app.post("/api/v1/export-pdf")
@limiter.limit("10/minute")  # type: ignore
async def export_financial_plan_pdf(request: Request, pdf_request: PDFExportRequest) -> Response:
    """
    Export financial plan as PDF
    
    Args:
        pdf_request: Contains financial input, summary, and optional AI plan
        
    Returns:
        PDF file as bytes
    """
    try:
        logger.info("Generating PDF export")
        pdf_bytes = generate_pdf_bytes(
            pdf_request.input,
            pdf_request.summary,
            pdf_request.ai_plan
        )
        
        filename = f"VegaKash_Financial_Plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        logger.info(f"PDF generated successfully: {filename}")
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        logger.error(f"Error generating PDF: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate PDF: {str(e)}"
        )


@app.post("/api/v1/smart-recommendations", response_model=SmartRecommendationsOutput)
@limiter.limit("20/minute")  # type: ignore
async def get_smart_recommendations(request: Request, financial_input: FinancialInput) -> SmartRecommendationsOutput:
    """
    Get personalized smart recommendations and alerts
    
    Args:
        financial_input: User's financial data
        
    Returns:
        SmartRecommendationsOutput with alerts, recommendations, and reminders
    """
    try:
        logger.info("Generating smart recommendations")
        
        # Calculate summary first
        summary = calculate_summary(financial_input)
        
        # Generate recommendations
        recommendations = generate_smart_recommendations(financial_input, summary)
        
        logger.info(f"Generated {len(recommendations.alerts)} alerts and {len(recommendations.recommendations)} recommendations")
        
        return recommendations
    except Exception as e:
        logger.error(f"Error generating smart recommendations: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate recommendations: {str(e)}"
        )


# TODO: Phase 2 - Add authentication endpoints (login, register, logout)
# TODO: Phase 2 - Add endpoint to save/retrieve user financial plans
# TODO: Phase 2 - Add endpoint to get user dashboard data
# TODO: Phase 2 - Add endpoint to track financial goals over time
# TODO: Phase 2 - Add database integration for persistent storage


if __name__ == "__main__":
    import uvicorn
    from datetime import datetime
    uvicorn.run(app, host="0.0.0.0", port=8000)
