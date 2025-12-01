"""
Rate limiting middleware for FastAPI
Protects against abuse and controls API costs
"""
import time
from typing import Dict, Tuple
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response
import logging

logger = logging.getLogger(__name__)

# Rate limit configuration
RATE_LIMIT_REQUESTS = 10  # Maximum requests
RATE_LIMIT_WINDOW = 60  # Time window in seconds (1 minute)
AI_ENDPOINT_LIMIT = 3  # Special limit for AI endpoints per minute

# In-memory storage for rate limiting
# Format: {ip: [(timestamp1, endpoint1), (timestamp2, endpoint2), ...]}
_rate_limit_store: Dict[str, list[Tuple[float, str]]] = {}


def _clean_old_requests(ip: str, current_time: float) -> None:
    """
    Remove requests older than the rate limit window.
    
    Args:
        ip: Client IP address
        current_time: Current timestamp
    """
    if ip in _rate_limit_store:
        _rate_limit_store[ip] = [
            (ts, endpoint) for ts, endpoint in _rate_limit_store[ip]
            if current_time - ts < RATE_LIMIT_WINDOW
        ]
        
        # Remove empty entries
        if not _rate_limit_store[ip]:
            del _rate_limit_store[ip]


def _is_rate_limited(ip: str, endpoint: str, current_time: float) -> Tuple[bool, int]:
    """
    Check if IP has exceeded rate limits.
    
    Args:
        ip: Client IP address
        endpoint: Request endpoint
        current_time: Current timestamp
        
    Returns:
        Tuple of (is_limited, remaining_requests)
    """
    # Clean old requests first
    _clean_old_requests(ip, current_time)
    
    if ip not in _rate_limit_store:
        return False, RATE_LIMIT_REQUESTS
    
    requests = _rate_limit_store[ip]
    
    # Check AI endpoint specific limit
    if "/calculate" in endpoint or "/ai-plan" in endpoint:
        ai_requests = [ts for ts, ep in requests if "/calculate" in ep or "/ai-plan" in ep]
        if len(ai_requests) >= AI_ENDPOINT_LIMIT:
            logger.warning(f"AI endpoint rate limit exceeded for IP: {ip}")
            return True, 0
        return False, AI_ENDPOINT_LIMIT - len(ai_requests)
    
    # Check general rate limit
    if len(requests) >= RATE_LIMIT_REQUESTS:
        logger.warning(f"General rate limit exceeded for IP: {ip}")
        return True, 0
    
    return False, RATE_LIMIT_REQUESTS - len(requests)


def _record_request(ip: str, endpoint: str, current_time: float) -> None:
    """
    Record a request for rate limiting.
    
    Args:
        ip: Client IP address
        endpoint: Request endpoint
        current_time: Current timestamp
    """
    if ip not in _rate_limit_store:
        _rate_limit_store[ip] = []
    
    _rate_limit_store[ip].append((current_time, endpoint))


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware to enforce rate limiting on API endpoints.
    """
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """
        Process request with rate limiting.
        
        Args:
            request: Incoming HTTP request
            call_next: Next middleware/endpoint handler
            
        Returns:
            HTTP response
            
        Raises:
            HTTPException: If rate limit is exceeded
        """
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"
        endpoint = request.url.path
        current_time = time.time()
        
        # Skip rate limiting for health checks and static files
        if endpoint in ["/health", "/", "/favicon.ico"] or endpoint.startswith("/static"):
            return await call_next(request)
        
        # Check rate limit
        is_limited, remaining = _is_rate_limited(client_ip, endpoint, current_time)
        
        if is_limited:
            logger.warning(f"Rate limit exceeded for {client_ip} on {endpoint}")
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "message": "Too many requests. Please try again later.",
                    "retry_after_seconds": RATE_LIMIT_WINDOW
                }
            )
        
        # Record this request
        _record_request(client_ip, endpoint, current_time)
        
        # Add rate limit headers to response
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(RATE_LIMIT_REQUESTS)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(current_time + RATE_LIMIT_WINDOW))
        
        return response


def get_rate_limit_stats() -> Dict[str, int]:
    """
    Get current rate limiting statistics.
    
    Returns:
        Dictionary with stats
    """
    current_time = time.time()
    
    # Clean old entries first
    for ip in list(_rate_limit_store.keys()):
        _clean_old_requests(ip, current_time)
    
    return {
        "active_ips": len(_rate_limit_store),
        "total_requests_in_window": sum(len(requests) for requests in _rate_limit_store.values())
    }
