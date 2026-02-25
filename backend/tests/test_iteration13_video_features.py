"""
Iteration 13 Tests: YouTube Video URLs, History Management, Challenges, Reminders
Focus: Verify fixed YouTube URLs, history deletion, challenges API, reminders API
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL')
if BASE_URL:
    BASE_URL = BASE_URL.rstrip('/')

class TestExercisesAndVideoURLs:
    """Test exercises API and video URL validity"""
    
    def test_exercises_endpoint_returns_data(self):
        """GET /api/exercises returns exercises with video URLs"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        exercises = response.json()
        assert isinstance(exercises, list), "Response should be a list"
        assert len(exercises) > 0, "Should have at least one exercise"
        print(f"✅ GET /api/exercises returns {len(exercises)} exercises")
    
    def test_exercises_have_video_urls(self):
        """Exercises should have valid YouTube video URLs"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        
        exercises = response.json()
        exercises_with_video = [e for e in exercises if e.get('video_url')]
        
        assert len(exercises_with_video) > 0, "At least some exercises should have video URLs"
        print(f"✅ {len(exercises_with_video)} exercises have video URLs")
        
        # Check that video URLs are YouTube URLs
        for ex in exercises_with_video[:5]:  # Check first 5
            video_url = ex.get('video_url', '')
            assert 'youtube.com/watch' in video_url, f"Invalid YouTube URL: {video_url}"
        print("✅ Video URLs are valid YouTube format")
    
    def test_exercises_filter_by_category(self):
        """GET /api/exercises?category=chest filters correctly"""
        response = requests.get(f"{BASE_URL}/api/exercises?category=chest")
        assert response.status_code == 200
        
        exercises = response.json()
        if len(exercises) > 0:
            for ex in exercises:
                assert ex.get('category') == 'chest', f"Expected chest category, got {ex.get('category')}"
        print(f"✅ Category filter works - found {len(exercises)} chest exercises")
    
    def test_exercises_search_endpoint(self):
        """GET /api/exercises/search/query searches correctly"""
        response = requests.get(f"{BASE_URL}/api/exercises/search/query?q=bench")
        assert response.status_code == 200
        
        data = response.json()
        assert 'exercises' in data, "Response should have exercises key"
        assert 'count' in data, "Response should have count key"
        print(f"✅ Search for 'bench' returns {data['count']} results")
    
    def test_single_exercise_endpoint(self):
        """GET /api/exercises/{exercise_id} returns single exercise"""
        # First get list to get an ID
        response = requests.get(f"{BASE_URL}/api/exercises")
        exercises = response.json()
        
        if len(exercises) > 0:
            exercise_id = exercises[0].get('exercise_id')
            detail_response = requests.get(f"{BASE_URL}/api/exercises/{exercise_id}")
            assert detail_response.status_code == 200, f"Expected 200, got {detail_response.status_code}"
            
            detail = detail_response.json()
            assert detail.get('exercise_id') == exercise_id
            print(f"✅ GET /api/exercises/{exercise_id} returns exercise detail")


class TestChallengesAPI:
    """Test challenges API endpoints"""
    
    def test_challenges_requires_auth(self):
        """GET /api/challenges requires authentication"""
        response = requests.get(f"{BASE_URL}/api/challenges")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/challenges requires authentication")
    
    def test_challenges_stats_requires_auth(self):
        """GET /api/challenges/stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/challenges/stats")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/challenges/stats requires authentication")
    
    def test_start_challenge_requires_auth(self):
        """POST /api/challenges/start requires authentication"""
        response = requests.post(f"{BASE_URL}/api/challenges/start", json={
            "template_id": "test",
            "type": "workout",
            "name": "Test Challenge",
            "description": "Test",
            "target": 3,
            "xp_reward": 100,
            "metric": "count"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/challenges/start requires authentication")
    
    def test_claim_challenge_requires_auth(self):
        """POST /api/challenges/{id}/claim requires authentication"""
        response = requests.post(f"{BASE_URL}/api/challenges/test_id/claim")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/challenges/{id}/claim requires authentication")


class TestRemindersAPI:
    """Test reminders API endpoints"""
    
    def test_reminders_requires_auth(self):
        """GET /api/reminders requires authentication"""
        response = requests.get(f"{BASE_URL}/api/reminders")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/reminders requires authentication")
    
    def test_create_reminder_requires_auth(self):
        """POST /api/reminders requires authentication"""
        response = requests.post(f"{BASE_URL}/api/reminders", json={
            "type": "workout",
            "title": "Test reminder",
            "time": "09:00",
            "days": ["monday"],
            "enabled": True
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/reminders requires authentication")
    
    def test_delete_reminder_requires_auth(self):
        """DELETE /api/reminders/{id} requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/reminders/test_id")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/reminders/{id} requires authentication")
    
    def test_toggle_reminder_requires_auth(self):
        """PATCH /api/reminders/{id}/toggle requires authentication"""
        response = requests.patch(f"{BASE_URL}/api/reminders/test_id/toggle")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ PATCH /api/reminders/{id}/toggle requires authentication")


class TestHistoryDeletionAPI:
    """Test history deletion API endpoints"""
    
    def test_delete_all_workouts_requires_auth(self):
        """DELETE /api/history/all?type=workouts requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=workouts")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=workouts requires authentication")
    
    def test_delete_all_meals_requires_auth(self):
        """DELETE /api/history/all?type=meals requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=meals")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=meals requires authentication")
    
    def test_delete_all_steps_requires_auth(self):
        """DELETE /api/history/all?type=steps requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=steps")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=steps requires authentication")
    
    def test_delete_all_hydration_requires_auth(self):
        """DELETE /api/history/all?type=hydration requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=hydration")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=hydration requires authentication")
    
    def test_delete_all_history_requires_auth(self):
        """DELETE /api/history/all?type=all requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/history/all?type=all")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/history/all?type=all requires authentication")


class TestFrontendRoutes:
    """Test that frontend routes are accessible"""
    
    def test_sport_page_route(self):
        """/sport route is accessible"""
        response = requests.get(f"{BASE_URL}/sport")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✅ /sport route is accessible")
    
    def test_defis_page_route(self):
        """/defis route is accessible (Challenges page)"""
        response = requests.get(f"{BASE_URL}/defis")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✅ /defis route is accessible")
    
    def test_rappels_page_route(self):
        """/rappels route is accessible (Reminders page)"""
        response = requests.get(f"{BASE_URL}/rappels")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✅ /rappels route is accessible")
    
    def test_parametres_page_route(self):
        """/parametres route is accessible (Settings page)"""
        response = requests.get(f"{BASE_URL}/parametres")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✅ /parametres route is accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
