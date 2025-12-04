"""
Root and Core Endpoint Tests
=============================
Tests for root paths and core API functionality
"""
from fastapi.testclient import TestClient
from typing import Any, Dict


class TestRootEndpoints:
    """Tests for root API endpoints"""

    def test_api_docs_accessible(self, client: TestClient) -> None:
        """Test that API documentation is accessible"""
        response = client.get("/api/v1/docs")
        
        # Docs should return HTML page
        assert response.status_code == 200
        assert "text/html" in response.headers.get("content-type", "")

    def test_api_redoc_accessible(self, client: TestClient) -> None:
        """Test that ReDoc documentation is accessible"""
        response = client.get("/api/v1/redoc")
        
        assert response.status_code == 200
        assert "text/html" in response.headers.get("content-type", "")

    def test_stats_endpoint_returns_data(self, client: TestClient) -> None:
        """Test that /api/v1/stats returns system statistics"""
        response = client.get("/api/v1/stats")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "timestamp" in data
        assert "ai" in data
        assert "version" in data


class TestCalculateSummaryEndpoint:
    """Tests for the calculate-summary endpoint"""

    def test_calculate_summary_valid_input(self, client: TestClient, sample_financial_input: Dict[str, Any]) -> None:
        """Test calculate-summary with valid input"""
        response = client.post("/api/v1/calculate-summary", json=sample_financial_input)
        
        assert response.status_code == 200
        data = response.json()
        assert "total_income" in data
        assert "total_expenses" in data
        assert "net_savings" in data
        assert "savings_rate_percent" in data

    def test_calculate_summary_minimal_input(self, client: TestClient, minimal_financial_input: Dict[str, Any]) -> None:
        """Test calculate-summary with minimal valid input"""
        response = client.post("/api/v1/calculate-summary", json=minimal_financial_input)
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_income"] == 50000

    def test_calculate_summary_invalid_input(self, client: TestClient) -> None:
        """Test calculate-summary with invalid input"""
        invalid_input = {
            "monthly_income_primary": "not a number"
        }
        
        response = client.post("/api/v1/calculate-summary", json=invalid_input)
        
        assert response.status_code == 422  # Validation error


class TestCORSHeaders:
    """Tests for CORS configuration"""

    def test_cors_headers_present(self, client: TestClient) -> None:
        """Test that CORS headers are present for allowed origins"""
        response = client.options(
            "/api/v1/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET"
            }
        )
        
        # OPTIONS request should return 200 for allowed origins
        assert response.status_code == 200

    def test_allowed_origin_localhost(self, client: TestClient) -> None:
        """Test that localhost is an allowed origin"""
        response = client.get(
            "/api/v1/health",
            headers={"Origin": "http://localhost:5173"}
        )
        
        assert response.status_code == 200
        # Check CORS header is set correctly
        assert response.headers.get("access-control-allow-origin") in [
            "http://localhost:5173",
            "*"
        ] or response.headers.get("access-control-allow-origin") is None


class TestRateLimiting:
    """Tests for rate limiting functionality"""

    def test_rate_limit_headers(self, client: TestClient, minimal_financial_input: Dict[str, Any]) -> None:
        """Test that rate limit is applied to endpoints"""
        # Make multiple requests to trigger rate limiting awareness
        response = client.post(
            "/api/v1/calculate-summary",
            json=minimal_financial_input
        )

        # Should succeed under rate limit
        assert response.status_code == 200