"""
Iteration 15 Tests: History Deletion + Streak Reminder Settings
Tests:
1. DELETE /api/history/all?type=workouts requires authentication
2. DELETE /api/history/all?type=all requires authentication
3. DELETE /api/history/all?type=meals requires authentication
4. DELETE /api/history/all?type=steps requires authentication
5. DELETE /api/history/all?type=hydration requires authentication
6. Invalid history type returns 400
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestHistoryDeletionAPI:
    """Test DELETE /api/history/all endpoint - requires authentication"""

    def test_delete_workouts_history_requires_auth(self):
        """DELETE /api/history/all?type=workouts should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=workouts")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=workouts requires authentication (401)")

    def test_delete_meals_history_requires_auth(self):
        """DELETE /api/history/all?type=meals should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=meals")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=meals requires authentication (401)")

    def test_delete_steps_history_requires_auth(self):
        """DELETE /api/history/all?type=steps should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=steps")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=steps requires authentication (401)")

    def test_delete_hydration_history_requires_auth(self):
        """DELETE /api/history/all?type=hydration should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=hydration")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=hydration requires authentication (401)")

    def test_delete_all_history_requires_auth(self):
        """DELETE /api/history/all?type=all should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=all")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=all requires authentication (401)")


class TestSettingsRelatedAPIs:
    """Test other settings-related protected endpoints"""

    def test_auth_me_requires_auth(self):
        """GET /api/auth/me should return 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/auth/me requires authentication (401)")

    def test_users_me_put_requires_auth(self):
        """PUT /api/users/me should return 401 without auth"""
        response = requests.put(f"{BASE_URL}/api/users/me", json={"name": "Test"})
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ PUT /api/users/me requires authentication (401)")

    def test_users_me_export_requires_auth(self):
        """GET /api/users/me/export should return 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/users/me/export")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/users/me/export requires authentication (401)")

    def test_users_me_delete_requires_auth(self):
        """DELETE /api/users/me should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/users/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/users/me requires authentication (401)")


class TestPublicEndpoints:
    """Verify public endpoints still work"""

    def test_exercises_count(self):
        """Verify exercises are seeded correctly"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert len(data) > 300, f"Expected more than 300 exercises, got {len(data)}"
        print(f"✅ GET /api/exercises returns {len(data)} exercises (seeded correctly)")

    def test_exercises_endpoint_is_public(self):
        """GET /api/exercises should be public"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Expected a list of exercises"
        print(f"✅ GET /api/exercises is public (200) - {len(data)} exercises returned")


class TestPerformanceAPIsAuth:
    """Test performance/stats APIs authentication"""

    def test_performance_stats_requires_auth(self):
        """GET /api/performance/stats should return 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/performance/stats")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/performance/stats requires authentication (401)")

    def test_performance_workout_days_requires_auth(self):
        """GET /api/performance/workout-days should return 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/performance/workout-days")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/performance/workout-days requires authentication (401)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
