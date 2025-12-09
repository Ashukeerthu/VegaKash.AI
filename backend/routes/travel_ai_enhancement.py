"""
AI Enhancement Layer for Travel Cost Estimation
Provides optional AI-powered cost refinement with timeout and caching
"""

import os
import json
import asyncio
import time
import hashlib
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from openai import AsyncOpenAI
import logging
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

# Load environment variables
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Initialize OpenAI client with lazy loading to ensure .env is loaded
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory cache for AI responses (24 hour TTL)
AI_CACHE: Dict[str, Dict[str, Any]] = {}

# Rate limiting (per session)
SESSION_AI_CALLS: Dict[str, int] = {}
MAX_AI_CALLS_PER_SESSION = 3


def generate_cache_key(origin: str, destination: str, dates: str, travelers: int, style: str) -> str:
    """Generate cache key for AI responses"""
    cache_string = f"{origin}_{destination}_{dates}_{travelers}_{style}"
    return hashlib.md5(cache_string.encode()).hexdigest()


def is_cache_valid(cache_entry: Dict[str, Any]) -> bool:
    """Check if cached response is still valid (24 hours)"""
    if "timestamp" not in cache_entry:
        return False
    
    cached_time = datetime.fromisoformat(cache_entry["timestamp"])
    age = datetime.now() - cached_time
    return age < timedelta(hours=24)


def check_rate_limit(session_id: str) -> bool:
    """Check if session has exceeded AI call limit"""
    if session_id not in SESSION_AI_CALLS:
        SESSION_AI_CALLS[session_id] = 0
    
    return SESSION_AI_CALLS[session_id] < MAX_AI_CALLS_PER_SESSION


def increment_session_calls(session_id: str):
    """Increment AI call counter for session"""
    if session_id not in SESSION_AI_CALLS:
        SESSION_AI_CALLS[session_id] = 0
    SESSION_AI_CALLS[session_id] += 1


async def enhance_with_ai(
    origin_city: str,
    origin_country: str,
    destination_city: str,
    destination_country: str,
    start_date: str,
    end_date: str,
    travelers: int,
    travel_style: str,
    fallback_flight_range: Dict[str, int],
    fallback_hotel: float,
    fallback_food: float,
    timeout_seconds: int = 2
) -> Optional[Dict[str, Any]]:
    """
    Enhance cost estimates with AI
    
    Returns:
        Dict with AI-enhanced values or None if timeout/error
    """
    
    # Generate cache key
    cache_key = generate_cache_key(
        f"{origin_city},{origin_country}",
        f"{destination_city},{destination_country}",
        f"{start_date}_{end_date}",
        travelers,
        travel_style
    )
    
    # Check cache first
    if cache_key in AI_CACHE and is_cache_valid(AI_CACHE[cache_key]):
        logger.info("AI response found in cache")
        return AI_CACHE[cache_key]["data"]
    
    prompt = f"""You are a travel cost expert. Refine these travel cost estimates based on current 2025 market data.

Trip Details:
- Route: {origin_city}, {origin_country} → {destination_city}, {destination_country}
- Dates: {start_date} to {end_date} (December 2025 - Peak Season)
- Travelers: {travelers} people
- Style: {travel_style}

Current Fallback Estimates (USD):
- Flight range: ${fallback_flight_range['min']} - ${fallback_flight_range['max']} per person
- Hotel: ${fallback_hotel} per night
- Food: ${fallback_food} per person per day

Task: Refine these estimates based on:
1. Current December 2025 market rates
2. Peak season pricing (December is high season)
3. Route popularity and demand
4. Destination-specific factors

Respond ONLY with valid JSON (no markdown):
{{
  "flight_min": <number>,
  "flight_max": <number>,
  "hotel_per_night": <number>,
  "food_per_day": <number>,
  "confidence": "high|medium|low",
  "reasoning": "Brief 1-sentence explanation"
}}"""

    try:
        start_time = time.time()
        
        # Call OpenAI with timeout
        response = await asyncio.wait_for(
            openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a travel cost expert. Respond only with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=300
            ),
            timeout=timeout_seconds
        )
        
        latency = time.time() - start_time
        
        # Parse response
        raw_content = response.choices[0].message.content
        if raw_content is None:
            logger.error("AI response content is None")
            return None
        ai_content = raw_content.strip()
        
        # Remove markdown if present
        if "```" in ai_content:
            ai_content = ai_content.split("```")[1]
            if ai_content.startswith("json"):
                ai_content = ai_content[4:]
            ai_content = ai_content.strip()
        
        ai_data = json.loads(ai_content)
        ai_data["latency_ms"] = round(latency * 1000, 2)
        ai_data["source"] = "ai"
        
        # Cache the response
        AI_CACHE[cache_key] = {
            "data": ai_data,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"AI enhancement completed in {latency:.2f}s")
        return ai_data
        
    except asyncio.TimeoutError:
        logger.warning(f"AI enhancement timed out after {timeout_seconds}s")
        return None
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response: {e}")
        return None
        
    except Exception as e:
        logger.error(f"AI enhancement failed: {e}")
        return None


def clear_old_cache():
    """Clean up expired cache entries"""
    expired_keys: list[str] = []
    for key, entry in AI_CACHE.items():
        if not is_cache_valid(entry):
            expired_keys.append(key)
    
    for key in expired_keys:
        del AI_CACHE[key]
    
    if expired_keys:
        logger.info(f"Cleared {len(expired_keys)} expired cache entries")