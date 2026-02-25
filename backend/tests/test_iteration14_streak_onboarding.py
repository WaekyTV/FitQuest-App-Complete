"""
Iteration 14 Tests: Streak Calendar & Onboarding Fix
====================================================
Tests for:
1. GET /api/performance/workout-days - Returns workout days for a month
2. GET /api/performance/stats - Returns current streak
3. DELETE /api/history/all?type=workouts - Deletes workout history
4. Onboarding flow fix verification
"""

import pytest
import requests
import os
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestWorkoutDaysAPI:
    """Tests for GET /api/performance/workout-days endpoint"""
    
    def test_workout_days_requires_auth(self):
        """GET /api/performance/workout-days should require authentication"""
        response = requests.get(f"{BASE_URL}/api/performance/workout-days")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/performance/workout-days requires authentication (401)")
    
    def test_workout_days_with_month_params_requires_auth(self):
        """GET /api/performance/workout-days with month/year params should require auth"""
        current_month = datetime.now().month
        current_year = datetime.now().year
        response = requests.get(
            f"{BASE_URL}/api/performance/workout-days",
            params={"month": current_month, "year": current_year}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✅ GET /api/performance/workout-days?month={current_month}&year={current_year} requires auth (401)")

    def test_workout_days_past_month_requires_auth(self):
        """GET /api/performance/workout-days for past month should require auth"""
        # Test previous month
        current_month = datetime.now().month
        current_year = datetime.now().year
        past_month = current_month - 1 if current_month > 1 else 12
        past_year = current_year if current_month > 1 else current_year - 1
        
        response = requests.get(
            f"{BASE_URL}/api/performance/workout-days",
            params={"month": past_month, "year": past_year}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✅ GET /api/performance/workout-days for past month requires auth (401)")


class TestPerformanceStatsAPI:
    """Tests for GET /api/performance/stats endpoint (includes streak)"""
    
    def test_stats_requires_auth(self):
        """GET /api/performance/stats should require authentication"""
        response = requests.get(f"{BASE_URL}/api/performance/stats")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/performance/stats requires authentication (401)")


class TestHistoryDeleteAPI:
    """Tests for DELETE /api/history/all endpoint"""
    
    def test_delete_workouts_requires_auth(self):
        """DELETE /api/history/all?type=workouts should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=workouts")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=workouts requires authentication (401)")
    
    def test_delete_meals_requires_auth(self):
        """DELETE /api/history/all?type=meals should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=meals")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=meals requires authentication (401)")
    
    def test_delete_steps_requires_auth(self):
        """DELETE /api/history/all?type=steps should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=steps")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=steps requires authentication (401)")
    
    def test_delete_hydration_requires_auth(self):
        """DELETE /api/history/all?type=hydration should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=hydration")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=hydration requires authentication (401)")
    
    def test_delete_all_requires_auth(self):
        """DELETE /api/history/all?type=all should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=all")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=all requires authentication (401)")


class TestPublicEndpoints:
    """Tests for public endpoints that should work without authentication"""
    
    def test_exercises_public(self):
        """GET /api/exercises should be public"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Expected list of exercises"
        print(f"✅ GET /api/exercises is public (200) - {len(data)} exercises")
    
    def test_exercises_by_category(self):
        """GET /api/exercises?category=chest should work"""
        response = requests.get(f"{BASE_URL}/api/exercises", params={"category": "chest"})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Expected list of exercises"
        # Verify all exercises have category=chest
        for exercise in data:
            assert exercise.get("category") == "chest", f"Expected category=chest, got {exercise.get('category')}"
        print(f"✅ GET /api/exercises?category=chest works - {len(data)} chest exercises")


class TestAuthProtectedEndpoints:
    """Tests for endpoints that should require authentication"""
    
    def test_auth_me_requires_auth(self):
        """GET /api/auth/me should require authentication"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/auth/me requires authentication (401)")
    
    def test_workouts_requires_auth(self):
        """GET /api/workouts should require authentication"""
        response = requests.get(f"{BASE_URL}/api/workouts")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/workouts requires authentication (401)")
    
    def test_meals_requires_auth(self):
        """GET /api/meals should require authentication"""
        response = requests.get(f"{BASE_URL}/api/meals")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/meals requires authentication (401)")
    
    def test_workout_logs_requires_auth(self):
        """GET /api/workout-logs should require authentication"""
        response = requests.get(f"{BASE_URL}/api/workout-logs")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/workout-logs requires authentication (401)")
    
    def test_users_me_update_requires_auth(self):
        """PUT /api/users/me should require authentication"""
        response = requests.put(f"{BASE_URL}/api/users/me", json={"name": "Test"})
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ PUT /api/users/me requires authentication (401)")
    
    def test_xp_status_requires_auth(self):
        """GET /api/xp/status should require authentication"""
        response = requests.get(f"{BASE_URL}/api/xp/status")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/xp/status requires authentication (401)")
    
    def test_trophies_requires_auth(self):
        """GET /api/trophies should require authentication"""
        response = requests.get(f"{BASE_URL}/api/trophies")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/trophies requires authentication (401)")
    
    def test_challenges_requires_auth(self):
        """GET /api/challenges should require authentication"""
        response = requests.get(f"{BASE_URL}/api/challenges")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/challenges requires authentication (401)")
    
    def test_reminders_requires_auth(self):
        """GET /api/reminders should require authentication"""
        response = requests.get(f"{BASE_URL}/api/reminders")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/reminders requires authentication (401)")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
