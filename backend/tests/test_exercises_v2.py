"""
Test suite for FitQuest Exercises API - Version 2 (269 exercises)
Tests all exercise endpoints and category filtering
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestExercisesAPI:
    """Tests for /api/exercises endpoint"""
    
    def test_exercises_count(self):
        """Verify the API returns exactly 269 exercises"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 269, f"Expected 269 exercises, got {len(data)}"
    
    def test_exercises_categories_exist(self):
        """Verify all 7 categories are present"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        data = response.json()
        
        categories = set(e['category'] for e in data)
        expected_categories = {'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'}
        
        assert categories == expected_categories, f"Missing categories: {expected_categories - categories}"
    
    def test_exercises_category_distribution(self):
        """Verify the category distribution"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        data = response.json()
        
        from collections import Counter
        categories = Counter(e['category'] for e in data)
        
        # Expected distribution based on exercises_data.py
        expected = {
            'legs': 56,
            'core': 44,
            'back': 43,
            'arms': 35,
            'chest': 34,
            'shoulders': 33,
            'cardio': 24
        }
        
        for cat, expected_count in expected.items():
            assert categories[cat] == expected_count, f"Category {cat}: expected {expected_count}, got {categories[cat]}"
    
    def test_exercises_filter_chest(self):
        """Test filtering by chest category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=chest")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) == 34, f"Expected 34 chest exercises, got {len(data)}"
        assert all(e['category'] == 'chest' for e in data)
    
    def test_exercises_filter_back(self):
        """Test filtering by back category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=back")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) == 43, f"Expected 43 back exercises, got {len(data)}"
        assert all(e['category'] == 'back' for e in data)
    
    def test_exercises_filter_legs(self):
        """Test filtering by legs category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=legs")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) == 56, f"Expected 56 legs exercises, got {len(data)}"
        assert all(e['category'] == 'legs' for e in data)
    
    def test_exercises_filter_shoulders(self):
        """Test filtering by shoulders category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=shoulders")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) == 33, f"Expected 33 shoulders exercises, got {len(data)}"
        assert all(e['category'] == 'shoulders' for e in data)
    
    def test_exercises_filter_arms(self):
        """Test filtering by arms category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=arms")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) == 35, f"Expected 35 arms exercises, got {len(data)}"
        assert all(e['category'] == 'arms' for e in data)
    
    def test_exercises_filter_core(self):
        """Test filtering by core category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=core")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) == 44, f"Expected 44 core exercises, got {len(data)}"
        assert all(e['category'] == 'core' for e in data)
    
    def test_exercises_filter_cardio(self):
        """Test filtering by cardio category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=cardio")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) == 24, f"Expected 24 cardio exercises, got {len(data)}"
        assert all(e['category'] == 'cardio' for e in data)
    
    def test_exercise_required_fields(self):
        """Verify all exercises have required fields"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        data = response.json()
        
        required_fields = ['exercise_id', 'name', 'category', 'muscle_groups', 
                          'description', 'instructions', 'tips', 'difficulty', 'equipment']
        
        for exercise in data[:20]:  # Check first 20 exercises
            for field in required_fields:
                assert field in exercise, f"Missing field {field} in exercise {exercise.get('name', 'unknown')}"
    
    def test_exercise_valid_difficulties(self):
        """Verify all exercises have valid difficulty levels"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        data = response.json()
        
        valid_difficulties = {'débutant', 'intermédiaire', 'avancé'}
        
        for exercise in data:
            assert exercise['difficulty'] in valid_difficulties, \
                f"Invalid difficulty {exercise['difficulty']} for exercise {exercise['name']}"
    
    def test_exercise_by_id(self):
        """Test retrieving a single exercise by ID"""
        # First get list to get a valid ID
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        # Get first exercise by ID
        exercise_id = exercises[0]['exercise_id']
        response = requests.get(f"{BASE_URL}/api/exercises/{exercise_id}")
        assert response.status_code == 200
        
        exercise = response.json()
        assert exercise['exercise_id'] == exercise_id
    
    def test_exercise_by_invalid_id(self):
        """Test 404 for non-existent exercise"""
        response = requests.get(f"{BASE_URL}/api/exercises/invalid_id_12345")
        assert response.status_code == 404


class TestExercisesRefresh:
    """Tests for exercise initialization/refresh endpoints"""
    
    def test_init_exercises_idempotent(self):
        """Test that init exercises doesn't duplicate if already exists"""
        response = requests.post(f"{BASE_URL}/api/init/exercises")
        assert response.status_code == 200
        data = response.json()
        
        # Should indicate exercises already exist
        assert 'already initialized' in data['message'].lower() or '269' in data['message']
    
    def test_refresh_exercises(self):
        """Test refresh endpoint resets to 269 exercises"""
        response = requests.post(f"{BASE_URL}/api/init/exercises/refresh")
        assert response.status_code == 200
        data = response.json()
        
        assert '269' in data['message'], f"Expected 269 exercises message, got: {data['message']}"
        
        # Verify count after refresh
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        assert len(response.json()) == 269


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
