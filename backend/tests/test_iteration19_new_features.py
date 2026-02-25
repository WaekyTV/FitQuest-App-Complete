"""
Iteration 19 - Backend API Tests for New Features:
1. Sleep Tracking API (/api/sleep)
2. Progression Calendar API (/api/progression/calendar)
3. Smart Planning AI API (/api/planning/generate, /api/planning/current)
4. Programs Import/Export (/api/programs/import, /api/programs/export/{id})
5. Nutrition Analyze AI (/api/nutrition/analyze)
"""

import pytest
import requests
import os
import json

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestPublicEndpoints:
    """Test public endpoints that don't require authentication"""
    
    def test_exercises_public(self):
        """GET /api/exercises should be public"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ GET /api/exercises is public (200) - {len(data)} exercises found")
        
    def test_exercises_search_public(self):
        """GET /api/exercises/search/query should be public"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=bench")
        assert response.status_code == 200
        data = response.json()
        assert "exercises" in data
        print(f"✅ GET /api/exercises/search/query is public (200)")


class TestSleepTrackingAuth:
    """Test Sleep Tracking endpoints require authentication"""
    
    def test_get_sleep_requires_auth(self):
        """GET /api/sleep should require authentication"""
        response = requests.get(f"{BASE_URL}/api/sleep?days=7")
        assert response.status_code == 401
        print("✅ GET /api/sleep requires auth (401)")
    
    def test_post_sleep_requires_auth(self):
        """POST /api/sleep should require authentication"""
        sleep_data = {
            "date": "2026-01-15",
            "bedtime": "23:00",
            "wake_time": "07:00",
            "quality": 4,
            "notes": "Test sleep entry"
        }
        response = requests.post(f"{BASE_URL}/api/sleep", json=sleep_data)
        assert response.status_code == 401
        print("✅ POST /api/sleep requires auth (401)")
    
    def test_delete_sleep_requires_auth(self):
        """DELETE /api/sleep/{date} should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/sleep/2026-01-15")
        assert response.status_code == 401
        print("✅ DELETE /api/sleep/{date} requires auth (401)")


class TestProgressionCalendarAuth:
    """Test Progression Calendar endpoint requires authentication"""
    
    def test_get_progression_calendar_requires_auth(self):
        """GET /api/progression/calendar should require authentication"""
        response = requests.get(f"{BASE_URL}/api/progression/calendar?month=1&year=2026")
        assert response.status_code == 401
        print("✅ GET /api/progression/calendar requires auth (401)")


class TestSmartPlanningAuth:
    """Test Smart Planning AI endpoints require authentication"""
    
    def test_generate_planning_requires_auth(self):
        """POST /api/planning/generate should require authentication"""
        response = requests.post(f"{BASE_URL}/api/planning/generate?goal=general&days_per_week=4")
        assert response.status_code == 401
        print("✅ POST /api/planning/generate requires auth (401)")
    
    def test_get_current_planning_requires_auth(self):
        """GET /api/planning/current should require authentication"""
        response = requests.get(f"{BASE_URL}/api/planning/current")
        assert response.status_code == 401
        print("✅ GET /api/planning/current requires auth (401)")
        
    def test_get_planning_history_requires_auth(self):
        """GET /api/planning/history should require authentication"""
        response = requests.get(f"{BASE_URL}/api/planning/history")
        assert response.status_code == 401
        print("✅ GET /api/planning/history requires auth (401)")


class TestProgramsImportExportAuth:
    """Test Programs Import/Export endpoints require authentication"""
    
    def test_import_program_requires_auth(self):
        """POST /api/programs/import should require authentication"""
        program_json = json.dumps({
            "name": "Test Program",
            "description": "Test description",
            "duration_weeks": 4,
            "days_per_week": 3,
            "workouts": []
        })
        response = requests.post(f"{BASE_URL}/api/programs/import", json={"program_json": program_json})
        assert response.status_code == 401
        print("✅ POST /api/programs/import requires auth (401)")
    
    def test_export_program_requires_auth(self):
        """GET /api/programs/export/{id} should require authentication"""
        response = requests.get(f"{BASE_URL}/api/programs/export/prog_test123")
        assert response.status_code == 401
        print("✅ GET /api/programs/export/{id} requires auth (401)")


class TestNutritionAnalyzeAuth:
    """Test Nutrition Analyze AI endpoint requires authentication"""
    
    def test_nutrition_analyze_requires_auth(self):
        """POST /api/nutrition/analyze should require authentication"""
        response = requests.post(f"{BASE_URL}/api/nutrition/analyze")
        assert response.status_code == 401
        print("✅ POST /api/nutrition/analyze requires auth (401)")


class TestExistingEndpoints:
    """Verify existing endpoints still work"""
    
    def test_programs_list_requires_auth(self):
        """GET /api/programs should require authentication"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 401
        print("✅ GET /api/programs requires auth (401)")
    
    def test_meals_requires_auth(self):
        """GET /api/meals should require authentication"""
        response = requests.get(f"{BASE_URL}/api/meals")
        assert response.status_code == 401
        print("✅ GET /api/meals requires auth (401)")
    
    def test_workouts_requires_auth(self):
        """GET /api/workouts should require authentication"""
        response = requests.get(f"{BASE_URL}/api/workouts")
        assert response.status_code == 401
        print("✅ GET /api/workouts requires auth (401)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
