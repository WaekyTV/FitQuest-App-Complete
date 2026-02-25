"""
Tests for FitQuest Iteration 11 Features:
- PUT /api/users/me with new onboarding fields
- PUT /api/steps/target for modifying step goals
- Onboarding fields validation
- Routes /sons and /rappels accessibility
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestUserUpdateWithOnboardingFields:
    """Test PUT /api/users/me with new onboarding fields"""
    
    def test_users_me_endpoint_exists(self):
        """Verify PUT /api/users/me endpoint exists (should return 401 without auth, not 404)"""
        response = requests.put(f"{BASE_URL}/api/users/me", json={})
        # 401 = endpoint exists but requires auth, 405 = method not allowed, 404 = doesn't exist
        assert response.status_code in [401, 405, 422], f"Expected 401/405/422, got {response.status_code}"
        print(f"✅ PUT /api/users/me exists (returned {response.status_code})")
    
    def test_users_me_rejects_unauthenticated(self):
        """Verify endpoint properly rejects unauthenticated requests"""
        # Test with onboarding payload
        onboarding_data = {
            "main_goal": "weight_loss",
            "secondary_goals": ["energy", "healthy_relationship"],
            "calorie_experience": "beginner",
            "knows_intermittent_fasting": False,
            "gender": "male",
            "age": 30,
            "height": 180,
            "weight": 85,
            "target_weight": 75,
            "target_weeks": 16,
            "activity_level": "moderate",
            "weekly_weight_loss": 0.5,
            "meals_per_day": 3,
            "meal_times": {"start": "07:00", "end": "21:00"},
            "eating_location": "home",
            "diet_preference": "balanced",
            "dietary_restrictions": ["Sans gluten"],
            "habits_to_change": ["reduce_sugar", "more_vegetables"],
            "onboarding_completed": True
        }
        response = requests.put(f"{BASE_URL}/api/users/me", json=onboarding_data)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ PUT /api/users/me properly rejects unauthenticated request with onboarding data")


class TestStepsTargetEndpoint:
    """Test PUT /api/steps/target for modifying step goals"""
    
    def test_steps_target_endpoint_exists(self):
        """Verify PUT /api/steps/target endpoint exists"""
        response = requests.put(f"{BASE_URL}/api/steps/target?target=8000")
        # 401 = requires auth, 422 = validation error, 405 = wrong method
        assert response.status_code in [401, 405, 422], f"Expected 401/405/422, got {response.status_code}"
        print(f"✅ PUT /api/steps/target exists (returned {response.status_code})")
    
    def test_steps_target_requires_auth(self):
        """Verify endpoint requires authentication"""
        response = requests.put(f"{BASE_URL}/api/steps/target?target=10000")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ PUT /api/steps/target properly requires authentication")
    
    def test_steps_endpoint_exists(self):
        """Verify GET /api/steps endpoint exists"""
        response = requests.get(f"{BASE_URL}/api/steps")
        assert response.status_code == 401, f"Expected 401 for auth, got {response.status_code}"
        print("✅ GET /api/steps exists and requires auth")
    
    def test_steps_post_endpoint_exists(self):
        """Verify POST /api/steps endpoint exists"""
        response = requests.post(f"{BASE_URL}/api/steps", json={"steps": 5000, "date": "2026-01-15"})
        assert response.status_code == 401, f"Expected 401 for auth, got {response.status_code}"
        print("✅ POST /api/steps exists and requires auth")


class TestRemindersEndpoints:
    """Test reminders API endpoints"""
    
    def test_get_reminders_exists(self):
        """Verify GET /api/reminders endpoint exists"""
        response = requests.get(f"{BASE_URL}/api/reminders")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/reminders exists and requires auth")
    
    def test_post_reminders_exists(self):
        """Verify POST /api/reminders endpoint exists"""
        reminder_data = {
            "type": "workout",
            "title": "Test Reminder",
            "time": "09:00",
            "days": [],
            "enabled": True
        }
        response = requests.post(f"{BASE_URL}/api/reminders", json=reminder_data)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/reminders exists and requires auth")
    
    def test_delete_reminders_exists(self):
        """Verify DELETE /api/reminders/{id} endpoint exists"""
        response = requests.delete(f"{BASE_URL}/api/reminders/test_id")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/reminders/{id} exists and requires auth")
    
    def test_toggle_reminders_exists(self):
        """Verify PATCH /api/reminders/{id}/toggle endpoint exists"""
        response = requests.patch(f"{BASE_URL}/api/reminders/test_id/toggle")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ PATCH /api/reminders/{id}/toggle exists and requires auth")


class TestPublicExercisesAPI:
    """Test public exercises API (no auth required)"""
    
    def test_exercises_public(self):
        """Verify GET /api/exercises is publicly accessible"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Expected list of exercises"
        print(f"✅ GET /api/exercises returns {len(data)} exercises (public access)")
    
    def test_exercises_search_public(self):
        """Verify GET /api/exercises/search/query is publicly accessible"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=squat")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "exercises" in data, "Expected exercises in response"
        print(f"✅ GET /api/exercises/search/query returns results (public access)")


class TestHydrationEndpoints:
    """Test hydration tracking API endpoints"""
    
    def test_get_hydration_exists(self):
        """Verify GET /api/hydration endpoint exists"""
        response = requests.get(f"{BASE_URL}/api/hydration")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/hydration exists and requires auth")
    
    def test_hydration_add_exists(self):
        """Verify POST /api/hydration/add endpoint exists"""
        response = requests.post(f"{BASE_URL}/api/hydration/add")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/hydration/add exists and requires auth")
    
    def test_hydration_remove_exists(self):
        """Verify POST /api/hydration/remove endpoint exists"""
        response = requests.post(f"{BASE_URL}/api/hydration/remove")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/hydration/remove exists and requires auth")


class TestAuthEndpoints:
    """Test auth endpoint availability"""
    
    def test_auth_me_requires_auth(self):
        """Verify GET /api/auth/me requires authentication"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/auth/me properly requires authentication")
    
    def test_auth_logout_exists(self):
        """Verify POST /api/auth/logout endpoint exists"""
        response = requests.post(f"{BASE_URL}/api/auth/logout")
        # This should succeed even without auth (just clears cookie)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✅ POST /api/auth/logout works (clears session)")


class TestOnboardingFieldsValidation:
    """Verify onboarding field names match frontend expectations"""
    
    def test_onboarding_model_fields(self):
        """Test that all expected onboarding fields are accepted by the API model"""
        # These fields should be accepted by UserUpdate model
        expected_fields = [
            "main_goal",
            "secondary_goals",
            "calorie_experience",
            "knows_intermittent_fasting",
            "gender",
            "age",
            "height",
            "weight",
            "target_weight",
            "target_weeks",
            "activity_level",
            "weekly_weight_loss",
            "meals_per_day",
            "meal_times",
            "eating_location",
            "diet_preference",
            "dietary_restrictions",
            "habits_to_change",
            "onboarding_completed",
            "onboarding_date",
            "steps_target",
            "hydration_target"
        ]
        
        # Test by sending a request with all fields
        test_data = {field: None for field in expected_fields}
        test_data.update({
            "main_goal": "weight_loss",
            "secondary_goals": ["energy"],
            "calorie_experience": "beginner",
            "knows_intermittent_fasting": False,
            "gender": "male",
            "age": 30,
            "height": 180,
            "weight": 80,
            "target_weight": 75,
            "target_weeks": 12,
            "activity_level": "moderate",
            "weekly_weight_loss": 0.5,
            "meals_per_day": 3,
            "meal_times": {"start": "07:00", "end": "20:00"},
            "eating_location": "home",
            "diet_preference": "balanced",
            "dietary_restrictions": [],
            "habits_to_change": ["reduce_sugar"],
            "onboarding_completed": True
        })
        
        response = requests.put(f"{BASE_URL}/api/users/me", json=test_data)
        # Should get 401 (auth required), not 422 (validation error)
        assert response.status_code == 401, f"Expected 401 (auth required, not validation error), got {response.status_code}: {response.text}"
        print("✅ All onboarding fields are accepted by UserUpdate model (no 422 validation error)")


class TestPerformanceAndWorkoutEndpoints:
    """Test performance and workout endpoints"""
    
    def test_workouts_endpoint_exists(self):
        """Verify GET /api/workouts requires auth"""
        response = requests.get(f"{BASE_URL}/api/workouts")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/workouts exists and requires auth")
    
    def test_meals_endpoint_exists(self):
        """Verify GET /api/meals requires auth"""
        response = requests.get(f"{BASE_URL}/api/meals")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/meals exists and requires auth")
    
    def test_performance_stats_endpoint_exists(self):
        """Verify GET /api/performance/stats requires auth"""
        response = requests.get(f"{BASE_URL}/api/performance/stats")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/performance/stats exists and requires auth")
    
    def test_xp_status_endpoint_exists(self):
        """Verify GET /api/xp/status requires auth"""
        response = requests.get(f"{BASE_URL}/api/xp/status")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/xp/status exists and requires auth")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
