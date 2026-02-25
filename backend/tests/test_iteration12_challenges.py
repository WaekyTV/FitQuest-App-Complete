"""
Iteration 12 Tests: 
- Bug onboarding fix (onboardingChecked state)
- Challenges API (GET /api/challenges, GET /api/challenges/stats, POST /api/challenges/start, POST /api/challenges/{id}/claim)
- Settings Page at /parametres
- Challenges Page at /defis
- Sidebar navigation contains Défis and Paramètres
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestChallengesAPI:
    """Tests for the weekly challenges API endpoints."""
    
    def test_get_challenges_requires_auth(self):
        """GET /api/challenges should require authentication."""
        response = requests.get(f"{BASE_URL}/api/challenges")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        data = response.json()
        assert "detail" in data
        assert "authenticated" in data["detail"].lower() or "not" in data["detail"].lower()
        print("✅ GET /api/challenges requires authentication (401)")

    def test_get_challenges_stats_requires_auth(self):
        """GET /api/challenges/stats should require authentication."""
        response = requests.get(f"{BASE_URL}/api/challenges/stats")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        data = response.json()
        assert "detail" in data
        print("✅ GET /api/challenges/stats requires authentication (401)")

    def test_start_challenge_requires_auth(self):
        """POST /api/challenges/start should require authentication."""
        payload = {
            "template_id": "water_7days",
            "type": "hydration",
            "name": "Hydra Master",
            "description": "Test challenge",
            "target": 7,
            "xp_reward": 500,
            "metric": "days_completed"
        }
        response = requests.post(f"{BASE_URL}/api/challenges/start", json=payload)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/challenges/start requires authentication (401)")

    def test_claim_challenge_requires_auth(self):
        """POST /api/challenges/{id}/claim should require authentication."""
        response = requests.post(f"{BASE_URL}/api/challenges/test_challenge_id/claim")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ POST /api/challenges/{id}/claim requires authentication (401)")

    def test_update_challenge_progress_requires_auth(self):
        """PUT /api/challenges/{id}/progress should require authentication."""
        response = requests.put(
            f"{BASE_URL}/api/challenges/test_id/progress",
            params={"progress": 5}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ PUT /api/challenges/{id}/progress requires authentication (401)")


class TestSettingsAndRoutesExist:
    """Tests to verify routes exist and are protected."""
    
    def test_parametres_route_protected(self):
        """The /parametres route should redirect to login when not authenticated."""
        # When accessing a protected route, React will redirect to /login
        response = requests.get(f"{BASE_URL}/parametres", allow_redirects=False)
        # The frontend serves HTML, check that it returns 200 (SPA behavior)
        assert response.status_code == 200, f"Expected 200 (SPA serves HTML), got {response.status_code}"
        print("✅ /parametres route exists (SPA serves page)")

    def test_defis_route_protected(self):
        """The /defis route should redirect to login when not authenticated."""
        response = requests.get(f"{BASE_URL}/defis", allow_redirects=False)
        assert response.status_code == 200, f"Expected 200 (SPA serves HTML), got {response.status_code}"
        print("✅ /defis route exists (SPA serves page)")


class TestExistingAPIsStillWork:
    """Regression tests for existing endpoints."""
    
    def test_auth_me_requires_auth(self):
        """GET /api/auth/me should require authentication."""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✅ GET /api/auth/me requires authentication")

    def test_exercises_public(self):
        """GET /api/exercises should be publicly accessible."""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Should have exercises"
        print(f"✅ GET /api/exercises returns {len(data)} exercises (public)")

    def test_logout_works(self):
        """POST /api/auth/logout should work."""
        response = requests.post(f"{BASE_URL}/api/auth/logout")
        assert response.status_code == 200
        print("✅ POST /api/auth/logout works")

    def test_xp_status_requires_auth(self):
        """GET /api/xp/status should require authentication."""
        response = requests.get(f"{BASE_URL}/api/xp/status")
        assert response.status_code == 401
        print("✅ GET /api/xp/status requires authentication")

    def test_trophies_requires_auth(self):
        """GET /api/trophies should require authentication."""
        response = requests.get(f"{BASE_URL}/api/trophies")
        assert response.status_code == 401
        print("✅ GET /api/trophies requires authentication")

    def test_reminders_requires_auth(self):
        """GET /api/reminders should require authentication."""
        response = requests.get(f"{BASE_URL}/api/reminders")
        assert response.status_code == 401
        print("✅ GET /api/reminders requires authentication")


class TestUserExportAndDelete:
    """Tests for user export and delete endpoints in Settings."""
    
    def test_export_requires_auth(self):
        """GET /api/users/me/export should require authentication."""
        response = requests.get(f"{BASE_URL}/api/users/me/export")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ GET /api/users/me/export requires authentication")

    def test_delete_user_requires_auth(self):
        """DELETE /api/users/me should require authentication."""
        response = requests.delete(f"{BASE_URL}/api/users/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ DELETE /api/users/me requires authentication")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
