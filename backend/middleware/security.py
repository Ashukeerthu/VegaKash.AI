"""
Security middleware for FastAPI
Adds security headers and request validation
"""
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response
import logging

logger = logging.getLogger(__name__)

# Request size limit (10 MB)
MAX_REQUEST_SIZE = 10 * 1024 * 1024


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.
    Protects against XSS, clickjacking, and other common attacks.
    """
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """
        Add security headers to response.
        
        Args:
            request: Incoming HTTP request
            call_next: Next middleware/endpoint handler
            
        Returns:
            HTTP response with security headers
        """
        response = await call_next(request)
        
        # Content Security Policy (CSP)
        # Restrictive policy to prevent XSS attacks
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https://api.openai.com; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'"
        )
        
        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        
        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # Enable XSS protection (legacy but still useful)
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Enforce HTTPS (only in production)
        # Uncomment when deployed with HTTPS
        # response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # Permissions policy (formerly Feature-Policy)
        response.headers["Permissions-Policy"] = (
            "geolocation=(), "
            "microphone=(), "
            "camera=(), "
            "payment=(), "
            "usb=(), "
            "magnetometer=()"
        )
        
        return response


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware to limit request body size.
    Protects against DoS attacks via large payloads.
    """
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """
        Check request size before processing.
        
        Args:
            request: Incoming HTTP request
            call_next: Next middleware/endpoint handler
            
        Returns:
            HTTP response
            
        Raises:
            HTTPException: If request is too large
        """
        # Check Content-Length header
        content_length = request.headers.get("content-length")
        
        if content_length:
            content_length_int = int(content_length)
            if content_length_int > MAX_REQUEST_SIZE:
                logger.warning(
                    f"Request too large: {content_length_int} bytes from {request.client.host if request.client else 'unknown'}"
                )
                raise HTTPException(
                    status_code=413,
                    detail={
                        "error": "Request too large",
                        "message": f"Request body must be less than {MAX_REQUEST_SIZE / (1024 * 1024):.1f} MB",
                        "max_size_bytes": MAX_REQUEST_SIZE
                    }
                )
        
        return await call_next(request)


class LogSanitizationMiddleware(BaseHTTPMiddleware):
    """
    Middleware to sanitize sensitive data from logs.
    Prevents logging of financial data and PII.
    """
    
    SENSITIVE_FIELDS = [
        "monthly_income",
        "expenses",
        "loans",
        "savings",
        "emergency_fund",
        "api_key",
        "token",
        "password"
    ]
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """
        Process request and sanitize logs.
        
        Args:
            request: Incoming HTTP request
            call_next: Next middleware/endpoint handler
            
        Returns:
            HTTP response
        """
        # Log request without sensitive data
        log_data = {
            "method": request.method,
            "path": request.url.path,
            "client": request.client.host if request.client else "unknown"
        }
        
        logger.info(f"Request: {log_data}")
        
        response = await call_next(request)
        
        return response
