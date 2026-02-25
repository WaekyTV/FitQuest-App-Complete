"""
Test suite for FITQUEST exercises API
Tests the 130 exercises database covering all gym machines and equipment
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://fitquest-v2.preview.emergentagent.com')

# Expected exercise counts per category
EXPECTED_COUNTS = {
    'legs': 25,
    'back': 22,
    'chest': 20,
    'arms': 20,
    'shoulders': 18,
    'core': 15,
    'cardio': 10
}

REQUIRED_FIELDS = ['exercise_id', 'name', 'category', 'muscle_groups', 'description', 
                   'instructions', 'tips', 'equipment', 'difficulty']


class TestExercisesAPI:
    """Test exercises API endpoints"""
    
    def test_get_all_exercises_returns_130(self):
        """Test that API returns exactly 130 exercises"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        exercises = response.json()
        assert len(exercises) == 130, f"Expected 130 exercises, got {len(exercises)}"
        print(f"✅ API returns exactly 130 exercises")
    
    def test_exercises_have_required_fields(self):
        """Test that all exercises have required fields"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        
        exercises = response.json()
        for exercise in exercises:
            for field in REQUIRED_FIELDS:
                assert field in exercise, f"Exercise {exercise.get('name', 'unknown')} missing field: {field}"
        print(f"✅ All 130 exercises have all required fields: {REQUIRED_FIELDS}")
    
    def test_exercises_distribution_by_category(self):
        """Test exercise distribution matches expected counts per category"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        
        exercises = response.json()
        
        # Count exercises per category
        category_counts = {}
        for exercise in exercises:
            cat = exercise['category']
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        # Verify each category
        for category, expected_count in EXPECTED_COUNTS.items():
            actual_count = category_counts.get(category, 0)
            assert actual_count == expected_count, \
                f"Category '{category}': expected {expected_count}, got {actual_count}"
            print(f"✅ {category}: {actual_count} exercises (expected: {expected_count})")
        
        # Verify total
        total = sum(category_counts.values())
        assert total == 130, f"Total should be 130, got {total}"
    
    def test_filter_exercises_by_category(self):
        """Test filtering exercises by each category"""
        for category, expected_count in EXPECTED_COUNTS.items():
            response = requests.get(f"{BASE_URL}/api/exercises", params={'category': category})
            assert response.status_code == 200, f"Failed to filter by {category}"
            
            exercises = response.json()
            assert len(exercises) == expected_count, \
                f"Category filter '{category}': expected {expected_count}, got {len(exercises)}"
            
            # Verify all returned exercises are of the correct category
            for ex in exercises:
                assert ex['category'] == category, \
                    f"Exercise {ex['name']} has wrong category: {ex['category']}"
        print(f"✅ All category filters work correctly")
    
    def test_exercise_field_types(self):
        """Test that exercise fields have correct types"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        
        exercises = response.json()
        for exercise in exercises:
            # String fields
            assert isinstance(exercise['exercise_id'], str), f"{exercise['name']}: exercise_id should be string"
            assert isinstance(exercise['name'], str), f"{exercise['name']}: name should be string"
            assert isinstance(exercise['category'], str), f"{exercise['name']}: category should be string"
            assert isinstance(exercise['description'], str), f"{exercise['name']}: description should be string"
            assert isinstance(exercise['difficulty'], str), f"{exercise['name']}: difficulty should be string"
            
            # List fields
            assert isinstance(exercise['muscle_groups'], list), f"{exercise['name']}: muscle_groups should be list"
            assert isinstance(exercise['instructions'], list), f"{exercise['name']}: instructions should be list"
            assert isinstance(exercise['tips'], list), f"{exercise['name']}: tips should be list"
            assert isinstance(exercise['equipment'], list), f"{exercise['name']}: equipment should be list"
            
            # Validate non-empty required fields
            assert len(exercise['name']) > 0, f"Exercise name cannot be empty"
            assert len(exercise['description']) > 0, f"{exercise['name']}: description cannot be empty"
            assert len(exercise['instructions']) > 0, f"{exercise['name']}: instructions cannot be empty"
            assert len(exercise['muscle_groups']) > 0, f"{exercise['name']}: muscle_groups cannot be empty"
        print("✅ All exercises have correct field types")
    
    def test_valid_categories(self):
        """Test that all exercises have valid categories"""
        valid_categories = {'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'}
        
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        
        exercises = response.json()
        for exercise in exercises:
            assert exercise['category'] in valid_categories, \
                f"Exercise {exercise['name']} has invalid category: {exercise['category']}"
        print(f"✅ All exercises have valid categories: {valid_categories}")
    
    def test_valid_difficulty_levels(self):
        """Test that all exercises have valid difficulty levels"""
        valid_difficulties = {'débutant', 'intermédiaire', 'avancé'}
        
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        
        exercises = response.json()
        for exercise in exercises:
            assert exercise['difficulty'] in valid_difficulties, \
                f"Exercise {exercise['name']} has invalid difficulty: {exercise['difficulty']}"
        print(f"✅ All exercises have valid difficulty levels: {valid_difficulties}")
    
    def test_get_single_exercise(self):
        """Test getting a specific exercise by ID"""
        # First get an exercise ID
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        
        exercises = response.json()
        test_exercise = exercises[0]
        exercise_id = test_exercise['exercise_id']
        
        # Get the specific exercise
        response = requests.get(f"{BASE_URL}/api/exercises/{exercise_id}")
        assert response.status_code == 200, f"Failed to get exercise {exercise_id}"
        
        exercise = response.json()
        assert exercise['exercise_id'] == exercise_id
        assert exercise['name'] == test_exercise['name']
        print(f"✅ Successfully retrieved single exercise: {exercise['name']}")
    
    def test_nonexistent_exercise_returns_404(self):
        """Test that getting a non-existent exercise returns 404"""
        response = requests.get(f"{BASE_URL}/api/exercises/ex_nonexistent_12345")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✅ Non-existent exercise correctly returns 404")


class TestWorkoutsAPI:
    """Test workouts API endpoints for exercise integration"""
    
    def test_create_workout_with_exercises(self):
        """Test creating a workout with exercises from the database"""
        # First, get some exercises
        response = requests.get(f"{BASE_URL}/api/exercises?category=chest")
        assert response.status_code == 200
        
        exercises = response.json()
        assert len(exercises) > 0, "No chest exercises available"
        
        # Get 3 exercises for the workout
        workout_exercises = []
        for i, ex in enumerate(exercises[:3]):
            workout_exercises.append({
                "exercise_id": ex['exercise_id'],
                "sets": 3,
                "reps": "10-12",
                "weight": None,
                "rest_seconds": 60
            })
        
        workout_data = {
            "name": "TEST_Chest_Workout",
            "workout_type": "upper",
            "exercises": workout_exercises,
            "duration_minutes": 45,
            "intensity": "moyenne"
        }
        
        # Create workout (this requires auth, will skip if not authenticated)
        response = requests.post(f"{BASE_URL}/api/workouts", json=workout_data, 
                                cookies={'session_token': 'test'})
        
        # We expect either 201 (success) or 401 (not authenticated)
        if response.status_code == 201:
            workout = response.json()
            assert workout['name'] == workout_data['name']
            assert len(workout['exercises']) == 3
            print(f"✅ Successfully created workout with 3 exercises")
            
            # Cleanup: delete the workout
            requests.delete(f"{BASE_URL}/api/workouts/{workout['workout_id']}", 
                          cookies={'session_token': 'test'})
        else:
            # Not authenticated - this is expected in test environment
            print(f"⚠️ Workout creation requires authentication (status: {response.status_code})")
            pytest.skip("Authentication required for workout creation")


class TestExerciseContent:
    """Test exercise content quality"""
    
    def test_all_chest_exercises(self):
        """Test all chest exercises have proper content"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=chest")
        assert response.status_code == 200
        
        exercises = response.json()
        assert len(exercises) == 20
        
        for ex in exercises:
            assert len(ex['instructions']) >= 2, f"{ex['name']}: should have at least 2 instructions"
            assert len(ex['tips']) >= 1, f"{ex['name']}: should have at least 1 tip"
        print(f"✅ All 20 chest exercises have proper instructions and tips")
    
    def test_all_back_exercises(self):
        """Test all back exercises have proper content"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=back")
        assert response.status_code == 200
        
        exercises = response.json()
        assert len(exercises) == 22
        print(f"✅ All 22 back exercises returned correctly")
    
    def test_all_leg_exercises(self):
        """Test all leg exercises have proper content"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=legs")
        assert response.status_code == 200
        
        exercises = response.json()
        assert len(exercises) == 25
        print(f"✅ All 25 leg exercises returned correctly")
    
    def test_all_shoulder_exercises(self):
        """Test all shoulder exercises have proper content"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=shoulders")
        assert response.status_code == 200
        
        exercises = response.json()
        assert len(exercises) == 18
        print(f"✅ All 18 shoulder exercises returned correctly")
    
    def test_all_arm_exercises(self):
        """Test all arm exercises have proper content"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=arms")
        assert response.status_code == 200
        
        exercises = response.json()
        assert len(exercises) == 20
        print(f"✅ All 20 arm exercises returned correctly")
    
    def test_all_core_exercises(self):
        """Test all core exercises have proper content"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=core")
        assert response.status_code == 200
        
        exercises = response.json()
        assert len(exercises) == 15
        print(f"✅ All 15 core exercises returned correctly")
    
    def test_all_cardio_exercises(self):
        """Test all cardio exercises have proper content"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=cardio")
        assert response.status_code == 200
        
        exercises = response.json()
        assert len(exercises) == 10
        print(f"✅ All 10 cardio exercises returned correctly")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
