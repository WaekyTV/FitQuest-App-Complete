from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    weight: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    goal: Optional[str] = "maintenance"
    level: Optional[str] = "débutant"
    target_weight: Optional[float] = None
    daily_calories: Optional[int] = 2000
    target_protein: Optional[int] = 120
    sessions_per_week: Optional[int] = 4
    notifications_enabled: bool = True
    dark_mode: bool = True
    language: str = "fr"
    birthdate: Optional[str] = None
    chrono_pre_count: int = 5
    chrono_sound_enabled: bool = True
    chrono_beep_last_ten: bool = True
    chrono_beep_last_three: bool = True
    chrono_volume: float = 0.7

class UserUpdate(BaseModel):
    name: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    birthdate: Optional[str] = None
    goal: Optional[str] = None
    level: Optional[str] = None
    target_weight: Optional[float] = None
    daily_calories: Optional[int] = None
    target_protein: Optional[int] = None
    sessions_per_week: Optional[int] = None
    notifications_enabled: Optional[bool] = None
    dark_mode: Optional[bool] = None
    language: Optional[str] = None
    gender: Optional[str] = None
    activity_level: Optional[str] = None
    main_goal: Optional[str] = None
    secondary_goals: Optional[List[str]] = None
    calorie_experience: Optional[str] = None
    knows_intermittent_fasting: Optional[bool] = None
    wants_intermittent_fasting: Optional[bool] = None
    target_weeks: Optional[int] = None
    weekly_weight_loss: Optional[float] = None
    meals_per_day: Optional[int] = None
    meal_times: Optional[dict] = None
    eating_location: Optional[str] = None
    diet_preference: Optional[str] = None
    dietary_restrictions: Optional[List[str]] = None
    habits_to_change: Optional[List[str]] = None
    onboarding_completed: Optional[bool] = None
    onboarding_date: Optional[str] = None
    steps_target: Optional[int] = None
    hydration_target: Optional[int] = None
    chrono_pre_count: Optional[int] = None
    chrono_sound_enabled: Optional[bool] = None
    chrono_beep_last_ten: Optional[bool] = None
    chrono_beep_last_three: Optional[bool] = None
    chrono_volume: Optional[float] = None

class Session(BaseModel):
    session_token: str
    user_id: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

def calculate_nutrition_targets(weight: float, height: float, age: int, gender: str, goal: str, activity_level: str) -> dict:
    if gender == 'female':
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }
    
    multiplier = activity_multipliers.get(activity_level, 1.55)
    tdee = bmr * multiplier
    
    goal_adjustments = {
        'weight_loss': -500,
        'maintenance': 0,
        'muscle_gain': 300,
        'endurance': 200
    }
    
    calorie_adjustment = goal_adjustments.get(goal, 0)
    daily_calories = int(tdee + calorie_adjustment)
    
    protein_multipliers = {
        'weight_loss': 2.2,
        'maintenance': 1.6,
        'muscle_gain': 2.0,
        'endurance': 1.4
    }
    
    protein_mult = protein_multipliers.get(goal, 1.6)
    target_protein = int(weight * protein_mult)
    
    return {
        'daily_calories': max(1200, min(daily_calories, 5000)),
        'target_protein': max(50, min(target_protein, 300))
    }
