"""
Feedback API Route
Private user feedback system with email notification
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Feedback"])


# ============================================
# PYDANTIC MODELS
# ============================================

class FeedbackRequest(BaseModel):
    """Feedback submission request model"""
    feedback_type: Literal["button-feedback", "micro-survey", "page-feedback"] = Field(
        ..., 
        description="Type of feedback: button-feedback (floating button), micro-survey (after AI result), page-feedback (dedicated page)"
    )
    rating: Optional[int] = Field(
        None, 
        ge=1, 
        le=5, 
        description="Star rating from 1 to 5"
    )
    message: str = Field(
        ..., 
        min_length=1, 
        max_length=5000, 
        description="Feedback message"
    )
    user_email: Optional[EmailStr] = Field(
        None, 
        description="Optional user email for follow-up"
    )
    user_name: Optional[str] = Field(
        None,
        max_length=100,
        description="Optional user name"
    )
    page_url: Optional[str] = Field(
        None, 
        description="URL of the page where feedback was submitted"
    )
    category: Optional[Literal["bug", "suggestion", "feature-request", "general"]] = Field(
        "general", 
        description="Feedback category for page-feedback type"
    )
    was_helpful: Optional[bool] = Field(
        None, 
        description="For micro-survey: was the AI result helpful?"
    )
    ai_feature: Optional[str] = Field(
        None, 
        description="For micro-survey: which AI feature was used"
    )


class FeedbackResponse(BaseModel):
    """Feedback submission response"""
    success: bool
    message: str
    feedback_id: Optional[str] = None


# ============================================
# EMAIL SERVICE
# ============================================

def get_email_config():
    """Get email configuration from environment variables"""
    return {
        "host": os.getenv("EMAIL_HOST", "smtp.gmail.com"),
        "port": int(os.getenv("EMAIL_PORT", "587")),
        "user": os.getenv("EMAIL_USER", ""),
        "password": os.getenv("EMAIL_PASSWORD", ""),
        "to": os.getenv("EMAIL_TO", ""),
    }


def send_feedback_email(feedback: FeedbackRequest) -> bool:
    """
    Send feedback notification email via Gmail SMTP
    
    Args:
        feedback: The feedback data to send
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    config = get_email_config()
    
    if not config["user"] or not config["password"]:
        logger.error("Email credentials not configured")
        return False
    
    try:
        # Build email content
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Create rating display
        rating_display = "N/A"
        if feedback.rating:
            stars = "⭐" * feedback.rating + "☆" * (5 - feedback.rating)
            rating_display = f"{stars} ({feedback.rating}/5)"
        
        # Create helpful display for micro-surveys
        helpful_display = ""
        if feedback.feedback_type == "micro-survey" and feedback.was_helpful is not None:
            helpful_display = f"\n🤔 Was Helpful: {'Yes ✅' if feedback.was_helpful else 'No ❌'}"
            if feedback.ai_feature:
                helpful_display += f"\n🤖 AI Feature: {feedback.ai_feature}"
        
        # Build email body
        email_body = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 NEW USER FEEDBACK - VegakTools
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 FEEDBACK DETAILS
───────────────────────────────────────
📌 Type: {feedback.feedback_type.replace('-', ' ').title()}
📂 Category: {(feedback.category or 'general').replace('-', ' ').title()}
⭐ Rating: {rating_display}{helpful_display}

💬 MESSAGE
───────────────────────────────────────
{feedback.message}

👤 USER INFO
───────────────────────────────────────
Name: {feedback.user_name or 'Anonymous'}
Email: {feedback.user_email or 'Not provided'}
Page URL: {feedback.page_url or 'Not provided'}

🕐 TIMESTAMP
───────────────────────────────────────
Date & Time: {timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message from VegakTools Feedback System.
Please do not reply directly to this email.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        # Create email message
        msg = MIMEMultipart()
        msg['From'] = f"VegakTools Feedback <{config['user']}>"
        msg['To'] = config['to']
        
        # Dynamic subject based on feedback type
        type_emoji = {
            "button-feedback": "💬",
            "micro-survey": "📊",
            "page-feedback": "📝"
        }
        emoji = type_emoji.get(feedback.feedback_type, "📧")
        
        category_tag = ""
        if feedback.category and feedback.category != "general":
            category_tag = f" [{feedback.category.upper()}]"
        
        msg['Subject'] = f"{emoji} VegakTools – New User Feedback{category_tag}"
        
        msg.attach(MIMEText(email_body, 'plain', 'utf-8'))
        
        # Send email via SMTP
        with smtplib.SMTP(config["host"], config["port"]) as server:
            server.starttls()
            server.login(config["user"], config["password"])
            server.send_message(msg)
        
        logger.info(f"Feedback email sent successfully for type: {feedback.feedback_type}")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication failed: {e}")
        return False
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error sending feedback email: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error sending feedback email: {e}")
        return False


# ============================================
# API ENDPOINTS
# ============================================

@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackRequest,
    background_tasks: BackgroundTasks
):
    """
    Submit user feedback
    
    This endpoint receives user feedback and sends an email notification
    to the admin. All feedback is kept private and not displayed publicly.
    
    - **feedback_type**: Type of feedback (button-feedback, micro-survey, page-feedback)
    - **rating**: Optional star rating (1-5)
    - **message**: Feedback message (required)
    - **user_email**: Optional email for follow-up
    - **page_url**: URL where feedback was submitted
    - **category**: Feedback category for page-feedback
    - **was_helpful**: For micro-surveys, whether AI result was helpful
    - **ai_feature**: For micro-surveys, which AI feature was used
    """
    try:
        # Generate a simple feedback ID
        feedback_id = f"FB-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Log the feedback
        logger.info(f"Received feedback {feedback_id}: type={feedback.feedback_type}, rating={feedback.rating}")
        
        # Send email in background (non-blocking)
        background_tasks.add_task(send_feedback_email, feedback)
        
        return FeedbackResponse(
            success=True,
            message="Thank you for your feedback! We appreciate your input.",
            feedback_id=feedback_id
        )
        
    except Exception as e:
        logger.error(f"Error processing feedback: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to process feedback. Please try again later."
        )


@router.get("/feedback/health")
async def feedback_health():
    """Health check for feedback system"""
    config = get_email_config()
    email_configured = bool(config["user"] and config["password"])
    
    return {
        "status": "healthy",
        "email_configured": email_configured,
        "timestamp": datetime.now().isoformat()
    }
