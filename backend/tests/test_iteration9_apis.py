"""
Backend API Tests - Iteration 9
Testing: exercises API, search API, trophies API (requires auth)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://fitquest-v2.preview.emergentagent.com')


class TestExercisesAPI:
    """Test /api/exercises endpoints"""
    
    def test_exercises_endpoint_status(self):
        """GET /api/exercises returns 200"""
        response = requests.get(f"{BASE_URL}/api/exercises", timeout=10)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✅ GET /api/exercises returned status 200")
    
    def test_exercises_returns_list(self):
        """GET /api/exercises returns a list of exercises"""
        response = requests.get(f"{BASE_URL}/api/exercises", timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list), "Expected list of exercises"
        assert len(data) > 0, "Expected at least one exercise"
        print(f"✅ GET /api/exercises returned {len(data)} exercises")
    
    def test_exercises_have_required_fields(self):
        """Exercises have required fields: exercise_id, name, category"""
        response = requests.get(f"{BASE_URL}/api/exercises", timeout=10)
        assert response.status_code == 200
        data = response.json()
        first_exercise = data[0]
        
        assert "exercise_id" in first_exercise, "Missing exercise_id"
        assert "name" in first_exercise, "Missing name"
        assert "category" in first_exercise, "Missing category"
        assert "muscle_groups" in first_exercise, "Missing muscle_groups"
        print(f"✅ Exercise has all required fields: {first_exercise['name']}")
    
    def test_exercises_filter_by_category(self):
        """Filter exercises by category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=legs", timeout=10)
        assert response.status_code == 200
        data = response.json()
        
        # All exercises should be in legs category
        for exercise in data:
            assert exercise["category"] == "legs", f"Expected 'legs', got '{exercise['category']}'"
        print(f"✅ Filter by category works - {len(data)} leg exercises")


class TestExerciseSearchAPI:
    """Test /api/exercises/search/query endpoint"""
    
    def test_search_squat(self):
        """Search for 'squat' exercises"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=squat", timeout=10)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "query" in data, "Missing query field in response"
        assert "count" in data, "Missing count field in response"
        assert "exercises" in data, "Missing exercises field in response"
        
        assert data["count"] > 0, "Expected at least one squat exercise"
        print(f"✅ Search 'squat' returned {data['count']} results")
    
    def test_search_biceps(self):
        """Search for 'biceps' exercises"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=biceps", timeout=10)
        assert response.status_code == 200
        
        data = response.json()
        assert data["count"] > 0, "Expected at least one biceps exercise"
        print(f"✅ Search 'biceps' returned {data['count']} results")
    
    def test_search_with_category_filter(self):
        """Search with category filter"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=curl&category=arms", timeout=10)
        assert response.status_code == 200
        
        data = response.json()
        # All returned exercises should be in 'arms' category
        for exercise in data["exercises"]:
            assert exercise["category"] == "arms", f"Expected 'arms', got '{exercise['category']}'"
        print(f"✅ Search with category filter works - {data['count']} results")
    
    def test_search_empty_query(self):
        """Search with empty query returns results"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=", timeout=10)
        assert response.status_code == 200
        
        data = response.json()
        assert "exercises" in data
        print(f"✅ Empty query search works - {data['count']} results")


class TestTrophiesAPI:
    """Test /api/trophies endpoint - requires authentication"""
    
    def test_trophies_requires_auth(self):
        """GET /api/trophies without auth returns 401"""
        response = requests.get(f"{BASE_URL}/api/trophies", timeout=10)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✅ GET /api/trophies requires authentication (401)")
    
    def test_trophies_error_message(self):
        """GET /api/trophies returns proper error message"""
        response = requests.get(f"{BASE_URL}/api/trophies", timeout=10)
        assert response.status_code == 401
        
        data = response.json()
        assert "detail" in data, "Expected error detail in response"
        print(f"✅ Error message: {data['detail']}")


class TestXPStatusAPI:
    """Test /api/xp/status endpoint - requires authentication"""
    
    def test_xp_status_requires_auth(self):
        """GET /api/xp/status without auth returns 401"""
        response = requests.get(f"{BASE_URL}/api/xp/status", timeout=10)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✅ GET /api/xp/status requires authentication (401)")


class TestHealthCheck:
    """Basic health checks"""
    
    def test_api_root_accessible(self):
        """API root is accessible"""
        response = requests.get(f"{BASE_URL}/api/exercises", timeout=10)
        assert response.status_code == 200
        print(f"✅ API is accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
