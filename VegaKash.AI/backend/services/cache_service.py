"""
Caching utility for travel planner results.
Reduces cost by storing identical request results for 6 hours.
"""
import json
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

class ResultCache:
    """Simple in-memory cache with 6-hour TTL."""
    
    def __init__(self, ttl_hours: int = 6):
        self.cache: Dict[str, tuple] = {}  # {hash: (result, timestamp)}
        self.ttl = timedelta(hours=ttl_hours)
    
    def _make_key(self, request_data: Dict[str, Any]) -> str:
        """Generate cache key from request (order-independent)."""
        try:
            key_str = json.dumps(request_data, sort_keys=True, default=str)
            return hashlib.sha256(key_str.encode()).hexdigest()
        except Exception:
            return None
    
    def get(self, request_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Retrieve cached result if fresh."""
        key = self._make_key(request_data)
        if not key or key not in self.cache:
            return None
        
        result, timestamp = self.cache[key]
        if datetime.now() - timestamp > self.ttl:
            del self.cache[key]  # Expired
            return None
        
        return result
    
    def set(self, request_data: Dict[str, Any], result: Dict[str, Any]) -> None:
        """Store result in cache."""
        key = self._make_key(request_data)
        if key:
            self.cache[key] = (result, datetime.now())
    
    def clear(self) -> None:
        """Clear entire cache."""
        self.cache.clear()
    
    def stats(self) -> Dict[str, Any]:
        """Return cache statistics."""
        return {
            "size": len(self.cache),
            "ttl_hours": self.ttl.total_seconds() / 3600,
        }


# Global cache instance
budget_cache = ResultCache(ttl_hours=6)
