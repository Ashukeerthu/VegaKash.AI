"""
Configuration module for VegaKash.AI Backend
Handles environment variables and application settings
"""
import os
from typing import Optional


class Config:
    """
    Application configuration class
    Loads settings from environment variables
    """
    
    def __init__(self):
        """Initialize configuration and validate required settings"""
        self._openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
        
        # Validate critical configuration
        if not self._openai_api_key:
            raise ValueError(
                "OPENAI_API_KEY environment variable is not set. "
                "Please set it before running the application. "
                "Example: set OPENAI_API_KEY=your-key-here (Windows) or export OPENAI_API_KEY=your-key-here (Linux/Mac)"
            )
    
    @property
    def openai_api_key(self) -> str:
        """Get OpenAI API key"""
        if not self._openai_api_key:
            raise ValueError("OpenAI API key is not configured")
        return self._openai_api_key
    
    @property
    def openai_model(self) -> str:
        """Get OpenAI model to use (can be overridden via env var)"""
        return os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    @property
    def api_timeout(self) -> int:
        """Get API timeout in seconds"""
        return int(os.getenv("API_TIMEOUT", "60"))


# Global config instance
# Import this in other modules: from backend.config import config
try:
    config = Config()
except ValueError as e:
    # Allow import but will fail on first use if not configured
    print(f"Warning: {e}")
    config = None
