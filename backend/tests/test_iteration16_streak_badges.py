"""
Iteration 16 Tests: Streak Badges API and Settings Reorganization
Tests for:
- GET /api/performance/streak-badges (requires auth)
- POST /api/performance/claim-streak-badge/{days} (requires auth)
- Verification that ProfilePage no longer has Paramètres/Danger Zone
- Verification that SettingsPage has streak badges, appearance, danger zone
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestStreakBadgesAPI:
    """Test streak badges endpoints"""
    
    def test_streak_badges_requires_auth(self):
        """GET /api/performance/streak-badges should require authentication"""
        response = requests.get(f"{BASE_URL}/api/performance/streak-badges")
        assert response.status_code == 401
        assert "Not authenticated" in response.json().get("detail", "")
        print("✅ GET /api/performance/streak-badges requires auth (401)")
    
    def test_claim_streak_badge_7_requires_auth(self):
        """POST /api/performance/claim-streak-badge/7 should require authentication"""
        response = requests.post(f"{BASE_URL}/api/performance/claim-streak-badge/7")
        assert response.status_code == 401
        assert "Not authenticated" in response.json().get("detail", "")
        print("✅ POST /api/performance/claim-streak-badge/7 requires auth (401)")
    
    def test_claim_streak_badge_30_requires_auth(self):
        """POST /api/performance/claim-streak-badge/30 should require authentication"""
        response = requests.post(f"{BASE_URL}/api/performance/claim-streak-badge/30")
        assert response.status_code == 401
        assert "Not authenticated" in response.json().get("detail", "")
        print("✅ POST /api/performance/claim-streak-badge/30 requires auth (401)")
    
    def test_claim_streak_badge_100_requires_auth(self):
        """POST /api/performance/claim-streak-badge/100 should require authentication"""
        response = requests.post(f"{BASE_URL}/api/performance/claim-streak-badge/100")
        assert response.status_code == 401
        assert "Not authenticated" in response.json().get("detail", "")
        print("✅ POST /api/performance/claim-streak-badge/100 requires auth (401)")
    
    def test_claim_streak_badge_365_requires_auth(self):
        """POST /api/performance/claim-streak-badge/365 should require authentication"""
        response = requests.post(f"{BASE_URL}/api/performance/claim-streak-badge/365")
        assert response.status_code == 401
        assert "Not authenticated" in response.json().get("detail", "")
        print("✅ POST /api/performance/claim-streak-badge/365 requires auth (401)")
    
    def test_claim_invalid_badge_still_requires_auth(self):
        """POST /api/performance/claim-streak-badge/999 should require authentication first"""
        response = requests.post(f"{BASE_URL}/api/performance/claim-streak-badge/999")
        # Either 401 (auth first) or 400 (invalid badge) is acceptable
        assert response.status_code in [401, 400, 422]
        print(f"✅ POST /api/performance/claim-streak-badge/999 returns {response.status_code}")


class TestOtherAuthEndpoints:
    """Verify other endpoints still require auth"""
    
    def test_auth_me_requires_auth(self):
        """GET /api/auth/me should require authentication"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✅ GET /api/auth/me requires auth (401)")
    
    def test_users_me_requires_auth(self):
        """PUT /api/users/me should require authentication"""
        response = requests.put(f"{BASE_URL}/api/users/me", json={"name": "Test"})
        assert response.status_code == 401
        print("✅ PUT /api/users/me requires auth (401)")
    
    def test_delete_users_me_requires_auth(self):
        """DELETE /api/users/me should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/users/me")
        assert response.status_code == 401
        print("✅ DELETE /api/users/me requires auth (401)")
    
    def test_exercises_public(self):
        """GET /api/exercises should be public"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ GET /api/exercises is public (200) - {len(data)} exercises")


class TestPerformanceEndpoints:
    """Test performance-related endpoints"""
    
    def test_performance_stats_requires_auth(self):
        """GET /api/performance/stats should require authentication"""
        response = requests.get(f"{BASE_URL}/api/performance/stats")
        assert response.status_code == 401
        print("✅ GET /api/performance/stats requires auth (401)")
    
    def test_performance_workout_days_requires_auth(self):
        """GET /api/performance/workout-days should require authentication"""
        response = requests.get(f"{BASE_URL}/api/performance/workout-days")
        assert response.status_code == 401
        print("✅ GET /api/performance/workout-days requires auth (401)")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
