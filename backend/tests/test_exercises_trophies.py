"""
Test file for FitQuest - 334 exercises, 125 trophies, exercise search API
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestExercisesAPI:
    """Test exercises API - 334 exercises total"""
    
    def test_get_all_exercises_count(self):
        """Verify API returns exactly 334 exercises"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        exercises = response.json()
        assert isinstance(exercises, list), "Response should be a list"
        assert len(exercises) == 334, f"Expected 334 exercises, got {len(exercises)}"
        print(f"✅ GET /api/exercises returns {len(exercises)} exercises")
    
    def test_exercise_categories(self):
        """Verify exercise categories exist"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        
        exercises = response.json()
        categories = set(ex.get('category') for ex in exercises)
        
        # Expected categories based on exercises_data.py
        expected_categories = {'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'}
        
        print(f"Found categories: {categories}")
        for cat in expected_categories:
            assert cat in categories, f"Missing category: {cat}"
        print(f"✅ All expected categories present: {expected_categories}")
    
    def test_search_exercises_biceps(self):
        """Test exercise search with query 'biceps'"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=biceps")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "exercises" in data, "Response should contain 'exercises' key"
        assert "count" in data, "Response should contain 'count' key"
        assert "query" in data, "Response should contain 'query' key"
        
        assert data["query"] == "biceps", f"Query should be 'biceps', got {data['query']}"
        assert data["count"] > 0, "Should find exercises matching 'biceps'"
        
        # Verify results contain biceps-related exercises
        exercises = data["exercises"]
        assert len(exercises) > 0, "Should return at least one exercise"
        
        print(f"✅ Search 'biceps' returned {data['count']} exercises")
        for ex in exercises[:5]:
            print(f"   - {ex.get('name')} ({ex.get('category')})")
    
    def test_search_exercises_squat(self):
        """Test exercise search with query 'squat'"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=squat")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "exercises" in data
        assert data["count"] > 0, "Should find exercises matching 'squat'"
        
        # Verify at least one squat exercise is found
        exercises = data["exercises"]
        squat_found = any('squat' in ex.get('name', '').lower() for ex in exercises)
        assert squat_found, "Should find exercises with 'squat' in name"
        
        print(f"✅ Search 'squat' returned {data['count']} exercises")
        for ex in exercises[:5]:
            print(f"   - {ex.get('name')} ({ex.get('category')})")
    
    def test_search_exercises_yoga(self):
        """Test exercise search with query 'yoga'"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=yoga")
        assert response.status_code == 200
        
        data = response.json()
        print(f"✅ Search 'yoga' returned {data['count']} exercises")
        
        if data["count"] > 0:
            for ex in data["exercises"][:3]:
                print(f"   - {ex.get('name')} ({ex.get('category')})")
    
    def test_search_exercises_crossfit(self):
        """Test exercise search with query 'crossfit'"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=crossfit")
        assert response.status_code == 200
        
        data = response.json()
        print(f"✅ Search 'crossfit' returned {data['count']} exercises")
    
    def test_search_exercises_trx(self):
        """Test exercise search with query 'TRX'"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=TRX")
        assert response.status_code == 200
        
        data = response.json()
        print(f"✅ Search 'TRX' returned {data['count']} exercises")
    
    def test_search_exercises_ballon(self):
        """Test exercise search with query 'ballon'"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=ballon")
        assert response.status_code == 200
        
        data = response.json()
        print(f"✅ Search 'ballon' returned {data['count']} exercises")
    
    def test_search_with_category_filter(self):
        """Test search with category filter"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=press&category=chest")
        assert response.status_code == 200
        
        data = response.json()
        exercises = data.get("exercises", [])
        
        # All results should be from chest category
        for ex in exercises:
            assert ex.get("category") == "chest", f"Exercise {ex.get('name')} should be in chest category"
        
        print(f"✅ Search 'press' with category filter returned {data['count']} chest exercises")
    
    def test_search_with_difficulty_filter(self):
        """Test search with difficulty filter"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=&difficulty=débutant&limit=10")
        assert response.status_code == 200
        
        data = response.json()
        print(f"✅ Search with difficulty 'débutant' returned {data['count']} exercises")
    
    def test_get_exercises_by_category(self):
        """Test getting exercises filtered by category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=cardio")
        assert response.status_code == 200
        
        exercises = response.json()
        for ex in exercises:
            assert ex.get("category") == "cardio", f"All exercises should be cardio category"
        
        print(f"✅ GET /api/exercises?category=cardio returned {len(exercises)} exercises")


class TestTrophiesAPI:
    """Test trophies API - 125 trophies total (requires auth)"""
    
    def test_trophies_requires_auth(self):
        """Verify trophies endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/trophies")
        assert response.status_code == 401, f"Expected 401 Unauthorized, got {response.status_code}"
        print("✅ GET /api/trophies requires authentication (returns 401)")


class TestXPSoundsSystem:
    """Test XP system endpoints"""
    
    def test_xp_status_requires_auth(self):
        """Verify XP status endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/xp/status")
        assert response.status_code == 401, f"Expected 401 Unauthorized, got {response.status_code}"
        print("✅ GET /api/xp/status requires authentication (returns 401)")
    
    def test_xp_add_requires_auth(self):
        """Verify XP add endpoint requires authentication"""
        response = requests.post(f"{BASE_URL}/api/xp/add?action=workout_completed")
        assert response.status_code == 401, f"Expected 401 Unauthorized, got {response.status_code}"
        print("✅ POST /api/xp/add requires authentication (returns 401)")


class TestHealthCheck:
    """Basic health checks"""
    
    def test_api_health(self):
        """Basic API health check"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        print("✅ API is healthy and responding")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
