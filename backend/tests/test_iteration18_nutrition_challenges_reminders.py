"""
Test Iteration 18: Nutrition Score, Challenges, and Reminders APIs
Testing:
1. GET /api/nutrition/score - Returns daily_score, weekly_avg_score, badges
2. POST /api/nutrition/claim-badge/{badge_id} - Claim nutrition badge
3. GET /api/challenges - Get active and completed challenges
4. GET /api/challenges/stats - Get challenges statistics
5. POST /api/challenges/start - Start a new challenge
6. GET /api/reminders - Get all reminders
7. POST /api/reminders - Create a new reminder
8. PUT /api/reminders/{id} - Update reminder
9. DELETE /api/reminders/{id} - Delete reminder
10. PATCH /api/reminders/{id}/toggle - Toggle reminder enabled state
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestNutritionScoreEndpoints:
    """Test nutrition score endpoints require authentication"""
    
    def test_nutrition_score_requires_auth(self):
        """GET /api/nutrition/score should require authentication"""
        response = requests.get(f"{BASE_URL}/api/nutrition/score")
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ GET /api/nutrition/score requires auth (401) - {data['detail']}")
    
    def test_claim_nutrition_badge_requires_auth(self):
        """POST /api/nutrition/claim-badge/{badge_id} should require authentication"""
        # Test with each badge type
        badge_ids = ["first_balanced", "protein_week", "balanced_10", "calorie_master", "nutrition_champion"]
        
        for badge_id in badge_ids:
            response = requests.post(f"{BASE_URL}/api/nutrition/claim-badge/{badge_id}")
            assert response.status_code == 401
            data = response.json()
            assert "detail" in data
            print(f"✅ POST /api/nutrition/claim-badge/{badge_id} requires auth (401)")


class TestChallengesEndpoints:
    """Test challenges endpoints require authentication"""
    
    def test_get_challenges_requires_auth(self):
        """GET /api/challenges should require authentication"""
        response = requests.get(f"{BASE_URL}/api/challenges")
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ GET /api/challenges requires auth (401) - {data['detail']}")
    
    def test_get_challenges_stats_requires_auth(self):
        """GET /api/challenges/stats should require authentication"""
        response = requests.get(f"{BASE_URL}/api/challenges/stats")
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ GET /api/challenges/stats requires auth (401) - {data['detail']}")
    
    def test_start_challenge_requires_auth(self):
        """POST /api/challenges/start should require authentication"""
        challenge_data = {
            "template_id": "water_7days",
            "type": "hydration",
            "name": "Hydra Master",
            "description": "Bois 8 verres d'eau pendant 7 jours",
            "target": 7,
            "xp_reward": 500,
            "metric": "days_completed"
        }
        response = requests.post(
            f"{BASE_URL}/api/challenges/start",
            json=challenge_data
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ POST /api/challenges/start requires auth (401) - {data['detail']}")
    
    def test_claim_challenge_requires_auth(self):
        """POST /api/challenges/{id}/claim should require authentication"""
        response = requests.post(f"{BASE_URL}/api/challenges/test_challenge_id/claim")
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ POST /api/challenges/{{id}}/claim requires auth (401) - {data['detail']}")


class TestRemindersEndpoints:
    """Test reminders endpoints require authentication"""
    
    def test_get_reminders_requires_auth(self):
        """GET /api/reminders should require authentication"""
        response = requests.get(f"{BASE_URL}/api/reminders")
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ GET /api/reminders requires auth (401) - {data['detail']}")
    
    def test_create_reminder_requires_auth(self):
        """POST /api/reminders should require authentication"""
        reminder_data = {
            "type": "workout",
            "title": "Test Reminder",
            "time": "09:00",
            "days": ["monday", "wednesday", "friday"],
            "enabled": True
        }
        response = requests.post(
            f"{BASE_URL}/api/reminders",
            json=reminder_data
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ POST /api/reminders requires auth (401) - {data['detail']}")
    
    def test_update_reminder_requires_auth(self):
        """PUT /api/reminders/{id} should require authentication"""
        response = requests.put(
            f"{BASE_URL}/api/reminders/test_reminder_id",
            json={"title": "Updated"}
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ PUT /api/reminders/{{id}} requires auth (401) - {data['detail']}")
    
    def test_delete_reminder_requires_auth(self):
        """DELETE /api/reminders/{id} should require authentication"""
        response = requests.delete(f"{BASE_URL}/api/reminders/test_reminder_id")
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ DELETE /api/reminders/{{id}} requires auth (401) - {data['detail']}")
    
    def test_toggle_reminder_requires_auth(self):
        """PATCH /api/reminders/{id}/toggle should require authentication"""
        response = requests.patch(f"{BASE_URL}/api/reminders/test_reminder_id/toggle")
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ PATCH /api/reminders/{{id}}/toggle requires auth (401) - {data['detail']}")


class TestPublicEndpointsStillWork:
    """Verify public endpoints still work"""
    
    def test_exercises_list_is_public(self):
        """GET /api/exercises should be public"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ GET /api/exercises is public (200) - {len(data)} exercises")
    
    def test_exercises_search_is_public(self):
        """GET /api/exercises/search/query should be public"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=squat")
        assert response.status_code == 200
        data = response.json()
        assert "exercises" in data
        print(f"✅ GET /api/exercises/search/query is public (200) - {data.get('count', 0)} results")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
