"""
Test iteration 17: Streak badges moved to TrophiesPage, history deletion, onboarding loop fix
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHistoryDeletionEndpoint:
    """Test DELETE /api/history/all endpoint"""
    
    def test_delete_history_requires_auth(self):
        """DELETE /api/history/all should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=workouts")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=workouts requires authentication (401)")
    
    def test_delete_meals_history_requires_auth(self):
        """DELETE /api/history/all?type=meals should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=meals")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=meals requires authentication (401)")
    
    def test_delete_steps_history_requires_auth(self):
        """DELETE /api/history/all?type=steps should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=steps")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=steps requires authentication (401)")
    
    def test_delete_hydration_history_requires_auth(self):
        """DELETE /api/history/all?type=hydration should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=hydration")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=hydration requires authentication (401)")
    
    def test_delete_all_history_requires_auth(self):
        """DELETE /api/history/all?type=all should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=all")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=all requires authentication (401)")


class TestStreakBadgesOnTrophies:
    """Test streak badges API endpoints"""
    
    def test_get_streak_badges_requires_auth(self):
        """GET /api/performance/streak-badges requires authentication"""
        response = requests.get(f"{BASE_URL}/api/performance/streak-badges")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/performance/streak-badges requires authentication (401)")
    
    def test_claim_streak_badge_7_requires_auth(self):
        """POST /api/performance/claim-streak-badge/7 requires authentication"""
        response = requests.post(f"{BASE_URL}/api/performance/claim-streak-badge/7")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/performance/claim-streak-badge/7 requires authentication (401)")
    
    def test_claim_streak_badge_30_requires_auth(self):
        """POST /api/performance/claim-streak-badge/30 requires authentication"""
        response = requests.post(f"{BASE_URL}/api/performance/claim-streak-badge/30")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/performance/claim-streak-badge/30 requires authentication (401)")


class TestTrophiesEndpoint:
    """Test trophies API endpoint"""
    
    def test_get_trophies_requires_auth(self):
        """GET /api/trophies requires authentication"""
        response = requests.get(f"{BASE_URL}/api/trophies")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/trophies requires authentication (401)")


class TestPublicEndpoints:
    """Test public endpoints still work"""
    
    def test_get_exercises_is_public(self):
        """GET /api/exercises should be public"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Expected a list of exercises"
        print(f"✅ GET /api/exercises is public (200) - {len(data)} exercises returned")
    
    def test_exercises_search(self):
        """Test exercises search is public"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=squat&limit=10")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "exercises" in data
        print(f"✅ GET /api/exercises/search/query is public (200) - {data.get('count', 0)} results")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
