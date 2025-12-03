"""
Health Endpoint Tests
=====================
Tests for /health and /ready endpoints
"""
import pytest


class TestHealthEndpoint:
    """Tests for the health check endpoint"""

    def test_health_check_returns_ok(self, client):
        """Test that /health returns status ok"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "message" in data
        assert "version" in data
        assert "timestamp" in data

    def test_health_check_api_v1_returns_ok(self, client):
        """Test that /api/v1/health returns status ok"""
        response = client.get("/api/v1/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["version"] == "1.0.0"

    def test_health_includes_ai_configured_flag(self, client):
        """Test that health check includes AI configuration status"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert "ai_configured" in data
        assert isinstance(data["ai_configured"], bool)


class TestReadinessEndpoint:
    """Tests for the readiness check endpoint"""

    def test_ready_returns_ok(self, client):
        """Test that /ready returns status ok"""
        response = client.get("/ready")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["ready"] == True

    def test_ready_api_v1_returns_ok(self, client):
        """Test that /api/v1/ready returns status ok"""
        response = client.get("/api/v1/ready")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"

    def test_ready_includes_timestamp(self, client):
        """Test that readiness check includes timestamp"""
        response = client.get("/ready")
        
        assert response.status_code == 200
        data = response.json()
        assert "timestamp" in data
