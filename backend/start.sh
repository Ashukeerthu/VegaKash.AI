#!/bin/bash
# Production startup script for VegaKash.AI Backend

echo "🚀 Starting VegaKash.AI Backend (Production)"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo "Please create .env file with your OPENAI_API_KEY"
    exit 1
fi

# Load environment variables
export $(cat .env | xargs)

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements-prod.txt

# Start the server with Gunicorn
echo "✅ Starting server on port ${PORT:-8000}..."
gunicorn main:app -c gunicorn_config.py
