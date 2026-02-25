"""
Test Phase 1 Features:
- 180 exercises database with new equipment types
- Export user data endpoint
- Delete account endpoint
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestExercisesDatabase:
    """Test exercises database - 180 exercises with new machines"""
    
    def test_exercises_count_is_180(self):
        """Verify exactly 180 exercises are available"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        assert len(exercises) == 180, f"Expected 180 exercises, got {len(exercises)}"
        print(f"✅ Total exercises: {len(exercises)}")
    
    def test_all_categories_present(self):
        """Verify all 7 categories are present"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        categories = set(ex['category'] for ex in exercises)
        expected_categories = {'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'}
        
        assert categories == expected_categories, f"Missing categories: {expected_categories - categories}"
        print(f"✅ All categories present: {sorted(categories)}")
    
    def test_category_distribution(self):
        """Verify category distribution is balanced"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        distribution = {}
        for ex in exercises:
            cat = ex['category']
            distribution[cat] = distribution.get(cat, 0) + 1
        
        # All categories should have at least 10 exercises
        for cat, count in distribution.items():
            assert count >= 10, f"Category {cat} has only {count} exercises"
        
        print(f"✅ Category distribution: {distribution}")
    
    def test_new_equipment_hammer_strength(self):
        """Verify Hammer Strength machines are present"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        hammer_exercises = [ex for ex in exercises if any('hammer' in eq.lower() for eq in ex.get('equipment', []))]
        assert len(hammer_exercises) > 0, "No Hammer Strength exercises found"
        print(f"✅ Hammer Strength exercises: {len(hammer_exercises)}")
        for ex in hammer_exercises[:3]:
            print(f"   - {ex['name']}")
    
    def test_new_equipment_kettlebell(self):
        """Verify kettlebell exercises are present"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        kettlebell_exercises = [ex for ex in exercises if any('kettlebell' in eq.lower() for eq in ex.get('equipment', []))]
        assert len(kettlebell_exercises) > 0, "No kettlebell exercises found"
        print(f"✅ Kettlebell exercises: {len(kettlebell_exercises)}")
        for ex in kettlebell_exercises[:3]:
            print(f"   - {ex['name']}")
    
    def test_new_equipment_landmine(self):
        """Verify landmine exercises are present"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        landmine_exercises = [ex for ex in exercises if any('landmine' in eq.lower() for eq in ex.get('equipment', []))]
        assert len(landmine_exercises) > 0, "No landmine exercises found"
        print(f"✅ Landmine exercises: {len(landmine_exercises)}")
        for ex in landmine_exercises[:3]:
            print(f"   - {ex['name']}")
    
    def test_new_equipment_battle_ropes(self):
        """Verify battle ropes exercises are present"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        battle_rope_exercises = [ex for ex in exercises if any('battle' in eq.lower() or 'rope' in eq.lower() for eq in ex.get('equipment', []))]
        assert len(battle_rope_exercises) > 0, "No battle rope exercises found"
        print(f"✅ Battle ropes exercises: {len(battle_rope_exercises)}")
        for ex in battle_rope_exercises[:3]:
            print(f"   - {ex['name']}")
    
    def test_new_equipment_ski_erg(self):
        """Verify ski erg exercises are present"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        ski_erg_exercises = [ex for ex in exercises if any('ski' in eq.lower() for eq in ex.get('equipment', []))]
        assert len(ski_erg_exercises) > 0, "No ski erg exercises found"
        print(f"✅ Ski erg exercises: {len(ski_erg_exercises)}")
        for ex in ski_erg_exercises[:3]:
            print(f"   - {ex['name']}")
    
    def test_new_equipment_resistance_bands(self):
        """Verify resistance band exercises are present"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        band_exercises = [ex for ex in exercises if any('élastique' in eq.lower() or 'band' in eq.lower() for eq in ex.get('equipment', []))]
        assert len(band_exercises) > 0, "No resistance band exercises found"
        print(f"✅ Resistance band exercises: {len(band_exercises)}")
        for ex in band_exercises[:3]:
            print(f"   - {ex['name']}")
    
    def test_cardio_category_has_interval_capable_exercises(self):
        """Verify cardio exercises exist for interval training"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=cardio")
        assert response.status_code == 200
        exercises = response.json()
        
        assert len(exercises) >= 10, f"Expected at least 10 cardio exercises, got {len(exercises)}"
        print(f"✅ Cardio exercises for intervals: {len(exercises)}")
        for ex in exercises[:5]:
            print(f"   - {ex['name']}: {ex.get('equipment', [])}")
    
    def test_exercise_fields_complete(self):
        """Verify all exercises have required fields"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        exercises = response.json()
        
        required_fields = ['exercise_id', 'name', 'category', 'muscle_groups', 'description', 'instructions', 'difficulty', 'equipment']
        
        missing_fields_count = 0
        for ex in exercises:
            for field in required_fields:
                if field not in ex:
                    missing_fields_count += 1
                    print(f"Missing {field} in exercise: {ex.get('name', 'unknown')}")
        
        assert missing_fields_count == 0, f"{missing_fields_count} exercises missing required fields"
        print(f"✅ All exercises have required fields")


class TestDangerZoneEndpoints:
    """Test Danger Zone endpoints - export and delete"""
    
    def test_export_data_requires_auth(self):
        """Verify export endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/users/me/export")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✅ Export endpoint requires authentication: {response.status_code}")
    
    def test_delete_account_requires_auth(self):
        """Verify delete account endpoint requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/users/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✅ Delete endpoint requires authentication: {response.status_code}")


class TestCategoryFiltering:
    """Test category filtering for exercises"""
    
    @pytest.mark.parametrize("category", ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'])
    def test_filter_by_category(self, category):
        """Test filtering exercises by each category"""
        response = requests.get(f"{BASE_URL}/api/exercises?category={category}")
        assert response.status_code == 200
        exercises = response.json()
        
        # All returned exercises should be in the requested category
        for ex in exercises:
            assert ex['category'] == category, f"Exercise {ex['name']} is {ex['category']}, expected {category}"
        
        assert len(exercises) > 0, f"No exercises found for category {category}"
        print(f"✅ Category {category}: {len(exercises)} exercises")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
