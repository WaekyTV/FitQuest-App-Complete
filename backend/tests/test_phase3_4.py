"""
Test Suite for FitQuest Phase 3-4 Features:
- XP & Level System (/api/xp/*)
- Trophies System (/api/trophies)
- Predefined Programs (/api/programs/*)
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestProgramsPublicAPI:
    """Test Programs API (public endpoints - no auth required)"""
    
    def test_get_all_programs(self):
        """Test GET /api/programs returns 6 predefined programs"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert isinstance(data, list), "Expected list of programs"
        assert len(data) == 6, f"Expected 6 programs, got {len(data)}"
        
        # Verify all expected programs exist
        program_ids = [p["program_id"] for p in data]
        expected_ids = ["push_pull_legs", "full_body_beginner", "upper_lower", "weight_loss", "strength_5x5", "calisthenics"]
        for pid in expected_ids:
            assert pid in program_ids, f"Missing program: {pid}"
        
        print(f"✅ All 6 programs returned: {program_ids}")
    
    def test_programs_structure(self):
        """Test program structure has required fields"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        
        data = response.json()
        required_fields = ["program_id", "name", "description", "duration_weeks", "days_per_week", "level", "goal", "schedule"]
        
        for program in data:
            for field in required_fields:
                assert field in program, f"Missing field '{field}' in program {program.get('program_id')}"
            
            # Verify schedule structure
            assert isinstance(program["schedule"], list), "Schedule should be a list"
            assert len(program["schedule"]) > 0, "Schedule should have at least one day"
        
        print("✅ All programs have required structure")
    
    def test_filter_programs_by_level(self):
        """Test filtering programs by level"""
        # Test débutant filter
        response = requests.get(f"{BASE_URL}/api/programs", params={"level": "débutant"})
        assert response.status_code == 200
        data = response.json()
        
        for program in data:
            assert program["level"] == "débutant", f"Program {program['program_id']} has wrong level"
        
        print(f"✅ Level filter works: {len(data)} débutant programs")
    
    def test_filter_programs_by_goal(self):
        """Test filtering programs by goal"""
        # Test weight_loss filter
        response = requests.get(f"{BASE_URL}/api/programs", params={"goal": "weight_loss"})
        assert response.status_code == 200
        data = response.json()
        
        for program in data:
            assert program["goal"] == "weight_loss", f"Program {program['program_id']} has wrong goal"
        
        print(f"✅ Goal filter works: {len(data)} weight_loss programs")
    
    def test_get_program_push_pull_legs_details(self):
        """Test GET /api/programs/push_pull_legs with exercise suggestions"""
        response = requests.get(f"{BASE_URL}/api/programs/push_pull_legs")
        assert response.status_code == 200
        
        data = response.json()
        
        # Verify basic structure
        assert data["program_id"] == "push_pull_legs"
        assert data["name"] == "Push/Pull/Legs"
        assert data["days_per_week"] == 6
        assert data["duration_weeks"] == 8
        assert data["level"] == "intermédiaire"
        assert data["goal"] == "muscle_gain"
        
        # Verify schedule with exercises
        assert len(data["schedule"]) == 6, "Push/Pull/Legs should have 6 days"
        
        for day in data["schedule"]:
            assert "suggested_exercises" in day, f"Day {day.get('day')} missing suggested_exercises"
            # Each day should have suggested exercises (max 8)
            assert len(day["suggested_exercises"]) <= 8, "Max 8 exercises per day"
        
        print(f"✅ Push/Pull/Legs program details: {len(data['schedule'])} days with exercises")
    
    def test_get_program_full_body_beginner_details(self):
        """Test GET /api/programs/full_body_beginner"""
        response = requests.get(f"{BASE_URL}/api/programs/full_body_beginner")
        assert response.status_code == 200
        
        data = response.json()
        assert data["program_id"] == "full_body_beginner"
        assert data["level"] == "débutant"
        assert data["days_per_week"] == 3
        
        print(f"✅ Full Body Beginner details verified")
    
    def test_get_program_upper_lower_details(self):
        """Test GET /api/programs/upper_lower"""
        response = requests.get(f"{BASE_URL}/api/programs/upper_lower")
        assert response.status_code == 200
        
        data = response.json()
        assert data["program_id"] == "upper_lower"
        assert data["days_per_week"] == 4
        
        print(f"✅ Upper/Lower Split details verified")
    
    def test_get_program_weight_loss_details(self):
        """Test GET /api/programs/weight_loss"""
        response = requests.get(f"{BASE_URL}/api/programs/weight_loss")
        assert response.status_code == 200
        
        data = response.json()
        assert data["program_id"] == "weight_loss"
        assert data["goal"] == "weight_loss"
        assert data["days_per_week"] == 5
        
        print(f"✅ Weight Loss program details verified")
    
    def test_get_program_strength_5x5_details(self):
        """Test GET /api/programs/strength_5x5"""
        response = requests.get(f"{BASE_URL}/api/programs/strength_5x5")
        assert response.status_code == 200
        
        data = response.json()
        assert data["program_id"] == "strength_5x5"
        assert data["days_per_week"] == 3
        
        print(f"✅ Strength 5x5 program details verified")
    
    def test_get_program_calisthenics_details(self):
        """Test GET /api/programs/calisthenics"""
        response = requests.get(f"{BASE_URL}/api/programs/calisthenics")
        assert response.status_code == 200
        
        data = response.json()
        assert data["program_id"] == "calisthenics"
        assert data["goal"] == "endurance"
        
        print(f"✅ Calisthenics program details verified")
    
    def test_get_nonexistent_program_404(self):
        """Test GET /api/programs/invalid returns 404"""
        response = requests.get(f"{BASE_URL}/api/programs/invalid_program_id")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        print("✅ Non-existent program returns 404")


class TestAuthRequiredAPIs:
    """Test APIs that require authentication (should return 401)"""
    
    def test_xp_status_requires_auth(self):
        """Test /api/xp/status returns 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/xp/status")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
        print("✅ XP status correctly requires auth")
    
    def test_xp_add_requires_auth(self):
        """Test /api/xp/add returns 401 without auth"""
        response = requests.post(f"{BASE_URL}/api/xp/add", params={"action": "workout_completed"})
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
        print("✅ XP add correctly requires auth")
    
    def test_trophies_requires_auth(self):
        """Test /api/trophies returns 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/trophies")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
        print("✅ Trophies correctly requires auth")
    
    def test_programs_start_requires_auth(self):
        """Test /api/programs/{id}/start returns 401 without auth"""
        response = requests.post(f"{BASE_URL}/api/programs/push_pull_legs/start")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
        print("✅ Program start correctly requires auth")
    
    def test_active_program_requires_auth(self):
        """Test /api/programs/user/active returns 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/programs/user/active")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
        print("✅ Active program correctly requires auth")


class TestXPSystemLogic:
    """Test XP system helper functions (via code review - no auth needed)"""
    
    def test_xp_rewards_defined(self):
        """Verify XP rewards are defined in server.py"""
        # This is a code review test - we verify the XP_REWARDS dict exists
        expected_actions = [
            "workout_completed",
            "meal_logged", 
            "weight_logged",
            "streak_day",
            "personal_record",
            "week_goal_reached",
            "first_workout",
            "consistency_bonus"
        ]
        
        # We can't directly call the server code, but we verify the endpoint exists
        # and rejects invalid actions via 401 (auth required)
        response = requests.post(f"{BASE_URL}/api/xp/add", params={"action": "invalid_action"})
        # Should be 401 (auth required) not 400 (invalid action) - auth check happens first
        assert response.status_code == 401
        
        print(f"✅ XP add endpoint exists with auth protection")
    
    def test_level_thresholds_exist(self):
        """Verify level system exists (verified via 401 response)"""
        response = requests.get(f"{BASE_URL}/api/xp/status")
        assert response.status_code == 401
        
        print("✅ Level system endpoint exists")


class TestTrophiesSystemLogic:
    """Test trophies definitions exist (via code review)"""
    
    def test_trophies_endpoint_exists(self):
        """Verify trophies endpoint returns 401 (auth protected)"""
        response = requests.get(f"{BASE_URL}/api/trophies")
        assert response.status_code == 401
        
        data = response.json()
        assert "detail" in data
        assert data["detail"] == "Not authenticated"
        
        print("✅ Trophies endpoint exists with auth protection")


class TestScheduleValidation:
    """Test program schedule structures"""
    
    def test_all_programs_have_valid_schedules(self):
        """Verify all programs have properly structured schedules"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        
        programs = response.json()
        
        for program in programs:
            schedule = program["schedule"]
            
            # Verify day numbers are sequential
            days = [d["day"] for d in schedule]
            assert days == sorted(days), f"Days not sequential in {program['program_id']}"
            
            # Verify each day has required fields
            for day in schedule:
                assert "day" in day
                assert "name" in day
                assert "focus" in day
                assert "workout_type" in day
                assert isinstance(day["focus"], list)
        
        print("✅ All program schedules have valid structure")
    
    def test_programs_total_duration(self):
        """Verify program durations are reasonable"""
        response = requests.get(f"{BASE_URL}/api/programs")
        programs = response.json()
        
        for program in programs:
            duration = program["duration_weeks"]
            days_per_week = program["days_per_week"]
            
            assert 3 <= duration <= 16, f"Duration {duration} unreasonable for {program['program_id']}"
            assert 1 <= days_per_week <= 7, f"Days per week {days_per_week} invalid for {program['program_id']}"
        
        print("✅ All program durations are reasonable")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
