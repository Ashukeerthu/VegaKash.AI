"""
VegaKash.AI - FastAPI Backend Application
AI-powered Budget Planner & Savings Assistant
"""
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Dict

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from slowapi import Limiter, _rate_limit_exceeded_handler  # type: ignore
from slowapi.errors import RateLimitExceeded  # type: ignore
from slowapi.util import get_remote_address  # type: ignore

from routes.budget_planner import router as budget_planner_router
from routes.feedback import router as feedback_router
from routes.travel_planner import router as travel_planner_router
from schemas import (
    AIPlanOutput,
    AIPlanOutputV2,
    AIPlanRequest,
    DebtStrategyComparison,
    FinancialInput,
    MultiLoanInput,
    PDFExportRequest,
    SmartRecommendationsOutput,
    SummaryOutput,
)
from services.ai_planner import generate_ai_plan
from services.ai_planner_v2 import generate_ai_plan_v2
from services.calculations import calculate_summary
from services.multi_loan import compare_debt_strategies
from services.pdf_generator_reportlab import generate_pdf_bytes
from services.smart_recommendations import generate_smart_recommendations

# Load environment variables from .env file (relative to this script)
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Verify API key is loaded
api_key = os.getenv("OPENAI_API_KEY")
api_key_loaded = bool(api_key)
print(f"🔑 OPENAI_API_KEY loaded from .env: {api_key_loaded}")
if api_key_loaded and api_key:
    # Mask the key for security
    masked_key = api_key[:20] + "..." + api_key[-10:]
    print(f"✅ API Key: {masked_key}")
else:
    print("⚠️  WARNING: OPENAI_API_KEY not found in environment!")

# Import security middleware (commented out temporarily - will add after testing)
# from middleware.security import (
#     SecurityHeadersMiddleware,
#     RequestSizeLimitMiddleware,
#     LogSanitizationMiddleware
# )

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
# Production: vegaktools.com
ALLOWED_ORIGINS = [
    "http://localhost:3000",      # React default dev server
    "http://127.0.0.1:3000",
    "http://localhost:3001",      # Vite alternate port
    "http://127.0.0.1:3001",
    "http://localhost:3002",      # Vite alternate port 2
    "http://127.0.0.1:3002",
    "http://localhost:3003",      # Vite alternate port 3
    "http://127.0.0.1:3003",
    "http://localhost:3004",      # Vite alternate port 4
    "http://127.0.0.1:3004",
    "http://localhost:3005",      # Vite alternate port 5
    "http://127.0.0.1:3005",
    "http://localhost:3006",      # Vite alternate port 6
    "http://127.0.0.1:3006",
    "http://localhost:3007",      # Vite alternate port 7
    "http://127.0.0.1:3007",
    "http://localhost:5173",      # Vite default port
    "http://127.0.0.1:5173",
    "https://vegaktools.com",     # Production domain
    "https://www.vegaktools.com", # Production domain with www
]

# Add production domains from environment
if os.getenv("PRODUCTION_DOMAIN"):
    ALLOWED_ORIGINS.append(f"https://{os.getenv('PRODUCTION_DOMAIN')}")
    ALLOWED_ORIGINS.append(f"https://www.{os.getenv('PRODUCTION_DOMAIN')}")

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    ALLOWED_ORIGINS.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Add security middleware (commented out temporarily - will add after testing)
# app.add_middleware(SecurityHeadersMiddleware)
# app.add_middleware(RequestSizeLimitMiddleware)
# app.add_middleware(LogSanitizationMiddleware)

# Register Phase 2 routes
app.include_router(budget_planner_router)
app.include_router(travel_planner_router)
app.include_router(feedback_router)

logger.info("✅ Budget Planner routes registered (Phase 2)")
logger.info("✅ Travel Planner routes registered (Phase 3)")
logger.info("✅ Feedback routes registered")


@app.post("/api/v2/generate-ai-plan", response_model=AIPlanOutputV2)
@limiter.limit("5/minute")  # type: ignore
async def generate_ai_financial_plan_v2(request: Request, ai_request: AIPlanRequest) -> AIPlanOutputV2:
    """
    V2: Generate context-aware AI budget plan with city tier, lifestyle, and family size considerations
    Enhanced version with alerts, recommendations, and educational explainers
    Rate limited to 5 requests per minute per IP
    
    Args:
        request: FastAPI request object (for rate limiting)
        ai_request: Contains financial input and calculated summary
        
    Returns:
        AIPlanOutputV2 with structured budget plan, alerts, and recommendations
    """
    try:
        logger.info(f"Generating V2 AI budget plan for IP: {get_remote_address(request)}")
        
        # Generate V2 AI plan
        ai_plan = generate_ai_plan_v2(ai_request.input, ai_request.summary)
        
        logger.info("V2 AI plan generated successfully")
        
        return ai_plan
        
    except ValueError as e:
        logger.error(f"Configuration error in V2: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": True,
                "message": "V2 AI service configuration error",
                "detail": str(e)
            }
        )
        
    except Exception as e:
        logger.error(f"Error generating V2 AI plan: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": True,
                "message": "Failed to generate V2 AI plan. Please try again later.",
                "detail": str(e)
            }
        )


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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with detailed information"""
    errors = exc.errors()
    logger.error(f"❌ VALIDATION ERROR - Path: {request.url.path}")
    logger.error(f"❌ Validation errors: {errors}")
    logger.error(f"❌ Request body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={
            "error": True,
            "message": "Request validation failed",
            "detail": errors
        }
    )


@app.get("/")
async def root() -> Dict[str, str]:
    """
    Root endpoint - Welcome message
    """
    return {
        "message": "Welcome to VegaKash.AI API",
        "version": "1.0.0",
        "docs": "/api/v1/docs",
        "health": "/api/v1/health"
    }


@app.get("/health")
@app.get("/api/v1/health")
async def health_check() -> Dict[str, str | bool]:
    """
    Health check endpoint
    Used to verify the API is running
    
    Returns:
        Status message with system health information
    """
    return {
        "status": "ok", 
        "message": "VegaKash.AI API is running", 
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "ai_configured": bool(os.getenv("OPENAI_API_KEY"))
    }


@app.get("/ready")
@app.get("/api/v1/ready")
async def readiness_check() -> Dict[str, str | bool]:
    """
    Readiness check endpoint
    Used by orchestrators (K8s, Docker) to verify the app is ready to receive traffic
    Lightweight check - no external service calls
    
    Returns:
        Status message indicating readiness
    """
    return {
        "status": "ok",
        "ready": True,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/v1/stats")
async def get_system_stats() -> Dict[str, object]:
    """
    Get system statistics for monitoring
    
    Returns:
        System statistics including cache and rate limit info
    """
    try:
        # cache_stats = get_cache_stats()  # Temporarily disabled
        
        return {
            "status": "ok",
            "timestamp": datetime.now().isoformat(),
            # "cache": cache_stats,  # Temporarily disabled
            "ai": {
                "configured": bool(os.getenv("OPENAI_API_KEY")),
                "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini")
            },
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Error getting system stats: {e}")
        return {
            "status": "error",
            "message": str(e)
        }


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


# ===========================================
# PHASE 2 ROADMAP (Future Features)
# ===========================================
# - Authentication endpoints (login, register, logout)
# - Endpoint to save/retrieve user financial plans
# - Endpoint to get user dashboard data
# - Endpoint to track financial goals over time
# - Database integration for persistent storage
# See: https://github.com/Ashukeerthu/VegaKash.AI/issues


if __name__ == "__main__":
    import uvicorn
    from datetime import datetime
    uvicorn.run(app, host="0.0.0.0", port=8000)
