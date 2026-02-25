"""
Test iteration 10 - New Features: Hydration tracking, Steps tracking, Reminders, History deletion
All endpoints require authentication - test 401 for unauthenticated requests
"""
import pytest
import requests
import os
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHydrationAPI:
    """Test hydration tracking endpoints - require authentication"""
    
    def test_get_hydration_requires_auth(self):
        """GET /api/hydration should return 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/hydration")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/hydration returns 401 without auth")
    
    def test_add_water_requires_auth(self):
        """POST /api/hydration/add should return 401 without auth"""
        response = requests.post(f"{BASE_URL}/api/hydration/add")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/hydration/add returns 401 without auth")
    
    def test_remove_water_requires_auth(self):
        """POST /api/hydration/remove should return 401 without auth"""
        response = requests.post(f"{BASE_URL}/api/hydration/remove")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/hydration/remove returns 401 without auth")


class TestStepsAPI:
    """Test steps tracking endpoints - require authentication"""
    
    def test_get_steps_requires_auth(self):
        """GET /api/steps should return 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/steps")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/steps returns 401 without auth")
    
    def test_update_steps_requires_auth(self):
        """POST /api/steps should return 401 without auth"""
        response = requests.post(
            f"{BASE_URL}/api/steps",
            json={"steps": 5000, "date": "2026-01-15"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/steps returns 401 without auth")
    
    def test_get_steps_history_requires_auth(self):
        """GET /api/steps/history should return 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/steps/history")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/steps/history returns 401 without auth")


class TestRemindersAPI:
    """Test reminders endpoints - require authentication"""
    
    def test_get_reminders_requires_auth(self):
        """GET /api/reminders should return 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/reminders")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/reminders returns 401 without auth")
    
    def test_create_reminder_requires_auth(self):
        """POST /api/reminders should return 401 without auth"""
        response = requests.post(
            f"{BASE_URL}/api/reminders",
            json={
                "type": "workout",
                "title": "Test reminder",
                "time": "09:00",
                "days": ["monday", "wednesday"],
                "enabled": True
            }
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/reminders returns 401 without auth")
    
    def test_delete_reminder_requires_auth(self):
        """DELETE /api/reminders/{id} should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/reminders/rem_test123")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/reminders/{id} returns 401 without auth")
    
    def test_toggle_reminder_requires_auth(self):
        """PATCH /api/reminders/{id}/toggle should return 401 without auth"""
        response = requests.patch(f"{BASE_URL}/api/reminders/rem_test123/toggle")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ PATCH /api/reminders/{id}/toggle returns 401 without auth")


class TestHistoryDeletionAPI:
    """Test history deletion endpoints - require authentication"""
    
    def test_delete_all_history_hydration_requires_auth(self):
        """DELETE /api/history/all?type=hydration should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=hydration")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=hydration returns 401 without auth")
    
    def test_delete_all_history_steps_requires_auth(self):
        """DELETE /api/history/all?type=steps should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=steps")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=steps returns 401 without auth")
    
    def test_delete_hydration_by_date_requires_auth(self):
        """DELETE /api/history/hydration/{date} should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/history/hydration/2026-01-15")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/hydration/{date} returns 401 without auth")
    
    def test_delete_steps_by_date_requires_auth(self):
        """DELETE /api/history/steps/{date} should return 401 without auth"""
        response = requests.delete(f"{BASE_URL}/api/history/steps/2026-01-15")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/steps/{date} returns 401 without auth")


class TestPublicExercisesAPI:
    """Test public exercises endpoints (no auth required) - sanity check"""
    
    def test_get_exercises_no_auth_required(self):
        """GET /api/exercises should work without auth"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Exercises should be a list"
        assert len(data) > 0, "Should return at least one exercise"
        
        # Verify exercise structure
        exercise = data[0]
        assert "exercise_id" in exercise
        assert "name" in exercise
        assert "category" in exercise
        print(f"✅ GET /api/exercises returns {len(data)} exercises without auth")
    
    def test_search_exercises_no_auth_required(self):
        """GET /api/exercises/search/query should work without auth"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=squat")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "exercises" in data
        assert "count" in data
        print(f"✅ GET /api/exercises/search/query returns {data['count']} results without auth")


class TestAPIEndpointExistence:
    """Verify all new endpoints exist by checking they return 401 (not 404)"""
    
    def test_hydration_endpoints_exist(self):
        """Verify hydration endpoints are routed correctly"""
        endpoints = [
            ("GET", "/api/hydration"),
            ("POST", "/api/hydration/add"),
            ("POST", "/api/hydration/remove"),
            ("PUT", "/api/hydration/target?target=10"),
        ]
        
        for method, endpoint in endpoints:
            if method == "GET":
                response = requests.get(f"{BASE_URL}{endpoint}")
            elif method == "POST":
                response = requests.post(f"{BASE_URL}{endpoint}")
            elif method == "PUT":
                response = requests.put(f"{BASE_URL}{endpoint}")
            
            # Should be 401 (not 404) - meaning endpoint exists but requires auth
            assert response.status_code == 401, f"{method} {endpoint} returned {response.status_code}, expected 401"
            print(f"✅ {method} {endpoint} endpoint exists (returns 401)")
    
    def test_steps_endpoints_exist(self):
        """Verify steps endpoints are routed correctly"""
        endpoints = [
            ("GET", "/api/steps"),
            ("GET", "/api/steps/history"),
        ]
        
        for method, endpoint in endpoints:
            response = requests.get(f"{BASE_URL}{endpoint}")
            assert response.status_code == 401, f"{method} {endpoint} returned {response.status_code}, expected 401"
            print(f"✅ {method} {endpoint} endpoint exists (returns 401)")
    
    def test_reminders_endpoints_exist(self):
        """Verify reminders endpoints are routed correctly"""
        endpoints = [
            ("GET", "/api/reminders"),
        ]
        
        for method, endpoint in endpoints:
            response = requests.get(f"{BASE_URL}{endpoint}")
            assert response.status_code == 401, f"{method} {endpoint} returned {response.status_code}, expected 401"
            print(f"✅ {method} {endpoint} endpoint exists (returns 401)")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
