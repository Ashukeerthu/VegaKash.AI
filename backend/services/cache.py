"""
Simple in-memory cache for AI responses
Reduces API costs by caching identical requests
"""
import hashlib
import json
import time
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

# In-memory cache with TTL
_cache: Dict[str, Dict[str, Any]] = {}
CACHE_TTL = 3600  # 1 hour in seconds
MAX_CACHE_SIZE = 100  # Maximum number of cached items


def _generate_cache_key(financial_input: Dict[Any, Any]) -> str:
    """
    Generate a unique cache key from financial input data.
    
    Args:
        financial_input: Dictionary representation of financial data
        
    Returns:
        MD5 hash of the input data
    """
    # Sort keys for consistent hashing
    sorted_input = json.dumps(financial_input, sort_keys=True)
    return hashlib.md5(sorted_input.encode()).hexdigest()


def get_cached_plan(financial_input: Dict[Any, Any]) -> Optional[Dict[Any, Any]]:
    """
    Retrieve cached AI plan if available and not expired.
    
    Args:
        financial_input: Dictionary representation of financial data
        
    Returns:
        Cached plan data or None if not found/expired
    """
    cache_key = _generate_cache_key(financial_input)
    
    if cache_key in _cache:
        cached_item = _cache[cache_key]
        
        # Check if cache is still valid
        if time.time() - cached_item["timestamp"] < CACHE_TTL:
            logger.info(f"Cache HIT for key: {cache_key[:8]}...")
            return cached_item["data"]
        else:
            # Remove expired cache
            logger.info(f"Cache EXPIRED for key: {cache_key[:8]}...")
            del _cache[cache_key]
    
    logger.info(f"Cache MISS for key: {cache_key[:8]}...")
    return None


def set_cached_plan(financial_input: Dict[Any, Any], plan_data: Dict[Any, Any]) -> None:
    """
    Store AI plan in cache with timestamp.
    
    Args:
        financial_input: Dictionary representation of financial data
        plan_data: AI plan to cache
    """
    cache_key = _generate_cache_key(financial_input)
    
    # Implement simple LRU: remove oldest item if cache is full
    if len(_cache) >= MAX_CACHE_SIZE:
        oldest_key = min(_cache.keys(), key=lambda k: _cache[k]["timestamp"])
        del _cache[oldest_key]
        logger.info(f"Cache FULL, removed oldest entry: {oldest_key[:8]}...")
    
    _cache[cache_key] = {
        "data": plan_data,
        "timestamp": time.time()
    }
    
    logger.info(f"Cache SET for key: {cache_key[:8]}... (Total cached: {len(_cache)})")


def clear_cache() -> None:
    """Clear all cached items."""
    global _cache
    _cache = {}
    logger.info("Cache cleared")


def get_cache_stats() -> Dict[str, Any]:
    """
    Get cache statistics.
    
    Returns:
        Dictionary with cache stats (size, oldest entry age, etc.)
    """
    if not _cache:
        return {
            "size": 0,
            "oldest_entry_age_seconds": 0,
            "total_entries": 0
        }
    
    current_time = time.time()
    oldest_timestamp = min(item["timestamp"] for item in _cache.values())
    
    return {
        "size": len(_cache),
        "oldest_entry_age_seconds": int(current_time - oldest_timestamp),
        "total_entries": len(_cache),
        "ttl_seconds": CACHE_TTL
    }
