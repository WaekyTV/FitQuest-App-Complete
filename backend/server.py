from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse, RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
import json
import google.generativeai as genai
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from exercises_data import get_all_exercises

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Configuration Gemini (Gratuit)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up application...")
    yield
    # Shutdown
    client.close()
    logger.info("Shutting down application...")

# Create the main app
app = FastAPI(lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add CORS Middleware
# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],  # Wildcard is risky with credentials
    allow_origin_regex="https?://.*", # Allow http and https from any domain (Safe for Dev)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# ============== MODELS ==============

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
    streak_reminder_enabled: bool = False
    streak_reminder_time: str = "20:00"
    chrono_pre_count: int = 5
    chrono_sound_enabled: bool = True
    chrono_beep_last_ten: bool = True
    chrono_beep_last_three: bool = True
    chrono_volume: float = 0.7
    nutritional_program_text: Optional[str] = None
    # Onboarding fields
    main_goal: Optional[str] = None
    secondary_goals: Optional[List[str]] = None
    calorie_experience: Optional[str] = None
    knows_intermittent_fasting: Optional[bool] = None
    wants_intermittent_fasting: Optional[bool] = None
    target_weeks: Optional[int] = None
    weekly_weight_loss: Optional[float] = None
    meals_per_day: Optional[int] = 4
    meal_times: Optional[dict] = None
    eating_location: Optional[str] = None
    diet_preference: Optional[str] = None
    dietary_restrictions: Optional[List[str]] = None
    habits_to_change: Optional[List[str]] = None
    onboarding_completed: bool = False
    onboarding_date: Optional[str] = None
    steps_target: Optional[int] = None
    hydration_target: Optional[int] = None
    caloric_deficit_kcal: Optional[int] = None
    gender: Optional[str] = None
    activity_level: Optional[str] = None
    is_cutting: bool = False

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
    # Onboarding fields
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
    # Steps target
    steps_target: Optional[int] = None
    # Hydration target
    hydration_target: Optional[int] = None
    # Streak Reminders
    streak_reminder_enabled: Optional[bool] = None
    streak_reminder_time: Optional[str] = None
    chrono_pre_count: Optional[int] = None
    chrono_sound_enabled: Optional[bool] = None
    chrono_beep_last_ten: Optional[bool] = None
    chrono_beep_last_three: Optional[bool] = None
    chrono_volume: Optional[float] = None
    caloric_deficit_kcal: Optional[int] = None
    nutritional_program_text: Optional[str] = None
    is_cutting: Optional[bool] = None


class MealPreferences(BaseModel):
    num_people: Optional[int] = 1
    allow_meat_fish: Optional[bool] = True
    prefer_powdered_protein: Optional[bool] = False


class MealGenerationRequest(BaseModel):
    meal_type: str  # petit_dejeuner | dejeuner | collation | diner
    calories_target: Optional[int] = None
    protein_target: Optional[int] = None
    dietary_restrictions: Optional[List[str]] = None
    preferences: Optional[List[str]] = None
    # FITQUEST enriched fields
    planning_context: Optional[dict] = None       # {shift_type, workout_type, date}
    protein_bonus: Optional[int] = 0             # extra grams of protein for this day
    calorie_bonus: Optional[int] = 0             # extra kcal for this day
    liked_meal_ids: Optional[List[str]] = None   # IDs of previously liked meals
    num_people: Optional[int] = 1                # number of people for this recipe
    allow_meat_fish: Optional[bool] = None       # None = use user preference
    prefer_powdered_protein: Optional[bool] = None  # None = use user preference
    force_liked_style: Optional[bool] = False    # True = generate similar to liked
    date: Optional[str] = None                   # Specific date for the meal


# ============== AUTH & USER DEPENDENCY ==============

GOOGLE_CLIENT_ID = "158036171715-agr13rgmehc083e75vm0qdb409a89u9q.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
# Use the nip.io domain for redirect to satisfy Google's requirements
GOOGLE_REDIRECT_URI = "http://100.97.192.62.nip.io:3000"

@api_router.post("/auth/google/callback")
async def google_auth_callback(request: Request):
    """Exchange auth code for token and login user"""
    body = await request.json()
    code = body.get("code")
    redirect_uri = body.get("redirect_uri", GOOGLE_REDIRECT_URI)  # Use provided URI or fallback
    
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code missing")

    logger.info(f"DEBUG: Auth Code received (len={len(code)}). Redirect URI: {redirect_uri}")

    # 1. Exchange code for access token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri
    }
    
    async with httpx.AsyncClient() as client:
        token_res = await client.post(token_url, data=data)
        if token_res.status_code != 200:
            logger.error(f"Token exchange failed: {token_res.text}")
            raise HTTPException(status_code=400, detail="Failed to retrieve token from Google")
        
        tokens = token_res.json()
        access_token = tokens["access_token"]
        
        # 2. Get user info
        user_info_res = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_info = user_info_res.json()
        
    # 3. Create or Update User in DB
    user_id = user_info.get("sub")
    email = user_info.get("email")
    
    if not user_id or not email:
        raise HTTPException(status_code=400, detail="Invalid user info from Google")
        
    existing_user = await db.users.find_one({"user_id": user_id})
    
    now = datetime.now(timezone.utc)
    
    if not existing_user:
        # Create new user
        new_user = {
            "user_id": user_id,
            "email": email,
            "name": user_info.get("name", "User"),
            "picture": user_info.get("picture"),
            "created_at": now.isoformat(),
            # Defaults
            "total_xp": 0,
            "level": "Débutant",
            "goal": "maintenance",
            "daily_calories": 2000,
            "target_protein": 120,
            "sessions_per_week": 4
        }
        await db.users.insert_one(new_user)
    else:
        # Update login time / picture
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"last_login": now.isoformat(), "picture": user_info.get("picture")}}
        )

    # 3. Create Session (Cookie) & DB Entry
    print(f"DEBUG: Login successful for {user_id}. Creating session.")
    
    # Generate session token
    session_token = f"st_{uuid.uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Insert new session without deleting others to allow multi-device use
    await db.user_sessions.insert_one(session_doc)

    response = JSONResponse(content={
        "message": "Login successful",
        "user_id": user_id,
        "session_token": session_token
    })
    response.set_cookie(
        key="session_token", 
        value=session_token, 
        max_age=60*60*24*7, # 7 days
        httponly=False, 
        samesite="lax", 
        secure=False, # Required for non-HTTPS (Tailscale)
        path="/"
    )
    return response

# Mock user for local development (Keep as fallback)
MOCK_USER = {
    "user_id": "local_dev_user",
    "email": "dev@fitquest.local",
    "name": "Local Hero",
    "picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "created_at": datetime.now(timezone.utc),
    "total_xp": 1250,
    "level": "Apprenti",
    "weight": 75.0,
    "height": 180.0,
    "goal": "muscle_gain",
    "daily_calories": 2500,
    "target_protein": 160,
    "sessions_per_week": 4
}

async def get_current_user(request: Request):
    """
    Validation de l'utilisateur via session server-side.
    """
    # Check cookie first, then Authorization header
    token = request.cookies.get("session_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    # logger.info(f"DEBUG: Checking auth for token: {token}")
    
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    # 1. Lookup Session
    session_doc = await db.user_sessions.find_one({"session_token": token})
    if not session_doc:
        # Fallback: Check if token is a user_id (Migration/Legacy support)
        # This handles the case where frontend might still send user_id temporarily
        user_direct = await db.users.find_one({"user_id": token})
        if user_direct:
            return User(**user_direct)
            
        raise HTTPException(status_code=401, detail="Invalid session")

    # 2. Check Expiry
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    # 3. Get User
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
        
    # Add defaults if missing
    if "notifications_enabled" not in user_doc: user_doc["notifications_enabled"] = True
    if "dark_mode" not in user_doc: user_doc["dark_mode"] = True
    if "language" not in user_doc: user_doc["language"] = "fr"
    if "streak_reminder_enabled" not in user_doc: user_doc["streak_reminder_enabled"] = False
    if "streak_reminder_time" not in user_doc: user_doc["streak_reminder_time"] = "20:00"
    if "chrono_pre_count" not in user_doc: user_doc["chrono_pre_count"] = 5
    if "chrono_sound_enabled" not in user_doc: user_doc["chrono_sound_enabled"] = True
    if "chrono_beep_last_ten" not in user_doc: user_doc["chrono_beep_last_ten"] = True
    if "chrono_beep_last_three" not in user_doc: user_doc["chrono_beep_last_three"] = True
    if "chrono_volume" not in user_doc: user_doc["chrono_volume"] = 0.7

    return User(**user_doc)

@api_router.get("/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    return user

@api_router.get("/auth/login/dev")
async def dev_login(response: Response, redirect: bool = False):
    """Set a dev cookie for local access"""
    response.set_cookie(key="session_token", value="dev-token-123")
    if redirect:
        return RedirectResponse(url="http://100.97.192.62.nip.io:3000/dashboard")
    return {"message": "Logged in as Dev User", "user": MOCK_USER}

# ====================================================

def calculate_nutrition_targets(weight: float, height: float, age: int, gender: str, goal: str, activity_level: str) -> dict:
    """
    Calculate daily calories and protein targets using Mifflin-St Jeor equation.
    """
    # Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor
    if gender == 'female':
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:  # male or default
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    
    # Activity multipliers
    activity_multipliers = {
        'sedentary': 1.2,       # Little or no exercise
        'light': 1.375,         # Light exercise 1-3 days/week
        'moderate': 1.55,       # Moderate exercise 3-5 days/week
        'active': 1.725,        # Hard exercise 6-7 days/week
        'very_active': 1.9      # Very hard exercise, physical job
    }
    
    multiplier = activity_multipliers.get(activity_level, 1.55)  # Default to moderate
    tdee = bmr * multiplier
    
    # Adjust calories based on goal
    goal_adjustments = {
        'weight_loss': -500,      # Deficit for weight loss
        'maintenance': 0,         # Maintain current weight
        'muscle_gain': 300,       # Surplus for muscle gain
        'endurance': 200          # Slight surplus for endurance
    }
    
    calorie_adjustment = goal_adjustments.get(goal, 0)
    daily_calories = int(tdee + calorie_adjustment)
    
    # Calculate protein targets (g per kg of body weight)
    protein_multipliers = {
        'weight_loss': 2.2,       # High protein to preserve muscle
        'maintenance': 1.6,       # Standard for maintenance
        'muscle_gain': 2.0,       # High protein for muscle building
        'endurance': 1.4          # Moderate for endurance
    }
    
    protein_mult = protein_multipliers.get(goal, 1.6)
    target_protein = int(weight * protein_mult)
    
    return {
        'daily_calories': max(1200, min(daily_calories, 5000)),  # Clamp to reasonable range
        'target_protein': max(50, min(target_protein, 300))      # Clamp to reasonable range
    }

class Session(BaseModel):
    session_token: str
    user_id: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Exercise(BaseModel):
    exercise_id: str = Field(default_factory=lambda: f"ex_{uuid.uuid4().hex[:12]}")
    name: str
    category: str  # chest, back, legs, shoulders, arms, core, cardio
    muscle_groups: List[str]
    description: str
    instructions: List[str]
    tips: List[str]
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    difficulty: str = "intermédiaire"
    equipment: List[str] = []

class WorkoutExercise(BaseModel):
    exercise_id: str
    sets: int = 3
    reps: str = "10-12"
    weight: Optional[float] = None
    rest_seconds: int = 60
    notes: Optional[str] = None

class Workout(BaseModel):
    workout_id: str = Field(default_factory=lambda: f"wk_{uuid.uuid4().hex[:12]}")
    user_id: str
    name: str
    workout_type: str  # upper, lower, full_body, cardio, core
    exercises: List[WorkoutExercise]
    scheduled_date: Optional[str] = None
    duration_minutes: Optional[int] = None
    intensity: str = "moyenne"
    completed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SequenceCreate(BaseModel):
    id: int  # Timestamp from frontend
    name: str
    blocks: List[dict]
    intervals: List[dict]
    position: Optional[int] = 0

class WorkoutCreate(BaseModel):
    name: str
    workout_type: str
    exercises: List[WorkoutExercise]
    scheduled_date: Optional[str] = None
    duration_minutes: Optional[int] = None
    intensity: str = "moyenne"

class WorkoutLog(BaseModel):
    log_id: str = Field(default_factory=lambda: f"log_{uuid.uuid4().hex[:12]}")
    user_id: str
    workout_id: str
    date: str
    duration_minutes: int
    calories_burned: int
    exercises_completed: List[dict]
    difficulty_rating: str  # facile, moyen, difficile
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WorkoutLogCreate(BaseModel):
    workout_id: str
    date: str
    duration_minutes: int
    calories_burned: int
    exercises_completed: List[dict]
    difficulty_rating: str
    notes: Optional[str] = None

class Meal(BaseModel):
    meal_id: str = Field(default_factory=lambda: f"meal_{uuid.uuid4().hex[:12]}")
    user_id: str
    name: str
    meal_type: str  # petit_dejeuner, dejeuner, collation, diner
    date: str
    calories: int
    protein: int
    carbs: int
    fat: int
    recipe: Optional[str] = None
    ingredients: List[str] = []
    prep_time: Optional[int] = None
    image_url: Optional[str] = None
    ai_generated: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MealCreate(BaseModel):
    name: str
    meal_type: str
    date: str
    calories: int
    protein: int
    carbs: int
    fat: int
    recipe: Optional[str] = None
    ingredients: List[str] = []
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    ma_portion: Optional[str] = None
    conseils_reutilisation: Optional[str] = None
    notes: Optional[str] = None
    num_people: Optional[int] = 1
    country_of_origin: Optional[str] = None
    ai_generated: Optional[bool] = False


class PerformanceRecord(BaseModel):
    record_id: str = Field(default_factory=lambda: f"rec_{uuid.uuid4().hex[:12]}")
    user_id: str
    exercise_name: str
    value: str
    unit: str
    date: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PerformanceRecordCreate(BaseModel):
    exercise_name: str
    value: str
    unit: str
    date: str

class WeightEntry(BaseModel):
    entry_id: str = Field(default_factory=lambda: f"we_{uuid.uuid4().hex[:12]}")
    user_id: str
    weight: float
    date: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============== AUTH HELPERS ==============

async def get_current_user(request: Request) -> User:
    """Extract and verify user from session token."""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_doc)

# ============== AUTH ROUTES ==============

@api_router.get("/auth/session")
async def process_session(session_id: str, response: Response):
    """Exchange session_id for session data from Emergent Auth."""
    try:
        async with httpx.AsyncClient() as client_http:
            auth_response = await client_http.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        auth_data = auth_response.json()
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        session_token = auth_data.get("session_token", f"st_{uuid.uuid4().hex}")
        
        existing_user = await db.users.find_one(
            {"email": auth_data["email"]},
            {"_id": 0}
        )
        
        if existing_user:
            user_id = existing_user["user_id"]
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "name": auth_data["name"],
                    "picture": auth_data.get("picture")
                }}
            )
        else:
            new_user = {
                "user_id": user_id,
                "email": auth_data["email"],
                "name": auth_data["name"],
                "picture": auth_data.get("picture"),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "weight": None,
                "height": None,
                "age": None,
                "goal": "maintenance",
                "level": "débutant",
                "target_weight": None,
                "daily_calories": 2000,
                "target_protein": 120,
                "sessions_per_week": 4,
                "notifications_enabled": True,
                "dark_mode": True,
                "language": "fr"
            }
            await db.users.insert_one(new_user)
        
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        session_doc = {
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Permettre plusieurs sessions par utilisateur
        await db.user_sessions.insert_one(session_doc)
        
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=False,
            secure=False,
            samesite="lax",
            path="/",
            max_age=7 * 24 * 60 * 60
        )
        
        user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        return user_doc
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Session processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return user.model_dump()

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout and clear session."""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# ============== USER ROUTES ==============

@api_router.put("/users/me")
async def update_user(update: UserUpdate, user: User = Depends(get_current_user)):
    """Update current user profile."""
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    # Get current user data for calculation
    current_user = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    
    # Merge current data with updates
    merged = {**current_user, **update_data}
    
    # Auto-calculate nutrition if we have required fields
    weight = merged.get('weight')
    height = merged.get('height')
    age = merged.get('age')
    goal = merged.get('goal', 'maintenance')
    gender = merged.get('gender', 'male')
    activity_level = merged.get('activity_level', 'moderate')
    
    if weight and height and age:
        nutrition = calculate_nutrition_targets(
            weight=weight,
            height=height,
            age=age,
            gender=gender,
            goal=goal,
            activity_level=activity_level
        )
        # Only overwrite if not explicitly provided (e.g. from onboarding)
        if 'daily_calories' not in update_data:
            update_data['daily_calories'] = nutrition['daily_calories']
        if 'target_protein' not in update_data:
            update_data['target_protein'] = nutrition['target_protein']
            
        # Recalculate target_weeks if weight or target_weight changes
        if 'weight' in update_data or 'target_weight' in update_data:
            curr_w = update_data.get('weight', merged.get('weight'))
            targ_w = update_data.get('target_weight', merged.get('target_weight'))
            rate = merged.get('weekly_weight_loss', 0.5)
            if curr_w and targ_w and rate > 0:
                diff = abs(curr_w - targ_w)
                update_data['target_weeks'] = int(diff / rate) if diff > 0 else 0
    
    if update_data:
        await db.users.update_one(
            {"user_id": user.user_id},
            {"$set": update_data}
        )
    
    updated_user = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    return updated_user

@api_router.delete("/users/me")
async def delete_user(user: User = Depends(get_current_user), response: Response = None):
    """Delete current user and all associated data."""
    # Delete user data
    await db.users.delete_one({"user_id": user.user_id})
    
    # Delete associated data
    await db.user_sessions.delete_many({"user_id": user.user_id})
    await db.workouts.delete_many({"user_id": user.user_id})
    await db.workout_logs.delete_many({"user_id": user.user_id})
    await db.meals.delete_many({"user_id": user.user_id})
    await db.history.delete_many({"user_id": user.user_id})
    
    # Clear cookie if response object is available (it might not be passed by Depends depending on FastAPI version, but we can try)
    # Actually, the frontend calls logout() right after, so cookie clearing is handled there.
    
    return {"message": "User account and all data deleted"}

# ============== EXERCISES ROUTES ==============

@api_router.get("/exercises")
async def get_exercises(category: Optional[str] = None):
    """Get all exercises or filter by category."""
    query = {}
    if category:
        query["category"] = category
    
    exercises = await db.exercises.find(query, {"_id": 0}).to_list(500)
    return exercises

@api_router.get("/exercises/{exercise_id}")
async def get_exercise(exercise_id: str):
    """Get a specific exercise."""
    exercise = await db.exercises.find_one({"exercise_id": exercise_id}, {"_id": 0})
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise

@api_router.get("/exercises/search/query")
async def search_exercises(q: str, category: Optional[str] = None, difficulty: Optional[str] = None, limit: int = 50):
    """Search exercises by name, description, or muscle groups."""
    query = {}
    
    # Text search on name, description, muscle_groups
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"muscle_groups": {"$elemMatch": {"$regex": q, "$options": "i"}}},
            {"equipment": {"$elemMatch": {"$regex": q, "$options": "i"}}}
        ]
    
    if category:
        query["category"] = category
    
    if difficulty:
        query["difficulty"] = difficulty
    
    exercises = await db.exercises.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return {
        "query": q,
        "count": len(exercises),
        "exercises": exercises
    }

# ============== WORKOUTS ROUTES ==============

@api_router.get("/workouts")
async def get_workouts(user: User = Depends(get_current_user)):
    """Get all workouts for current user."""
    workouts = await db.workouts.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return workouts

@api_router.post("/workouts")
async def create_workout(workout: WorkoutCreate, user: User = Depends(get_current_user)):
    """Create a new workout."""
    workout_doc = {
        "workout_id": f"wk_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        **workout.model_dump(),
        "completed": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.workouts.insert_one(workout_doc)
    del workout_doc["_id"]
    return workout_doc

@api_router.get("/workouts/{workout_id}")
async def get_workout(workout_id: str, user: User = Depends(get_current_user)):
    """Get a specific workout."""
    workout = await db.workouts.find_one(
        {"workout_id": workout_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

@api_router.put("/workouts/{workout_id}")
async def update_workout(workout_id: str, workout: WorkoutCreate, user: User = Depends(get_current_user)):
    """Update a workout."""
    result = await db.workouts.update_one(
        {"workout_id": workout_id, "user_id": user.user_id},
        {"$set": workout.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    updated = await db.workouts.find_one({"workout_id": workout_id}, {"_id": 0})
    return updated

@api_router.delete("/workouts/{workout_id}")
async def delete_workout(workout_id: str, user: User = Depends(get_current_user)):
    """Delete a workout."""
    result = await db.workouts.delete_one({"workout_id": workout_id, "user_id": user.user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
    return {"message": "Workout deleted"}

@api_router.post("/workouts/{workout_id}/complete")
async def complete_workout(workout_id: str, user: User = Depends(get_current_user)):
    """Mark workout as completed."""
    pass # Implementation later

# ============== SEQUENCES (CHRONO) ROUTES ==============

@api_router.get("/sequences")
async def get_sequences(user: User = Depends(get_current_user)):
    """Get all chrono sequences for current user."""
    sequences = await db.sequences.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("position", 1).to_list(200)
    return sequences

@api_router.post("/sequences")
async def create_sequence(sequence: SequenceCreate, user: User = Depends(get_current_user)):
    """Create a new chrono sequence."""
    sequence_doc = {
        **sequence.model_dump(),
        "user_id": user.user_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Allow upsert logic if ID already exists for this user (since frontend uses Date.now() and may just sync)
    await db.sequences.update_one(
        {"id": sequence.id, "user_id": user.user_id},
        {"$set": sequence_doc},
        upsert=True
    )
    return sequence_doc

@api_router.delete("/sequences/{sequence_id}")
async def delete_sequence(sequence_id: int, user: User = Depends(get_current_user)):
    """Delete a chrono sequence."""
    result = await db.sequences.delete_one({"id": sequence_id, "user_id": user.user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Sequence not found")
    return {"message": "Sequence deleted"}

@api_router.post("/sequences/reorder")
async def reorder_sequences(order: List[dict], user: User = Depends(get_current_user)):
    """Update positions for multiple sequences. Expects list of {id: int, position: int}."""
    for item in order:
        await db.sequences.update_one(
            {"id": item["id"], "user_id": user.user_id},
            {"$set": {"position": item["position"]}}
        )
    return {"message": "Order updated"}

# ============== WORKOUT LOGS ROUTES ==============

@api_router.get("/workout-logs")
async def get_workout_logs(user: User = Depends(get_current_user)):
    """Get all workout logs for current user."""
    logs = await db.workout_logs.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("date", -1).to_list(100)
    return logs

@api_router.post("/workout-logs")
async def create_workout_log(log: WorkoutLogCreate, user: User = Depends(get_current_user)):
    """Create a workout log."""
    log_doc = {
        "log_id": f"log_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        **log.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.workout_logs.insert_one(log_doc)
    
    # Mark workout as completed
    await db.workouts.update_one(
        {"workout_id": log.workout_id, "user_id": user.user_id},
        {"$set": {"completed": True}}
    )
    
    del log_doc["_id"]
    return log_doc

# ============== MEALS ROUTES ==============

@api_router.get("/meals")
async def get_meals(date: Optional[str] = None, user: User = Depends(get_current_user)):
    """Get meals for current user, optionally filtered by date."""
    query = {"user_id": user.user_id}
    if date:
        query["date"] = date
    
    meals = await db.meals.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return meals

@api_router.post("/meals")
async def create_meal(meal: MealCreate, user: User = Depends(get_current_user)):
    """Create a new meal."""
    meal_doc = {
        "meal_id": f"meal_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        **meal.model_dump(),
        "ai_generated": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.meals.insert_one(meal_doc)
    del meal_doc["_id"]
    return meal_doc

@api_router.delete("/meals/{meal_id}")
async def delete_meal(meal_id: str, user: User = Depends(get_current_user)):
    """Delete a meal."""
    result = await db.meals.delete_one({"meal_id": meal_id, "user_id": user.user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Meal not found")
    return {"message": "Meal deleted"}

@api_router.post("/meals/{meal_id}/favorite")
async def toggle_meal_favorite(meal_id: str, user: User = Depends(get_current_user)):
    """Bascule le statut favori d'un repas (champ 'liked': bool)."""
    meal = await db.meals.find_one({"meal_id": meal_id, "user_id": user.user_id}, {"_id": 0, "liked": 1})
    if not meal:
        raise HTTPException(status_code=404, detail="Repas non trouvé")
    new_liked = not meal.get("liked", False)
    await db.meals.update_one(
        {"meal_id": meal_id, "user_id": user.user_id},
        {"$set": {"liked": new_liked}}
    )
    return {"meal_id": meal_id, "liked": new_liked}

@api_router.post("/meals/{meal_id}/like")
async def like_meal(meal_id: str, user: User = Depends(get_current_user)):
    """Marque un repas comme aimé — il devient référence pour les prochaines générations."""
    meal = await db.meals.find_one({"meal_id": meal_id, "user_id": user.user_id}, {"_id": 0})
    if not meal:
        raise HTTPException(status_code=404, detail="Repas non trouvé")
    # Store as liked reference in user profile
    liked_ref = {"name": meal.get("name"), "description": meal.get("description"), "meal_type": meal.get("meal_type")}
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"liked_meal": liked_ref, f"liked_meal_{meal.get('meal_type')}": liked_ref}}
    )
    # Also mark the meal itself as liked in DB
    await db.meals.update_one(
        {"meal_id": meal_id, "user_id": user.user_id},
        {"$set": {"liked": True, "disliked": False}}
    )
    return {"meal_id": meal_id, "liked": True, "message": "Repas aimé ! Il servira d'inspiration pour la prochaine génération."}


@api_router.post("/meals/{meal_id}/dislike")
async def dislike_meal(meal_id: str, user: User = Depends(get_current_user)):
    """Marque un repas comme non aimé — il sera exclu des futures générations."""
    meal = await db.meals.find_one({"meal_id": meal_id, "user_id": user.user_id}, {"_id": 0})
    if not meal:
        raise HTTPException(status_code=404, detail="Repas non trouvé")
    meal_name = meal.get("name", "")
    # Add to disliked_meals list (guard against duplicates, max 50)
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0, "disliked_meals": 1})
    disliked = user_doc.get("disliked_meals", []) if user_doc else []
    if meal_name not in disliked:
        disliked.append(meal_name)
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"disliked_meals": disliked[-50:]}}
    )
    # Mark meal as disliked
    await db.meals.update_one(
        {"meal_id": meal_id, "user_id": user.user_id},
        {"$set": {"liked": False, "disliked": True}}
    )
    return {"meal_id": meal_id, "disliked": True, "blacklisted_name": meal_name, "message": "Repas exclu des prochaines générations."}


@api_router.patch("/users/meal-preferences")
async def update_meal_preferences(prefs: MealPreferences, user: User = Depends(get_current_user)):
    """Sauvegarde les préférences de génération de repas (nb personnes, viande, Whey)."""
    update = {k: v for k, v in prefs.model_dump().items() if v is not None}
    if update:
        await db.users.update_one(
            {"user_id": user.user_id},
            {"$set": update}
        )
    return {"message": "Préférences sauvegardées", **update}



@api_router.post("/meals/generate")
async def generate_meal(request: MealGenerationRequest, user: User = Depends(get_current_user)):


    """Generate a meal using Emergent LLM (Gemini) adapted to user's goals."""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="LLM API not configured")
    
    try:
        import json
        
        # Get user's current data for personalized meals
        user_data = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
        
        goal = user_data.get('goal', 'maintenance')
        daily_calories = user_data.get('daily_calories', 2000)
        target_protein = user_data.get('target_protein', 120)
        
        
        # Goal-specific instructions
        meal_type_fr = {

            "petit_dejeuner": "petit-déjeuner",
            "dejeuner": "déjeuner",
            "collation": "collation",
            "diner": "dîner"
        }.get(request.meal_type, request.meal_type)
        
        goal_fr = {
            "weight_loss": "PERTE DE POIDS",
            "muscle_gain": "PRISE DE MUSCLE",
            "maintenance": "MAINTIEN",
            "endurance": "ENDURANCE"
        }.get(goal, "MAINTIEN")
        
        # ═══════════════════════════════════════════════════════════
        # RICH FITQUEST-STYLE PROMPT CONSTRUCTION
        # ═══════════════════════════════════════════════════════════

        # Gather all user data from onboarding
        height = user_data.get('height', 175)
        weight = user_data.get('weight', 75)
        age = user_data.get('age', 30)
        sex = user_data.get('sex', 'homme')
        target_weight = user_data.get('target_weight', weight)

        # User meal preferences (saved globally)
        allow_meat_fish = request.allow_meat_fish if request.allow_meat_fish is not None else user_data.get('allow_meat_fish', True)
        prefer_powdered_protein = request.prefer_powdered_protein if request.prefer_powdered_protein is not None else user_data.get('prefer_powdered_protein', False)
        num_people = request.num_people or user_data.get('num_people', 1)
        # Force 1 person for breakfast and snacks
        if request.meal_type in ('petit_dejeuner', 'collation'):
            num_people = 1

        # IMC
        imc = weight / ((height / 100) ** 2) if height > 0 else 22.0
        if imc < 18.5: imc_cat = "insuffisance pondérale"
        elif imc < 25: imc_cat = "poids normal"
        elif imc < 30: imc_cat = "surpoids"
        else: imc_cat = "obésité"

        # Protein needs (g/kg)
        protein_multiplier = 2.0 if goal in ('muscle_gain',) else 1.6
        protein_needs = round(weight * protein_multiplier)

        # Planning context from request
        planning = request.planning_context or {}
        shift_type = planning.get('shift_type', 'repos')
        workout_type = planning.get('workout_type', 'aucun')

        shift_labels = {
            '6h-18h': 'Travail de Jour (6H-18H)',
            '7h-18h': 'Travail de Jour (7H-18H)',
            '18h-6h': 'Travail de Nuit (18H-6H)',
            'repos': 'Jour de Repos',
            'repos_sport': 'Repos avec Sport Dédié',
        }
        workout_labels = {
            'renforcement': 'Renforcement Musculaire',
            'cardio': 'Cardio',
            'hiit': 'HIIT',
            'repos_actif': 'Repos Actif / Étirements',
            'aucun': 'Aucun sport ce jour',
            'repos': 'Repos complet',
        }
        shift_label = shift_labels.get(shift_type, shift_type)
        workout_label = workout_labels.get(workout_type, workout_type)

        # Onboarding enrichment
        secondary_goals = user_data.get('secondary_goals', [])
        habits_to_change = user_data.get('habits_to_change', [])
        dietary_restrictions = user_data.get('dietary_restrictions', [])
        eating_location = user_data.get('eating_location', 'domicile')
        diet_preference = user_data.get('diet_preference', 'omnivore')
        wants_if = user_data.get('wants_intermittent_fasting', False)
        is_cutting = user_data.get('is_cutting', False)
    
        # Sleep routine context logic
        sleep_impact = ""
        if shift_type == '18h-6h':
            sleep_impact = "COMPOSANTE SOMMEIL : L'utilisateur travaille de nuit. Favoriser des aliments facilitant le sommeil après le poste (magnésium, tryptophane) et éviter les excitants en fin de service."
        elif shift_type in ('6h-18h', '7h-18h'):
            sleep_impact = "COMPOSANTE SOMMEIL : Poste de jour long. Assurer un dîner qui favorise une endormissement rapide pour garantir 7-8h de repos avant le réveil matinal."
        else:
            sleep_impact = "COMPOSANTE SOMMEIL : Journée avec rythme régulier. Favoriser la régularité des cycles circadiens."

        # Calorie needs from planning
        daily_cal_needs_map = {
            '6h-18h':     {'base': 2500, 'mods': {'renforcement': 300, 'cardio': 200, 'hiit': 400, 'repos_actif': 100, 'aucun': 0}},
            '7h-18h':     {'base': 2500, 'mods': {'renforcement': 300, 'cardio': 200, 'hiit': 400, 'repos_actif': 100, 'aucun': 0}},
            '18h-6h':     {'base': 2200, 'mods': {'renforcement': 300, 'cardio': 200, 'hiit': 400, 'repos_actif': 100, 'aucun': 0}},
            'repos':      {'base': 2000, 'mods': {'renforcement': 300, 'cardio': 200, 'hiit': 400, 'repos_actif': 100, 'aucun': 0}},
            'repos_sport':{'base': 2800, 'mods': {}},
        }
        cal_needs = daily_cal_needs_map.get(shift_type, {'base': 2200, 'mods': {}})
        planning_daily_cal = cal_needs['base'] + cal_needs['mods'].get(workout_type, 0)
        # Override with user's calculated target if available
        effective_daily_cal = max(daily_calories, planning_daily_cal) if planning else daily_calories

        # Target calculations
        extra_protein = getattr(request, 'protein_bonus', 0) or 0
        extra_cal = getattr(request, 'calorie_bonus', 0) or 0
        meal_ratio = {'petit_dejeuner': 0.25, 'dejeuner': 0.35, 'collation': 0.10, 'diner': 0.30}.get(request.meal_type, 0.25)
        target_meal_calories = int((effective_daily_cal + extra_cal) * meal_ratio)
        target_meal_protein = int(((target_protein or protein_needs) + extra_protein) * meal_ratio)
        if is_cutting:
            prompt += "\n- L'utilisateur est en phase de SÈCHE (cutting). Privilégie une densité calorique faible mais un volume alimentaire élevé pour la satiété. Ratio de protéines élevé."
        
        # User nutritional info
        if is_cutting:
            prompt += "\n- L'utilisateur souhaite réaliser une SÈCHE de précision. Optimise les horaires de repas pour maximiser la satiété (intermittent fasting si activé) et suggère des ajustements mineurs sur le mouvement quotidien."
        
        nutritional_program = user_data.get('nutritional_program_text') or """
        - Rôle: Gérard Chanot (Waeky), agent de sécurité.
        - Condition: Sclérose en plaques rémittente progressive bien gérée.
        - Horaires: Postes de 12h (6h-18h, 18h-6h, 7h-18h).
        - Objectifs: Maintien de l'énergie, récupération musculaire, gestion de la fatigue.
        """

        # Constraints restoration
        meal_context_desc = {
            "petit_dejeuner": "PETIT-DÉJEUNER",
            "dejeuner": "DÉJEUNER",
            "collation": "COLLATION",
            "diner": "DÎNER"
        }.get(request.meal_type, request.meal_type).upper()

        sport_impact = "CE JOUR INCLUT UNE SÉANCE DE SPORT. LE REPAS DOIT SOUTENIR LA PERFORMANCE OU LA RÉCUPÉRATION." if workout_type != 'aucun' else "CE JOUR N'INCLUT PAS DE SÉANCE DE SPORT. LE REPAS DOIT ÊTRE ÉQUILIBRÉ POUR UN JOUR MOINS ACTIF."
        
        poste_impact = ""
        if shift_type == '18h-6h': poste_impact = "C'EST UN POSTE DE NUIT. L'ALIMENTATION DOIT ÊTRE ADAPTÉE POUR MAINTENIR L'ÉNERGIE ET LA VIGILANCE PENDANT LA NUIT, ET FAVORISER LE REPOS EN JOURNÉE."
        elif 'jour' in shift_label.lower(): poste_impact = "C'EST UN POSTE DE JOUR. L'ALIMENTATION DOIT APPORTER UNE ÉNERGIE DURABLE POUR LA JOURNÉE."
        elif 'repos' in shift_label.lower(): poste_impact = "C'EST UN JOUR DE REPOS. L'ALIMENTATION DOIT FAVORISER LA RÉCUPÉRATION ET LE MAINTIEN."

        specific_constraints = []
        if not allow_meat_fish:
            specific_constraints.append("EXCLURE STRICTEMENT TOUTE VIANDE (ROUGE OU BLANCHE) ET POISSON. PRIVILÉGIER LES PROTÉINES VÉGÉTALES (LÉGUMINEUSES, TOFU, TEMPEH, ŒUFS, LAITAGES).")
        else:
            specific_constraints.append("TRÈS GRANDE DIVERSITÉ DE SOURCES : VIANDE, POISSON, ŒUFS, LÉGUMINEUSES, TOFU. NE PAS SE LIMITER À LA VIANDE.")

        if request.meal_type == 'petit_dejeuner':
            specific_constraints.extend([
                "DOIT ÊTRE UN PETIT-DÉJEUNER COHÉRENT ET RÉALISTE. AUCUNE COMBINAISON ABSURDE.",
                "DOIT ÊTRE SUCRÉ, EN ÉVITANT LES SAVEURS SALÉES (SAUF ŒUFS DANS CRÊPES/PANCAKES).",
                "PAS DE PÂTES, SEMOULE OU SAUCE TOMATE.",
                "TRÈS GRANDE VARIÉTÉ : TARTINES, THÉ, PORRIDGE (occasionnel), SHAKE, FRUITS, YAOURTS, PANCAKES."
            ])
        elif 'collation' in request.meal_type:
            specific_constraints.extend([
                "DOIT ÊTRE UNE COLLATION LÉGÈRE ET ÉNERGISANTE. PAS UN REPAS COMPLET.",
                "FACILE À TRANSPORTER. EX: FRUITS, YAOURTS, SHAKES, AMANDES, BARRES MAISON."
            ])
        elif request.meal_type in ('dejeuner', 'diner'):
            specific_constraints.extend([
                "REPAS COMPLET : PROTÉINES + GLUCIDES + LÉGUMES.",
                "GRANDE VARIÉTÉ : SALADES, GALETTES, WRAPS, BURGERS ÉQUILIBRÉS, PÂTES COMPLÈTES, RIZ, QUINOA.",
                "INSTRUCTIONS DE CUISSON EXTRÊMEMENT DÉTAILLÉES (températures, temps, techniques)."
            ])

        if prefer_powdered_protein:
            specific_constraints.append("AUGMENTER LA FRÉQUENCE DES PROPOSITIONS CONTENANT DES PROTÉINES EN POUDRE (WHEY).")
        
        # New constraints from onboarding
        if secondary_goals:
            specific_constraints.append(f"OBJECTIFS SECONDAIRES : {', '.join(secondary_goals)}. Adapter les nutriments (ex: plus de magnésium pour la fatigue, omega-3 pour le cerveau).")
        if habits_to_change:
            specific_constraints.append(f"HABITUDES À AMÉLIORER : {', '.join(habits_to_change)}. Proposer des alternatives saines à ces habitudes.")
        if dietary_restrictions:
            specific_constraints.append(f"RESTRICTIONS ALIMENTAIRES STRICTES : {', '.join(dietary_restrictions)}. NE JAMAIS UTILISER CES INGRÉDIENTS.")
        if eating_location == 'bureau':
            specific_constraints.append("LIEU DE REPAS : BUREAU. La recette doit être facilement transportable, froide ou réchauffable au micro-ondes, et rapide à manger.")
        if wants_if:
            specific_constraints.append("L'utilisateur pratique le JEÛNE INTERMITTENT. Le repas doit être dense nutritionnellement pour couvrir les besoins sur une fenêtre réduite.")
        
        specific_constraints.append(f"PRÉFÉRENCE ALIMENTAIRE : {diet_preference}.")
        specific_constraints.append("L'ESTIMATION DES CALORIES DANS 'calories' DOIT TOUJOURS ÊTRE UNIQUEMENT POUR 1 PERSONNE.")

        prompt = f"""
        Génère une recette de repas pour {num_people} personne(s) au format JSON.
        Le repas est de type : "{request.meal_type}".
        Le contexte du jour est : "{shift_label} + {workout_label}".
        Profil utilisateur : Taille: {height}cm, Poids: {weight}kg, IMC: {imc:.1f} ({imc_cat}), Besoins en protéines: {protein_needs}g/jour.
        {sport_impact}
        {poste_impact}
        {sleep_impact}

        PROGRAMME NUTRITIONNEL À RESPECTER :
        {nutritional_program}

        CONTRAINTES SPÉCIFIQUES :
        {chr(10).join(f"- {c}" for c in specific_constraints)}

        Format de sortie JSON attendu:
        {{
          "name": "TITRE DU PLAT",
          "description": "DESCRIPTION DÉTAILLÉE DU PLAT.",
          "country_of_origin": "PAYS OU RÉGION D'ORIGINE",
          "calories": {target_meal_calories},
          "protein": {target_meal_protein},
          "carbs": nombre_glucides,
          "fat": nombre_lipides,
          "prep_time": minutes,
          "cook_time": minutes,
          "num_people": {num_people},
          "ingredients": ["QUANTITÉ UNITÉ INGRÉDIENT"],
          "ma_portion": "VOTRE PORTION INDIVIDUELLE (POUR 1 PERSONNE)",
          "recipe": "ÉTAPES EXTRÊMEMENT DÉTAILLÉES (températures, temps exacts)...",
          "conseils_reutilisation": "ASTUCE ÉCONOMIE OU RESTES",
          "notes": "INFORMATIONS NUTRITIONNELLES",
          "image_search": "english keywords for photo search"
        }}
        """
        
        # --- GEMINI ---
        try:
            # Try primary model first (2.0 Flash)
            try:
                model_2_0 = genai.GenerativeModel('gemini-2.0-flash')
                gemini_response = model_2_0.generate_content(prompt)
                response_text = gemini_response.text
            except Exception as e:
                err_str = str(e)
                # If quota error, try fallback model (2.5 Flash)
                if "429" in err_str or "quota" in err_str.lower():
                    logger.info("Quota Gemini 2.0 atteint, tentative avec Gemini 2.5 Flash...")
                    model_fallback = genai.GenerativeModel('gemini-2.5-flash')
                    gemini_response = model_fallback.generate_content(prompt)
                    response_text = gemini_response.text
                else:
                    raise e

            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            meal_data = json.loads(response_text)
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "quota" in err_str.lower():
                raise HTTPException(
                    status_code=429, 
                    detail="⏳ Quota Gemini (2.0 & 2.5) épuisé. La version gratuite est limitée. Réessaie dans quelques minutes ou demain."
                )
            logger.error(f"Erreur Gemini: {e}")
            raise HTTPException(status_code=500, detail="Erreur lors de la génération du repas")
        # ---------------
        
        # Get image from Unsplash
        image_url = None
        image_search = meal_data.get("image_search", "healthy meal")
        try:
            async with httpx.AsyncClient() as http_client:
                unsplash_resp = await http_client.get(
                    "https://api.unsplash.com/search/photos",
                    params={"query": image_search, "per_page": 1, "orientation": "landscape"},
                    headers={"Authorization": "Client-ID Kz8SRK5VsaGQVepxcjusEaM7X7xBsCp3VjfTPlnAY3Q"},
                    timeout=10
                )
                if unsplash_resp.status_code == 200:
                    data = unsplash_resp.json()
                    if data.get("results"):
                        image_url = data["results"][0]["urls"]["regular"]
        except Exception as img_err:
            logger.warning(f"Image fetch failed: {img_err}")
        
        # Fallback image based on meal type
        if not image_url:
            fallback_images = {
                "petit_dejeuner": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
                "dejeuner": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
                "collation": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800",
                "diner": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800"
            }
            image_url = fallback_images.get(request.meal_type, fallback_images["dejeuner"])
        
        meal_doc = {
            "meal_id": f"meal_{uuid.uuid4().hex[:12]}",
            "user_id": user.user_id,
            "name": meal_data["name"],
            "description": meal_data.get("description", ""),
            "country_of_origin": meal_data.get("country_of_origin", ""),
            "meal_type": request.meal_type,
            "date": request.date or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "calories": meal_data.get("calories", target_meal_calories),
            "protein": meal_data.get("protein", target_meal_protein),
            "carbs": meal_data.get("carbs", 0),
            "fat": meal_data.get("fat", 0),
            "recipe": meal_data.get("recipe", ""),
            "ingredients": meal_data.get("ingredients", []),
            "ma_portion": meal_data.get("ma_portion", ""),
            "conseils_reutilisation": meal_data.get("conseils_reutilisation", ""),
            "notes": meal_data.get("notes", ""),
            "prep_time": meal_data.get("prep_time"),
            "cook_time": meal_data.get("cook_time"),
            "num_people": meal_data.get("num_people", num_people),
            "image_url": image_url,
            "ai_generated": True,
            "liked": False,
            "disliked": False,
            "goal": goal,
            "planning_context": request.planning_context,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.meals.insert_one(meal_doc)
        del meal_doc["_id"]
        return meal_doc
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}, response: {response_text}")
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        logger.error(f"Meal generation error: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")

# ============== PERFORMANCE ROUTES ==============

@api_router.get("/performance/records")
async def get_records(user: User = Depends(get_current_user)):
    """Get personal records."""
    records = await db.performance_records.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("date", -1).to_list(100)
    return records

@api_router.post("/performance/records")
async def create_record(record: PerformanceRecordCreate, user: User = Depends(get_current_user)):
    """Create a new personal record."""
    record_doc = {
        "record_id": f"rec_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        **record.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.performance_records.insert_one(record_doc)
    del record_doc["_id"]
    return record_doc

@api_router.get("/performance/weight")
async def get_weight_history(user: User = Depends(get_current_user)):
    """Get weight history."""
    entries = await db.weight_entries.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("date", -1).to_list(100)
    return entries

@api_router.post("/performance/weight")
async def add_weight_entry(weight: float, date: str, user: User = Depends(get_current_user)):
    """Add a weight entry."""
    entry_doc = {
        "entry_id": f"we_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        "weight": weight,
        "date": date,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.weight_entries.insert_one(entry_doc)
    
    # Update user's current weight
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"weight": weight}}
    )
    
    del entry_doc["_id"]
    return entry_doc

@api_router.get("/performance/stats")
async def get_stats(user: User = Depends(get_current_user)):
    """Get performance statistics."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%d")
    month_ago = (datetime.now(timezone.utc) - timedelta(days=30)).strftime("%Y-%m-%d")
    
    # Count workouts this week
    workouts_this_week = await db.workout_logs.count_documents({
        "user_id": user.user_id,
        "date": {"$gte": week_ago}
    })
    
    # Count workouts this month
    workouts_this_month = await db.workout_logs.count_documents({
        "user_id": user.user_id,
        "date": {"$gte": month_ago}
    })
    
    # Sum calories burned this week
    logs = await db.workout_logs.find({
        "user_id": user.user_id,
        "date": {"$gte": week_ago}
    }, {"_id": 0, "calories_burned": 1}).to_list(100)
    calories_this_week = sum(log.get("calories_burned", 0) for log in logs)
    
    # Get meals today
    meals_today = await db.meals.find({
        "user_id": user.user_id,
        "date": today
    }, {"_id": 0, "calories": 1, "protein": 1}).to_list(10)
    
    calories_today = sum(meal.get("calories", 0) for meal in meals_today)
    protein_today = sum(meal.get("protein", 0) for meal in meals_today)
    
    # Calculate streak
    streak = 0
    current_date = datetime.now(timezone.utc).date()
    while True:
        date_str = current_date.strftime("%Y-%m-%d")
        has_workout = await db.workout_logs.count_documents({
            "user_id": user.user_id,
            "date": date_str
        })
        if has_workout > 0:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
    
    return {
        "calories_today": calories_today,
        "protein_today": protein_today,
        "workouts_this_week": workouts_this_week,
        "workouts_this_month": workouts_this_month,
        "calories_burned_this_week": calories_this_week,
        "streak": streak,
        "target_calories": user.daily_calories or 2000,
        "target_protein": user.target_protein or 120,
        "target_sessions": user.sessions_per_week or 4
    }

@api_router.get("/performance/workout-days")
async def get_workout_days(
    month: int = None,
    year: int = None,
    user: User = Depends(get_current_user)
):
    """Get all days with workouts for a specific month (for streak calendar)."""
    now = datetime.now(timezone.utc)
    target_month = month or now.month
    target_year = year or now.year
    
    # Get first and last day of month
    first_day = datetime(target_year, target_month, 1).strftime("%Y-%m-%d")
    if target_month == 12:
        last_day = datetime(target_year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = datetime(target_year, target_month + 1, 1) - timedelta(days=1)
    last_day_str = last_day.strftime("%Y-%m-%d")
    
    # Get all workout logs for this month
    logs = await db.workout_logs.find({
        "user_id": user.user_id,
        "date": {"$gte": first_day, "$lte": last_day_str}
    }, {"_id": 0, "date": 1}).to_list(100)
    
    # Get unique dates
    workout_dates = list(set(log["date"] for log in logs))
    
    return {
        "month": target_month,
        "year": target_year,
        "workout_dates": workout_dates,
        "total_workouts": len(logs)
    }

@api_router.get("/performance/streak-badges")
async def get_streak_badges(user: User = Depends(get_current_user)):
    """Get streak badges status and claim rewards."""
    
    # Define streak badges
    badges = [
        {"days": 7, "label": "Semaine", "xp": 100, "trophy_id": "streak_7"},
        {"days": 30, "label": "Mois", "xp": 500, "trophy_id": "streak_30"},
        {"days": 100, "label": "Champion", "xp": 2000, "trophy_id": "streak_100"},
        {"days": 365, "label": "Légende", "xp": 10000, "trophy_id": "streak_365"}
    ]
    
    # Calculate current streak
    logs = await db.workout_logs.find(
        {"user_id": user.user_id},
        {"_id": 0, "date": 1}
    ).to_list(1000)
    
    unique_dates = sorted(set(log["date"] for log in logs), reverse=True)
    
    streak = 0
    if unique_dates:
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")
        
        if unique_dates[0] == today or unique_dates[0] == yesterday:
            streak = 1
            for i in range(1, len(unique_dates)):
                expected_date = (datetime.strptime(unique_dates[0], "%Y-%m-%d") - timedelta(days=i)).strftime("%Y-%m-%d")
                if unique_dates[i] == expected_date:
                    streak += 1
                else:
                    break
    
    # Get user's claimed badges
    user_doc = await db.users.find_one({"user_id": user.user_id})
    claimed_badges = user_doc.get("claimed_streak_badges", [])
    
    # Check which badges can be claimed
    badge_status = []
    for badge in badges:
        is_unlocked = streak >= badge["days"]
        is_claimed = badge["trophy_id"] in claimed_badges
        can_claim = is_unlocked and not is_claimed
        
        badge_status.append({
            **badge,
            "is_unlocked": is_unlocked,
            "is_claimed": is_claimed,
            "can_claim": can_claim
        })
    
    return {
        "current_streak": streak,
        "badges": badge_status
    }

@api_router.post("/performance/claim-streak-badge/{days}")
async def claim_streak_badge(days: int, user: User = Depends(get_current_user)):
    """Claim a streak badge reward."""
    
    # Badge definitions
    badge_rewards = {
        7: {"xp": 100, "trophy_id": "streak_7"},
        30: {"xp": 500, "trophy_id": "streak_30"},
        100: {"xp": 2000, "trophy_id": "streak_100"},
        365: {"xp": 10000, "trophy_id": "streak_365"}
    }
    
    if days not in badge_rewards:
        raise HTTPException(status_code=400, detail="Invalid badge")
    
    # Calculate current streak
    logs = await db.workout_logs.find(
        {"user_id": user.user_id},
        {"_id": 0, "date": 1}
    ).to_list(1000)
    
    unique_dates = sorted(set(log["date"] for log in logs), reverse=True)
    
    streak = 0
    if unique_dates:
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")
        
        if unique_dates[0] == today or unique_dates[0] == yesterday:
            streak = 1
            for i in range(1, len(unique_dates)):
                expected_date = (datetime.strptime(unique_dates[0], "%Y-%m-%d") - timedelta(days=i)).strftime("%Y-%m-%d")
                if unique_dates[i] == expected_date:
                    streak += 1
                else:
                    break
    
    if streak < days:
        raise HTTPException(status_code=400, detail=f"Streak insuffisant ({streak}/{days})")
    
    # Check if already claimed
    user_doc = await db.users.find_one({"user_id": user.user_id})
    claimed_badges = user_doc.get("claimed_streak_badges", [])
    
    trophy_id = badge_rewards[days]["trophy_id"]
    if trophy_id in claimed_badges:
        raise HTTPException(status_code=400, detail="Badge déjà réclamé")
    
    # Award XP and mark badge as claimed
    xp_reward = badge_rewards[days]["xp"]
    
    await db.users.update_one(
        {"user_id": user.user_id},
        {
            "$inc": {"xp": xp_reward},
            "$addToSet": {"claimed_streak_badges": trophy_id}
        }
    )
    
    return {
        "success": True,
        "xp_awarded": xp_reward,
        "badge_id": trophy_id,
        "message": f"Badge {days} jours réclamé ! +{xp_reward} XP"
    }

# ============== XP & LEVEL SYSTEM ==============

def calculate_bmi(weight: float, height: float) -> dict:
    """Calculate BMI and category."""
    if not weight or not height:
        return {"bmi": None, "category": "unknown"}
    
    height_m = height / 100  # Convert cm to meters
    bmi = weight / (height_m ** 2)
    
    if bmi < 18.5:
        category = "underweight"
    elif bmi < 25:
        category = "normal"
    elif bmi < 30:
        category = "overweight"
    else:
        category = "obese"
    
    return {"bmi": round(bmi, 1), "category": category}

def calculate_xp_multiplier(bmi_category: str, goal: str) -> float:
    """Calculate XP multiplier based on BMI and goal alignment."""
    # Base multiplier
    multiplier = 1.0
    
    # Bonus for goal alignment with BMI category
    if bmi_category == "normal" and goal == "maintenance":
        multiplier = 1.2
    elif bmi_category == "overweight" and goal == "weight_loss":
        multiplier = 1.5  # More XP for working on weight loss when overweight
    elif bmi_category == "underweight" and goal == "muscle_gain":
        multiplier = 1.5  # More XP for gaining muscle when underweight
    elif bmi_category == "obese" and goal == "weight_loss":
        multiplier = 1.8  # Highest bonus for obesity + weight loss
    
    return multiplier

def calculate_level(total_xp: int) -> dict:
    """Calculate level from total XP."""
    levels = [
        (0, 1, "Débutant"),
        (500, 2, "Apprenti"),
        (1500, 3, "Régulier"),
        (3000, 4, "Confirmé"),
        (5000, 5, "Avancé"),
        (8000, 6, "Expert"),
        (12000, 7, "Maître"),
        (18000, 8, "Champion"),
        (25000, 9, "Légende"),
        (35000, 10, "Immortel")
    ]
    
    current_level = 1
    current_title = "Débutant"
    xp_for_next = 500
    xp_current_level = 0
    
    for i, (min_xp, level, title) in enumerate(levels):
        if total_xp >= min_xp:
            current_level = level
            current_title = title
            xp_current_level = min_xp
            if i + 1 < len(levels):
                xp_for_next = levels[i + 1][0]
            else:
                xp_for_next = min_xp  # Max level
    
    progress = 0
    if xp_for_next > xp_current_level:
        progress = ((total_xp - xp_current_level) / (xp_for_next - xp_current_level)) * 100
    
    return {
        "level": current_level,
        "title": current_title,
        "total_xp": total_xp,
        "xp_current_level": xp_current_level,
        "xp_for_next": xp_for_next,
        "progress": min(round(progress, 1), 100)
    }

XP_REWARDS = {
    "workout_completed": 100,
    "meal_logged": 20,
    "weight_logged": 30,
    "streak_day": 50,
    "personal_record": 150,
    "week_goal_reached": 200,
    "first_workout": 100,
    "consistency_bonus": 75
}

@api_router.get("/xp/status")
async def get_xp_status(user: User = Depends(get_current_user)):
    """Get user's XP status, level, and multiplier."""
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    
    total_xp = user_doc.get("total_xp", 0)
    bmi_data = calculate_bmi(user_doc.get("weight"), user_doc.get("height"))
    multiplier = calculate_xp_multiplier(bmi_data["category"], user_doc.get("goal", "maintenance"))
    level_data = calculate_level(total_xp)
    
    return {
        **level_data,
        "bmi": bmi_data,
        "xp_multiplier": multiplier,
        "goal": user_doc.get("goal", "maintenance")
    }

@api_router.post("/xp/add")
async def add_xp(action: str, user: User = Depends(get_current_user)):
    """Add XP for a specific action."""
    if action not in XP_REWARDS:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    
    old_total = user_doc.get("total_xp", 0)
    old_level = calculate_level(old_total)["level"]
    
    base_xp = XP_REWARDS[action]
    bmi_data = calculate_bmi(user_doc.get("weight"), user_doc.get("height"))
    multiplier = calculate_xp_multiplier(bmi_data["category"], user_doc.get("goal", "maintenance"))
    
    earned_xp = int(base_xp * multiplier)
    new_total = old_total + earned_xp
    
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"total_xp": new_total}}
    )
    
    # Log XP history
    xp_log = {
        "user_id": user.user_id,
        "action": action,
        "base_xp": base_xp,
        "multiplier": multiplier,
        "earned_xp": earned_xp,
        "total_after": new_total,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.xp_history.insert_one(xp_log)
    
    new_level_data = calculate_level(new_total)
    new_level = new_level_data["level"]
    
    # Check for level up
    level_up = new_level > old_level
    mega_level_up = level_up and new_level % 10 == 0  # Every 10 levels
    
    return {
        "action": action,
        "earned_xp": earned_xp,
        "multiplier": multiplier,
        "level_up": level_up,
        "mega_level_up": mega_level_up,
        "old_level": old_level,
        **new_level_data
    }

# ============== TROPHIES SYSTEM ==============

TROPHIES = [
    # =============== WORKOUT TROPHIES (25) ===============
    {"id": "first_workout", "name": "Premier Pas", "description": "Complète ton premier entraînement", "icon": "trophy", "category": "workout", "condition": "workouts >= 1", "xp_reward": 100},
    {"id": "workout_5", "name": "En Route", "description": "5 entraînements complétés", "icon": "footprints", "category": "workout", "condition": "workouts >= 5", "xp_reward": 50},
    {"id": "workout_10", "name": "Régulier", "description": "10 entraînements complétés", "icon": "medal", "category": "workout", "condition": "workouts >= 10", "xp_reward": 100},
    {"id": "workout_25", "name": "Déterminé", "description": "25 entraînements complétés", "icon": "shield", "category": "workout", "condition": "workouts >= 25", "xp_reward": 150},
    {"id": "workout_50", "name": "Guerrier", "description": "50 entraînements complétés", "icon": "award", "category": "workout", "condition": "workouts >= 50", "xp_reward": 250},
    {"id": "workout_75", "name": "Vétéran", "description": "75 entraînements complétés", "icon": "sword", "category": "workout", "condition": "workouts >= 75", "xp_reward": 300},
    {"id": "workout_100", "name": "Centenaire", "description": "100 entraînements complétés", "icon": "crown", "category": "workout", "condition": "workouts >= 100", "xp_reward": 500},
    {"id": "workout_150", "name": "Titan", "description": "150 entraînements complétés", "icon": "mountain", "category": "workout", "condition": "workouts >= 150", "xp_reward": 600},
    {"id": "workout_200", "name": "Légende", "description": "200 entraînements complétés", "icon": "sparkles", "category": "workout", "condition": "workouts >= 200", "xp_reward": 750},
    {"id": "workout_250", "name": "Demi-Dieu", "description": "250 entraînements complétés", "icon": "bolt", "category": "workout", "condition": "workouts >= 250", "xp_reward": 1000},
    {"id": "workout_300", "name": "Immortel", "description": "300 entraînements complétés", "icon": "infinity", "category": "workout", "condition": "workouts >= 300", "xp_reward": 1500},
    {"id": "workout_365", "name": "Année de Fer", "description": "365 entraînements - Un par jour possible!", "icon": "calendar", "category": "workout", "condition": "workouts >= 365", "xp_reward": 2000},
    {"id": "workout_500", "name": "Machine", "description": "500 entraînements complétés", "icon": "cog", "category": "workout", "condition": "workouts >= 500", "xp_reward": 3000},
    {"id": "workout_750", "name": "Indestructible", "description": "750 entraînements complétés", "icon": "shield-check", "category": "workout", "condition": "workouts >= 750", "xp_reward": 4000},
    {"id": "workout_1000", "name": "Millénaire", "description": "1000 entraînements - L'élite absolue!", "icon": "gem", "category": "workout", "condition": "workouts >= 1000", "xp_reward": 5000},
    {"id": "quick_workout", "name": "Express", "description": "Complète un entraînement en moins de 20 min", "icon": "zap", "category": "workout", "condition": "quick_workout == true", "xp_reward": 50},
    {"id": "long_workout", "name": "Marathon", "description": "Séance de plus de 90 minutes", "icon": "clock", "category": "workout", "condition": "long_workout == true", "xp_reward": 100},
    {"id": "hiit_master", "name": "Maître HIIT", "description": "10 séances HIIT complétées", "icon": "flame", "category": "workout", "condition": "hiit_workouts >= 10", "xp_reward": 150},
    {"id": "cardio_king", "name": "Roi du Cardio", "description": "20 séances cardio complétées", "icon": "heart-pulse", "category": "workout", "condition": "cardio_workouts >= 20", "xp_reward": 200},
    {"id": "strength_beast", "name": "Bête de Force", "description": "20 séances musculation complétées", "icon": "dumbbell", "category": "workout", "condition": "strength_workouts >= 20", "xp_reward": 200},
    {"id": "flexibility_guru", "name": "Guru Souplesse", "description": "10 séances stretching/yoga", "icon": "person-simple", "category": "workout", "condition": "flexibility_workouts >= 10", "xp_reward": 150},
    {"id": "double_day", "name": "Double Dose", "description": "Deux entraînements dans la même journée", "icon": "repeat", "category": "workout", "condition": "double_day == true", "xp_reward": 75},
    {"id": "triple_day", "name": "Triple Menace", "description": "Trois entraînements dans la même journée", "icon": "layers", "category": "workout", "condition": "triple_day == true", "xp_reward": 150},
    {"id": "comeback_kid", "name": "Retour Gagnant", "description": "Reprends après 7 jours d'absence", "icon": "rotate-ccw", "category": "workout", "condition": "comeback == true", "xp_reward": 100},
    {"id": "perfect_form", "name": "Forme Parfaite", "description": "Complete 5 sets sans pause excessive", "icon": "check-circle", "category": "workout", "condition": "perfect_sets >= 5", "xp_reward": 75},

    # =============== STREAK TROPHIES (20) ===============
    {"id": "streak_3", "name": "Bon Début", "description": "3 jours consécutifs", "icon": "flame", "category": "streak", "condition": "streak >= 3", "xp_reward": 30},
    {"id": "streak_5", "name": "Main Chaude", "description": "5 jours consécutifs", "icon": "flame", "category": "streak", "condition": "streak >= 5", "xp_reward": 50},
    {"id": "streak_7", "name": "Semaine Parfaite", "description": "7 jours consécutifs", "icon": "flame", "category": "streak", "condition": "streak >= 7", "xp_reward": 100},
    {"id": "streak_14", "name": "Deux Semaines", "description": "14 jours consécutifs", "icon": "fire", "category": "streak", "condition": "streak >= 14", "xp_reward": 150},
    {"id": "streak_21", "name": "Habitude Formée", "description": "21 jours - L'habitude est créée!", "icon": "fire", "category": "streak", "condition": "streak >= 21", "xp_reward": 250},
    {"id": "streak_30", "name": "Mois de Fer", "description": "30 jours consécutifs", "icon": "fire", "category": "streak", "condition": "streak >= 30", "xp_reward": 400},
    {"id": "streak_45", "name": "Six Semaines", "description": "45 jours consécutifs", "icon": "fire-extinguisher", "category": "streak", "condition": "streak >= 45", "xp_reward": 500},
    {"id": "streak_60", "name": "Deux Mois", "description": "60 jours consécutifs", "icon": "star", "category": "streak", "condition": "streak >= 60", "xp_reward": 700},
    {"id": "streak_90", "name": "Trimestre Doré", "description": "90 jours consécutifs", "icon": "star", "category": "streak", "condition": "streak >= 90", "xp_reward": 1000},
    {"id": "streak_100", "name": "Centurion", "description": "100 jours consécutifs", "icon": "crown", "category": "streak", "condition": "streak >= 100", "xp_reward": 1200},
    {"id": "streak_150", "name": "Invincible", "description": "150 jours consécutifs", "icon": "shield", "category": "streak", "condition": "streak >= 150", "xp_reward": 1500},
    {"id": "streak_180", "name": "Semestre Parfait", "description": "180 jours consécutifs", "icon": "gem", "category": "streak", "condition": "streak >= 180", "xp_reward": 2000},
    {"id": "streak_200", "name": "Bicentenaire", "description": "200 jours consécutifs", "icon": "gem", "category": "streak", "condition": "streak >= 200", "xp_reward": 2500},
    {"id": "streak_250", "name": "Quart de Millénaire", "description": "250 jours consécutifs", "icon": "trophy", "category": "streak", "condition": "streak >= 250", "xp_reward": 3000},
    {"id": "streak_300", "name": "Spartiate", "description": "300 jours consécutifs", "icon": "sword", "category": "streak", "condition": "streak >= 300", "xp_reward": 4000},
    {"id": "streak_365", "name": "Année Complète", "description": "365 jours - Une année entière!", "icon": "infinity", "category": "streak", "condition": "streak >= 365", "xp_reward": 10000},
    {"id": "weekend_warrior", "name": "Guerrier du Weekend", "description": "10 weekends consécutifs entraînés", "icon": "calendar-check", "category": "streak", "condition": "weekend_streak >= 10", "xp_reward": 200},
    {"id": "monday_motivation", "name": "Monday Motivation", "description": "Jamais raté un lundi (4 semaines)", "icon": "calendar-plus", "category": "streak", "condition": "monday_streak >= 4", "xp_reward": 150},
    {"id": "never_skip_leg", "name": "Never Skip Leg Day", "description": "Jambes entraînées chaque semaine (8 sem)", "icon": "footprints", "category": "streak", "condition": "leg_day_streak >= 8", "xp_reward": 200},
    {"id": "consistent_schedule", "name": "Régulier comme une Horloge", "description": "Même heure d'entraînement (14 jours)", "icon": "alarm-clock", "category": "streak", "condition": "consistent_time >= 14", "xp_reward": 150},

    # =============== NUTRITION TROPHIES (20) ===============
    {"id": "first_meal", "name": "Premier Repas", "description": "Enregistre ton premier repas", "icon": "utensils", "category": "nutrition", "condition": "meals >= 1", "xp_reward": 20},
    {"id": "meals_5", "name": "Gourmet Débutant", "description": "5 repas enregistrés", "icon": "utensils", "category": "nutrition", "condition": "meals >= 5", "xp_reward": 30},
    {"id": "meals_10", "name": "Chef Amateur", "description": "10 repas enregistrés", "icon": "chef-hat", "category": "nutrition", "condition": "meals >= 10", "xp_reward": 50},
    {"id": "meals_25", "name": "Cuisinier", "description": "25 repas enregistrés", "icon": "chef-hat", "category": "nutrition", "condition": "meals >= 25", "xp_reward": 100},
    {"id": "meals_50", "name": "Chef Confirmé", "description": "50 repas enregistrés", "icon": "award", "category": "nutrition", "condition": "meals >= 50", "xp_reward": 200},
    {"id": "meals_100", "name": "Maître Cuisinier", "description": "100 repas enregistrés", "icon": "crown", "category": "nutrition", "condition": "meals >= 100", "xp_reward": 400},
    {"id": "meals_200", "name": "Chef Étoilé", "description": "200 repas enregistrés", "icon": "star", "category": "nutrition", "condition": "meals >= 200", "xp_reward": 600},
    {"id": "meals_365", "name": "Journal Alimentaire", "description": "365 repas - Un an de suivi!", "icon": "book", "category": "nutrition", "condition": "meals >= 365", "xp_reward": 1000},
    {"id": "ai_meal_first", "name": "IA Culinaire", "description": "Premier repas généré par IA", "icon": "sparkles", "category": "nutrition", "condition": "ai_meals >= 1", "xp_reward": 50},
    {"id": "ai_meals_10", "name": "Fan de l'IA", "description": "10 repas générés par IA", "icon": "brain", "category": "nutrition", "condition": "ai_meals >= 10", "xp_reward": 100},
    {"id": "ai_meals_50", "name": "Addict IA", "description": "50 repas générés par IA", "icon": "cpu", "category": "nutrition", "condition": "ai_meals >= 50", "xp_reward": 300},
    {"id": "protein_target", "name": "Objectif Protéines", "description": "Atteins ton objectif protéines 7 jours", "icon": "target", "category": "nutrition", "condition": "protein_streak >= 7", "xp_reward": 150},
    {"id": "calorie_control", "name": "Contrôle Calories", "description": "Dans tes objectifs caloriques 7 jours", "icon": "scale", "category": "nutrition", "condition": "calorie_streak >= 7", "xp_reward": 150},
    {"id": "balanced_meals", "name": "Équilibre Parfait", "description": "10 repas équilibrés (macros)", "icon": "pie-chart", "category": "nutrition", "condition": "balanced_meals >= 10", "xp_reward": 200},
    {"id": "meal_prep", "name": "Meal Prep Master", "description": "Planifie 7 repas à l'avance", "icon": "calendar", "category": "nutrition", "condition": "planned_meals >= 7", "xp_reward": 150},
    {"id": "breakfast_champion", "name": "Champion du Petit-déj", "description": "30 petits-déjeuners enregistrés", "icon": "sunrise", "category": "nutrition", "condition": "breakfast_count >= 30", "xp_reward": 150},
    {"id": "hydration_hero", "name": "Héros de l'Hydratation", "description": "Objectif eau atteint 14 jours", "icon": "droplet", "category": "nutrition", "condition": "water_streak >= 14", "xp_reward": 150},
    {"id": "veggie_lover", "name": "Amoureux des Légumes", "description": "5 portions de légumes/jour (7 jours)", "icon": "carrot", "category": "nutrition", "condition": "veggie_streak >= 7", "xp_reward": 200},
    {"id": "no_junk_week", "name": "Semaine Clean", "description": "Aucun fast-food pendant 7 jours", "icon": "shield-check", "category": "nutrition", "condition": "clean_week == true", "xp_reward": 150},
    {"id": "macro_master", "name": "Maître des Macros", "description": "Objectifs macros atteints 30 jours", "icon": "trophy", "category": "nutrition", "condition": "macro_streak >= 30", "xp_reward": 500},

    # =============== PROGRESS TROPHIES (20) ===============
    {"id": "first_weight", "name": "Premier Pesage", "description": "Enregistre ton premier poids", "icon": "scale", "category": "progress", "condition": "weight_entries >= 1", "xp_reward": 30},
    {"id": "weight_10", "name": "Suivi Régulier", "description": "10 pesées enregistrées", "icon": "trending-up", "category": "progress", "condition": "weight_entries >= 10", "xp_reward": 50},
    {"id": "weight_30", "name": "Mois de Suivi", "description": "30 pesées enregistrées", "icon": "calendar-check", "category": "progress", "condition": "weight_entries >= 30", "xp_reward": 100},
    {"id": "weight_100", "name": "Obsessionnel", "description": "100 pesées enregistrées", "icon": "line-chart", "category": "progress", "condition": "weight_entries >= 100", "xp_reward": 300},
    {"id": "first_record", "name": "Premier Record", "description": "Bats ton premier record personnel", "icon": "zap", "category": "progress", "condition": "records >= 1", "xp_reward": 100},
    {"id": "records_5", "name": "Collectionneur", "description": "5 records personnels battus", "icon": "trophy", "category": "progress", "condition": "records >= 5", "xp_reward": 200},
    {"id": "records_10", "name": "Record Man", "description": "10 records personnels battus", "icon": "medal", "category": "progress", "condition": "records >= 10", "xp_reward": 350},
    {"id": "records_25", "name": "Chasseur de Records", "description": "25 records personnels battus", "icon": "award", "category": "progress", "condition": "records >= 25", "xp_reward": 500},
    {"id": "records_50", "name": "Légende des Records", "description": "50 records personnels battus", "icon": "crown", "category": "progress", "condition": "records >= 50", "xp_reward": 1000},
    {"id": "weight_loss_1kg", "name": "Premier Kilo", "description": "Perds ton premier kilogramme", "icon": "arrow-down", "category": "progress", "condition": "weight_lost >= 1", "xp_reward": 100},
    {"id": "weight_loss_5kg", "name": "5 Kilos Envolés", "description": "5 kg de perdus", "icon": "arrow-down", "category": "progress", "condition": "weight_lost >= 5", "xp_reward": 300},
    {"id": "weight_loss_10kg", "name": "Transformation", "description": "10 kg de perdus", "icon": "star", "category": "progress", "condition": "weight_lost >= 10", "xp_reward": 750},
    {"id": "weight_loss_20kg", "name": "Métamorphose", "description": "20 kg de perdus", "icon": "gem", "category": "progress", "condition": "weight_lost >= 20", "xp_reward": 2000},
    {"id": "muscle_gain_1kg", "name": "Premier Muscle", "description": "Gagne ton premier kg de muscle", "icon": "arrow-up", "category": "progress", "condition": "muscle_gained >= 1", "xp_reward": 100},
    {"id": "muscle_gain_5kg", "name": "5 Kilos de Muscle", "description": "5 kg de muscle gagnés", "icon": "dumbbell", "category": "progress", "condition": "muscle_gained >= 5", "xp_reward": 500},
    {"id": "goal_reached", "name": "Objectif Atteint", "description": "Atteins ton poids cible", "icon": "target", "category": "progress", "condition": "goal_reached == true", "xp_reward": 1000},
    {"id": "body_comp", "name": "Recomposition", "description": "Améliore ta composition corporelle", "icon": "activity", "category": "progress", "condition": "body_recomp == true", "xp_reward": 500},
    {"id": "bmi_normal", "name": "IMC Normal", "description": "Atteins un IMC normal", "icon": "heart", "category": "progress", "condition": "bmi_normal == true", "xp_reward": 500},
    {"id": "strength_double", "name": "Force x2", "description": "Double ta force sur un exercice", "icon": "trending-up", "category": "progress", "condition": "strength_doubled == true", "xp_reward": 750},
    {"id": "endurance_improve", "name": "Endurance Améliorée", "description": "Améliore ton cardio de 50%", "icon": "heart-pulse", "category": "progress", "condition": "cardio_improved >= 50", "xp_reward": 500},

    # =============== LEVEL TROPHIES (15) ===============
    {"id": "level_2", "name": "Apprenti", "description": "Atteins le niveau 2", "icon": "badge", "category": "level", "condition": "level >= 2", "xp_reward": 50},
    {"id": "level_3", "name": "Régulier", "description": "Atteins le niveau 3", "icon": "badge", "category": "level", "condition": "level >= 3", "xp_reward": 75},
    {"id": "level_4", "name": "Confirmé", "description": "Atteins le niveau 4", "icon": "badge", "category": "level", "condition": "level >= 4", "xp_reward": 100},
    {"id": "level_5", "name": "Avancé", "description": "Atteins le niveau 5", "icon": "award", "category": "level", "condition": "level >= 5", "xp_reward": 150},
    {"id": "level_6", "name": "Expert", "description": "Atteins le niveau 6", "icon": "medal", "category": "level", "condition": "level >= 6", "xp_reward": 200},
    {"id": "level_7", "name": "Maître", "description": "Atteins le niveau 7", "icon": "star", "category": "level", "condition": "level >= 7", "xp_reward": 300},
    {"id": "level_8", "name": "Champion", "description": "Atteins le niveau 8", "icon": "crown", "category": "level", "condition": "level >= 8", "xp_reward": 400},
    {"id": "level_9", "name": "Légende", "description": "Atteins le niveau 9", "icon": "sparkles", "category": "level", "condition": "level >= 9", "xp_reward": 500},
    {"id": "level_10", "name": "Immortel", "description": "Atteins le niveau 10 - Maximum!", "icon": "gem", "category": "level", "condition": "level >= 10", "xp_reward": 1000},
    {"id": "xp_1000", "name": "1K Club", "description": "Accumule 1000 XP", "icon": "sparkles", "category": "level", "condition": "total_xp >= 1000", "xp_reward": 100},
    {"id": "xp_5000", "name": "5K Club", "description": "Accumule 5000 XP", "icon": "star", "category": "level", "condition": "total_xp >= 5000", "xp_reward": 250},
    {"id": "xp_10000", "name": "10K Club", "description": "Accumule 10000 XP", "icon": "trophy", "category": "level", "condition": "total_xp >= 10000", "xp_reward": 500},
    {"id": "xp_25000", "name": "25K Club", "description": "Accumule 25000 XP", "icon": "crown", "category": "level", "condition": "total_xp >= 25000", "xp_reward": 1000},
    {"id": "xp_50000", "name": "50K Club", "description": "Accumule 50000 XP", "icon": "gem", "category": "level", "condition": "total_xp >= 50000", "xp_reward": 2000},
    {"id": "xp_100000", "name": "100K Club", "description": "Accumule 100000 XP - Élite!", "icon": "infinity", "category": "level", "condition": "total_xp >= 100000", "xp_reward": 5000},

    # =============== SPECIAL TROPHIES (25) ===============
    {"id": "early_bird", "name": "Lève-tôt", "description": "Entraîne-toi avant 6h du matin", "icon": "sunrise", "category": "special", "condition": "early_workout == true", "xp_reward": 100},
    {"id": "super_early", "name": "Extrême Matinal", "description": "Entraîne-toi avant 5h du matin", "icon": "sun-dim", "category": "special", "condition": "super_early == true", "xp_reward": 200},
    {"id": "night_owl", "name": "Oiseau de Nuit", "description": "Entraîne-toi après 22h", "icon": "moon", "category": "special", "condition": "night_workout == true", "xp_reward": 100},
    {"id": "midnight_warrior", "name": "Guerrier de Minuit", "description": "Entraîne-toi après minuit", "icon": "moon-star", "category": "special", "condition": "midnight_workout == true", "xp_reward": 200},
    {"id": "variety_master", "name": "Maître de la Variété", "description": "Exerce toutes les catégories", "icon": "layers", "category": "special", "condition": "all_categories == true", "xp_reward": 300},
    {"id": "new_year", "name": "Bonne Résolution", "description": "Entraîne-toi le 1er janvier", "icon": "party-popper", "category": "special", "condition": "new_year_workout == true", "xp_reward": 200},
    {"id": "birthday_workout", "name": "Anniversaire Fitness", "description": "Entraîne-toi le jour de ton anniversaire", "icon": "cake", "category": "special", "condition": "birthday_workout == true", "xp_reward": 150},
    {"id": "holiday_warrior", "name": "Guerrier des Fêtes", "description": "Entraîne-toi à Noël", "icon": "gift", "category": "special", "condition": "christmas_workout == true", "xp_reward": 200},
    {"id": "all_programs", "name": "Touche-à-tout", "description": "Essaie tous les programmes", "icon": "check-check", "category": "special", "condition": "all_programs == true", "xp_reward": 500},
    {"id": "program_complete", "name": "Programme Terminé", "description": "Complète un programme entier", "icon": "graduation-cap", "category": "special", "condition": "program_completed >= 1", "xp_reward": 500},
    {"id": "three_programs", "name": "Triple Diplômé", "description": "Complète 3 programmes", "icon": "medal", "category": "special", "condition": "program_completed >= 3", "xp_reward": 1500},
    {"id": "chrono_master", "name": "Maître du Chrono", "description": "Utilise le chronomètre 50 fois", "icon": "timer", "category": "special", "condition": "chrono_uses >= 50", "xp_reward": 200},
    {"id": "interval_king", "name": "Roi des Intervalles", "description": "100 intervalles complétés", "icon": "repeat", "category": "special", "condition": "intervals_completed >= 100", "xp_reward": 300},
    {"id": "explorer", "name": "Explorateur", "description": "Essaie 50 exercices différents", "icon": "compass", "category": "special", "condition": "unique_exercises >= 50", "xp_reward": 250},
    {"id": "exercise_master", "name": "Maître des Exercices", "description": "Essaie 100 exercices différents", "icon": "map", "category": "special", "condition": "unique_exercises >= 100", "xp_reward": 500},
    {"id": "exercise_legend", "name": "Légende des Exercices", "description": "Essaie 200 exercices différents", "icon": "globe", "category": "special", "condition": "unique_exercises >= 200", "xp_reward": 1000},
    {"id": "social_share", "name": "Influenceur Fitness", "description": "Partage ton premier progrès", "icon": "share", "category": "special", "condition": "shares >= 1", "xp_reward": 50},
    {"id": "profile_complete", "name": "Profil Complet", "description": "Remplis toutes les infos du profil", "icon": "user-check", "category": "special", "condition": "profile_complete == true", "xp_reward": 50},
    {"id": "first_export", "name": "Backup Pro", "description": "Exporte tes données pour la première fois", "icon": "download", "category": "special", "condition": "exports >= 1", "xp_reward": 30},
    {"id": "feedback_given", "name": "Voix du Peuple", "description": "Donne ton premier feedback", "icon": "message-circle", "category": "special", "condition": "feedback >= 1", "xp_reward": 50},
    {"id": "rain_or_shine", "name": "Pluie ou Soleil", "description": "Entraîne-toi malgré la météo", "icon": "cloud-rain", "category": "special", "condition": "bad_weather_workout == true", "xp_reward": 100},
    {"id": "travel_fit", "name": "Voyage Fitness", "description": "Entraîne-toi en voyage", "icon": "plane", "category": "special", "condition": "travel_workout == true", "xp_reward": 100},
    {"id": "full_moon", "name": "Pleine Lune", "description": "Entraîne-toi une nuit de pleine lune", "icon": "moon", "category": "special", "condition": "full_moon_workout == true", "xp_reward": 150},
    {"id": "app_anniversary", "name": "Fidèle", "description": "1 an d'utilisation de l'app", "icon": "heart", "category": "special", "condition": "app_age_days >= 365", "xp_reward": 1000},
    {"id": "founding_member", "name": "Membre Fondateur", "description": "Parmi les premiers utilisateurs", "icon": "star", "category": "special", "condition": "early_adopter == true", "xp_reward": 500}
]

@api_router.get("/trophies")
async def get_trophies(user: User = Depends(get_current_user)):
    """Get all trophies with user's unlock status."""
    # Get user stats
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    total_xp = user_doc.get("total_xp", 0)
    level_data = calculate_level(total_xp)
    
    workouts_count = await db.workout_logs.count_documents({"user_id": user.user_id})
    meals_count = await db.meals.count_documents({"user_id": user.user_id})
    ai_meals_count = await db.meals.count_documents({"user_id": user.user_id, "ai_generated": True})
    weight_entries_count = await db.weight_entries.count_documents({"user_id": user.user_id})
    records_count = await db.performance_records.count_documents({"user_id": user.user_id})
    
    # Get unlocked trophies from DB
    unlocked_docs = await db.user_trophies.find({"user_id": user.user_id}, {"_id": 0}).to_list(100)
    unlocked_ids = {t["trophy_id"] for t in unlocked_docs}
    
    # Check each trophy
    stats = {
        "workouts": workouts_count,
        "meals": meals_count,
        "ai_meals": ai_meals_count,
        "weight_entries": weight_entries_count,
        "records": records_count,
        "level": level_data["level"],
        "streak": 0  # Will be calculated separately
    }
    
    # Calculate streak
    current_date = datetime.now(timezone.utc).date()
    streak = 0
    while True:
        date_str = current_date.strftime("%Y-%m-%d")
        has_workout = await db.workout_logs.count_documents({
            "user_id": user.user_id,
            "date": date_str
        })
        if has_workout > 0:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
    stats["streak"] = streak
    
    trophies_with_status = []
    for trophy in TROPHIES:
        is_unlocked = trophy["id"] in unlocked_ids
        
        # Check if should be unlocked based on conditions
        should_unlock = False
        condition = trophy["condition"]
        
        if "workouts >=" in condition:
            threshold = int(condition.split(">=")[1].strip())
            should_unlock = stats["workouts"] >= threshold
        elif "streak >=" in condition:
            threshold = int(condition.split(">=")[1].strip())
            should_unlock = stats["streak"] >= threshold
        elif "meals >=" in condition:
            threshold = int(condition.split(">=")[1].strip())
            should_unlock = stats["meals"] >= threshold
        elif "ai_meals >=" in condition:
            threshold = int(condition.split(">=")[1].strip())
            should_unlock = stats["ai_meals"] >= threshold
        elif "weight_entries >=" in condition:
            threshold = int(condition.split(">=")[1].strip())
            should_unlock = stats["weight_entries"] >= threshold
        elif "records >=" in condition:
            threshold = int(condition.split(">=")[1].strip())
            should_unlock = stats["records"] >= threshold
        elif "level >=" in condition:
            threshold = int(condition.split(">=")[1].strip())
            should_unlock = stats["level"] >= threshold
        
        # Auto-unlock if conditions met but not yet unlocked
        if should_unlock and not is_unlocked:
            await db.user_trophies.insert_one({
                "user_id": user.user_id,
                "trophy_id": trophy["id"],
                "unlocked_at": datetime.now(timezone.utc).isoformat()
            })
            is_unlocked = True
        
        trophies_with_status.append({
            **trophy,
            "unlocked": is_unlocked,
            "unlocked_at": next((t["unlocked_at"] for t in unlocked_docs if t["trophy_id"] == trophy["id"]), None)
        })
    
    unlocked_count = sum(1 for t in trophies_with_status if t["unlocked"])
    
    return {
        "trophies": trophies_with_status,
        "stats": {
            "total": len(TROPHIES),
            "unlocked": unlocked_count,
            "progress": round((unlocked_count / len(TROPHIES)) * 100, 1)
        },
        "user_stats": stats
    }

# ============== WORKOUT PROGRAMS ==============

PREDEFINED_PROGRAMS = [
    {
        "program_id": "push_pull_legs",
        "name": "Push/Pull/Legs",
        "description": "Programme classique en 6 jours pour la masse musculaire",
        "duration_weeks": 8,
        "days_per_week": 6,
        "level": "intermédiaire",
        "goal": "muscle_gain",
        "schedule": [
            {"day": 1, "name": "Push A", "focus": ["chest", "shoulders", "arms"], "workout_type": "push"},
            {"day": 2, "name": "Pull A", "focus": ["back", "arms"], "workout_type": "pull"},
            {"day": 3, "name": "Legs A", "focus": ["legs", "core"], "workout_type": "legs"},
            {"day": 4, "name": "Push B", "focus": ["chest", "shoulders", "arms"], "workout_type": "push"},
            {"day": 5, "name": "Pull B", "focus": ["back", "arms"], "workout_type": "pull"},
            {"day": 6, "name": "Legs B", "focus": ["legs", "core"], "workout_type": "legs"}
        ]
    },
    {
        "program_id": "full_body_beginner",
        "name": "Full Body Débutant",
        "description": "Programme idéal pour commencer la musculation",
        "duration_weeks": 12,
        "days_per_week": 3,
        "level": "débutant",
        "goal": "muscle_gain",
        "schedule": [
            {"day": 1, "name": "Full Body A", "focus": ["chest", "back", "legs"], "workout_type": "full_body"},
            {"day": 2, "name": "Full Body B", "focus": ["shoulders", "arms", "core"], "workout_type": "full_body"},
            {"day": 3, "name": "Full Body C", "focus": ["legs", "back", "chest"], "workout_type": "full_body"}
        ]
    },
    {
        "program_id": "upper_lower",
        "name": "Upper/Lower Split",
        "description": "Alternance haut du corps / bas du corps en 4 jours",
        "duration_weeks": 10,
        "days_per_week": 4,
        "level": "intermédiaire",
        "goal": "muscle_gain",
        "schedule": [
            {"day": 1, "name": "Upper A", "focus": ["chest", "back", "shoulders", "arms"], "workout_type": "upper"},
            {"day": 2, "name": "Lower A", "focus": ["legs", "core"], "workout_type": "lower"},
            {"day": 3, "name": "Upper B", "focus": ["chest", "back", "shoulders", "arms"], "workout_type": "upper"},
            {"day": 4, "name": "Lower B", "focus": ["legs", "core"], "workout_type": "lower"}
        ]
    },
    {
        "program_id": "weight_loss",
        "name": "Perte de Poids",
        "description": "Cardio et musculation pour brûler les graisses",
        "duration_weeks": 8,
        "days_per_week": 5,
        "level": "débutant",
        "goal": "weight_loss",
        "schedule": [
            {"day": 1, "name": "Full Body + HIIT", "focus": ["cardio", "legs", "core"], "workout_type": "full_body"},
            {"day": 2, "name": "Cardio Modéré", "focus": ["cardio"], "workout_type": "cardio"},
            {"day": 3, "name": "Upper Body + Cardio", "focus": ["chest", "back", "cardio"], "workout_type": "upper"},
            {"day": 4, "name": "Lower Body + Core", "focus": ["legs", "core"], "workout_type": "lower"},
            {"day": 5, "name": "HIIT Total", "focus": ["cardio", "core"], "workout_type": "cardio"}
        ]
    },
    {
        "program_id": "strength_5x5",
        "name": "Force 5x5",
        "description": "Programme de force basé sur les mouvements fondamentaux",
        "duration_weeks": 12,
        "days_per_week": 3,
        "level": "intermédiaire",
        "goal": "muscle_gain",
        "schedule": [
            {"day": 1, "name": "Squat Focus", "focus": ["legs", "back"], "workout_type": "lower"},
            {"day": 2, "name": "Bench Focus", "focus": ["chest", "shoulders", "arms"], "workout_type": "upper"},
            {"day": 3, "name": "Deadlift Focus", "focus": ["back", "legs"], "workout_type": "full_body"}
        ]
    },
    {
        "program_id": "calisthenics",
        "name": "Calisthenics",
        "description": "Entraînement au poids du corps progressif",
        "duration_weeks": 12,
        "days_per_week": 4,
        "level": "intermédiaire",
        "goal": "endurance",
        "schedule": [
            {"day": 1, "name": "Push Skills", "focus": ["chest", "shoulders", "core"], "workout_type": "push"},
            {"day": 2, "name": "Pull Skills", "focus": ["back", "arms", "core"], "workout_type": "pull"},
            {"day": 3, "name": "Legs & Mobility", "focus": ["legs", "core"], "workout_type": "legs"},
            {"day": 4, "name": "Skills Practice", "focus": ["core", "shoulders"], "workout_type": "core"}
        ]
    }
]

@api_router.get("/programs")
async def get_programs(level: Optional[str] = None, goal: Optional[str] = None):
    """Get all workout programs, optionally filtered."""
    programs = PREDEFINED_PROGRAMS.copy()
    
    if level:
        programs = [p for p in programs if p["level"] == level]
    if goal:
        programs = [p for p in programs if p["goal"] == goal]
    
    return programs

@api_router.get("/programs/{program_id}")
async def get_program(program_id: str):
    """Get a specific program with exercise suggestions."""
    program = next((p for p in PREDEFINED_PROGRAMS if p["program_id"] == program_id), None)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # Get exercises for each day
    enriched_schedule = []
    for day in program["schedule"]:
        day_exercises = []
        for category in day["focus"]:
            # Get 3-4 exercises per category
            exercises = await db.exercises.find(
                {"category": category},
                {"_id": 0, "exercise_id": 1, "name": 1, "muscle_groups": 1, "difficulty": 1, "equipment": 1}
            ).to_list(4)
            day_exercises.extend(exercises)
        
        enriched_schedule.append({
            **day,
            "suggested_exercises": day_exercises[:8]  # Max 8 exercises per day
        })
    
    return {
        **program,
        "schedule": enriched_schedule
    }

@api_router.post("/programs/{program_id}/start")
async def start_program(program_id: str, user: User = Depends(get_current_user)):
    """Start a workout program for the user."""
    program = next((p for p in PREDEFINED_PROGRAMS if p["program_id"] == program_id), None)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # Check if user already has an active program
    existing = await db.user_programs.find_one({
        "user_id": user.user_id,
        "status": "active"
    })
    
    if existing:
        # Deactivate current program
        await db.user_programs.update_one(
            {"_id": existing["_id"]},
            {"$set": {"status": "abandoned"}}
        )
    
    # Create new program enrollment
    start_date = datetime.now(timezone.utc)
    end_date = start_date + timedelta(weeks=program["duration_weeks"])
    
    enrollment = {
        "user_id": user.user_id,
        "program_id": program_id,
        "program_name": program["name"],
        "status": "active",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "current_week": 1,
        "workouts_completed": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.user_programs.insert_one(enrollment)
    
    return {
        "message": f"Programme '{program['name']}' démarré !",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "duration_weeks": program["duration_weeks"]
    }

@api_router.get("/programs/user/active")
async def get_active_program(user: User = Depends(get_current_user)):
    """Get user's active program."""
    active = await db.user_programs.find_one(
        {"user_id": user.user_id, "status": "active"},
        {"_id": 0}
    )
    
    if not active:
        return {"active_program": None}
    
    # Get program details
    program = next((p for p in PREDEFINED_PROGRAMS if p["program_id"] == active["program_id"]), None)
    
    return {
        "active_program": {
            **active,
            "program_details": program
        }
    }

# ============== INIT EXERCISES ==============

@api_router.post("/init/exercises")
async def init_exercises():
    """Initialize the exercises database with 130+ exercises."""
    existing = await db.exercises.count_documents({})
    if existing > 0:
        return {"message": f"Exercises already initialized ({existing} exercises)"}
    
    exercises = get_all_exercises()
    if exercises:
        await db.exercises.insert_many(exercises)
    
    return {"message": f"Initialized {len(exercises)} exercises"}

@api_router.post("/init/exercises/refresh")
async def refresh_exercises():
    """Delete all exercises and reinitialize with the full database."""
    await db.exercises.delete_many({})
    exercises = get_all_exercises()
    if exercises:
        await db.exercises.insert_many(exercises)
    return {"message": f"Refreshed database with {len(exercises)} exercises"}

# ============== DANGER ZONE ENDPOINTS ==============

@api_router.get("/users/me/export")
async def export_user_data(request: Request):
    """Export all user data as JSON."""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": session_token})
    if not session:
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_id = session["user_id"]
    
    # Get user profile
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0, "hashed_password": 0})
    
    # Get all user data
    workouts = await db.workouts.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    workout_logs = await db.workout_logs.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    meals = await db.meals.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    weight_entries = await db.weight_entries.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    performance_records = await db.performance_records.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    hydration = await db.hydration.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    steps = await db.steps.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    
    export_data = {
        "export_date": datetime.now(timezone.utc).isoformat(),
        "user": user,
        "workouts": workouts,
        "workout_logs": workout_logs,
        "meals": meals,
        "weight_entries": weight_entries,
        "performance_records": performance_records,
        "hydration": hydration,
        "steps": steps
    }
    
    return export_data

@api_router.delete("/users/me")
async def delete_user_account(request: Request):
    """Delete user account and all associated data."""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": session_token})
    if not session:
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_id = session["user_id"]
    
    # Delete all user data
    await db.workouts.delete_many({"user_id": user_id})
    await db.workout_logs.delete_many({"user_id": user_id})
    await db.meals.delete_many({"user_id": user_id})
    await db.weight_entries.delete_many({"user_id": user_id})
    await db.performance_records.delete_many({"user_id": user_id})
    await db.hydration.delete_many({"user_id": user_id})
    await db.steps.delete_many({"user_id": user_id})
    await db.reminders.delete_many({"user_id": user_id})
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.users.delete_one({"user_id": user_id})
    
    response = JSONResponse(content={"message": "Account deleted successfully"})
    response.delete_cookie("session_token")
    
    return response

# ============== HYDRATION TRACKING ==============

class HydrationEntry(BaseModel):
    glasses: int = 0
    target: int = 8
    date: str

@api_router.get("/hydration")
async def get_hydration(date: Optional[str] = None, user: User = Depends(get_current_user)):
    """Get hydration data for a specific date."""
    if not date:
        date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    entry = await db.hydration.find_one(
        {"user_id": user.user_id, "date": date},
        {"_id": 0}
    )
    
    if not entry:
        # Return default
        return {"user_id": user.user_id, "date": date, "glasses": 0, "target": 8}
    
    return entry

@api_router.post("/hydration/add")
async def add_water(user: User = Depends(get_current_user)):
    """Add one glass of water."""
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    result = await db.hydration.find_one_and_update(
        {"user_id": user.user_id, "date": date},
        {
            "$inc": {"glasses": 1},
            "$setOnInsert": {"target": 8, "created_at": datetime.now(timezone.utc).isoformat()}
        },
        upsert=True,
        return_document=True,
        projection={"_id": 0}
    )
    
    return result

@api_router.post("/hydration/remove")
async def remove_water(user: User = Depends(get_current_user)):
    """Remove one glass of water."""
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    entry = await db.hydration.find_one({"user_id": user.user_id, "date": date})
    if entry and entry.get("glasses", 0) > 0:
        result = await db.hydration.find_one_and_update(
            {"user_id": user.user_id, "date": date},
            {"$inc": {"glasses": -1}},
            return_document=True,
            projection={"_id": 0}
        )
        return result
    
    return {"user_id": user.user_id, "date": date, "glasses": 0, "target": 8}

@api_router.put("/hydration/target")
async def update_hydration_target(target: int, user: User = Depends(get_current_user)):
    """Update daily hydration target."""
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    result = await db.hydration.find_one_and_update(
        {"user_id": user.user_id, "date": date},
        {
            "$set": {"target": target},
            "$setOnInsert": {"glasses": 0, "created_at": datetime.now(timezone.utc).isoformat()}
        },
        upsert=True,
        return_document=True,
        projection={"_id": 0}
    )
    
    return result

# ============== STEPS TRACKING ==============

class StepsEntry(BaseModel):
    steps: int
    date: str

@api_router.get("/steps")
async def get_steps(date: Optional[str] = None, user: User = Depends(get_current_user)):
    """Get steps for a specific date."""
    if not date:
        date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Get user's custom target
    user_data = await db.users.find_one({"user_id": user.user_id}, {"_id": 0, "steps_target": 1})
    default_target = user_data.get("steps_target", 10000) if user_data else 10000
    
    entry = await db.steps.find_one(
        {"user_id": user.user_id, "date": date},
        {"_id": 0}
    )
    
    if not entry:
        return {"user_id": user.user_id, "date": date, "steps": 0, "target": default_target}
    
    # Use user's target if not set on entry
    if "target" not in entry:
        entry["target"] = default_target
    
    return entry

@api_router.post("/steps")
async def update_steps(entry: StepsEntry, user: User = Depends(get_current_user)):
    """Update steps for a date."""
    # Get user's custom target
    user_data = await db.users.find_one({"user_id": user.user_id}, {"_id": 0, "steps_target": 1})
    default_target = user_data.get("steps_target", 10000) if user_data else 10000
    
    result = await db.steps.find_one_and_update(
        {"user_id": user.user_id, "date": entry.date},
        {
            "$set": {"steps": entry.steps, "updated_at": datetime.now(timezone.utc).isoformat()},
            "$setOnInsert": {"target": default_target, "created_at": datetime.now(timezone.utc).isoformat()}
        },
        upsert=True,
        return_document=True,
        projection={"_id": 0}
    )
    
    return result

@api_router.put("/steps/target")
async def update_steps_target(target: int, user: User = Depends(get_current_user)):
    """Update user's daily steps target."""
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"steps_target": target}}
    )
    return {"message": "Steps target updated", "target": target}

@api_router.get("/steps/history")
async def get_steps_history(days: int = 7, user: User = Depends(get_current_user)):
    """Get steps history for the last N days."""
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=days)
    
    entries = await db.steps.find(
        {
            "user_id": user.user_id,
            "date": {"$gte": start_date.strftime("%Y-%m-%d"), "$lte": end_date.strftime("%Y-%m-%d")}
        },
        {"_id": 0}
    ).sort("date", -1).to_list(days)
    
    return entries

# ============== REMINDERS ==============

class Reminder(BaseModel):
    reminder_id: str = Field(default_factory=lambda: f"rem_{uuid.uuid4().hex[:12]}")
    type: str  # 'workout', 'water', 'custom'
    title: str
    time: str  # "HH:MM"
    days: List[str] = []  # ['monday', 'tuesday', ...] or empty for daily
    enabled: bool = True
    interval_hours: Optional[int] = None  # For water reminders

class ReminderCreate(BaseModel):
    type: str
    title: str
    time: str
    days: List[str] = []
    enabled: bool = True
    interval_hours: Optional[int] = None

@api_router.get("/reminders")
async def get_reminders(user: User = Depends(get_current_user)):
    """Get all user reminders."""
    reminders = await db.reminders.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(100)
    
    return reminders

@api_router.post("/reminders")
async def create_reminder(reminder: ReminderCreate, user: User = Depends(get_current_user)):
    """Create a new reminder."""
    reminder_doc = {
        "reminder_id": f"rem_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        "type": reminder.type,
        "title": reminder.title,
        "time": reminder.time,
        "days": reminder.days,
        "enabled": reminder.enabled,
        "interval_hours": reminder.interval_hours,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.reminders.insert_one(reminder_doc)
    del reminder_doc["_id"]
    
    return reminder_doc

@api_router.put("/reminders/{reminder_id}")
async def update_reminder(reminder_id: str, reminder: ReminderCreate, user: User = Depends(get_current_user)):
    """Update a reminder."""
    result = await db.reminders.find_one_and_update(
        {"reminder_id": reminder_id, "user_id": user.user_id},
        {"$set": {
            "type": reminder.type,
            "title": reminder.title,
            "time": reminder.time,
            "days": reminder.days,
            "enabled": reminder.enabled,
            "interval_hours": reminder.interval_hours,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }},
        return_document=True,
        projection={"_id": 0}
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    return result

@api_router.delete("/reminders/{reminder_id}")
async def delete_reminder(reminder_id: str, user: User = Depends(get_current_user)):
    """Delete a reminder."""
    result = await db.reminders.delete_one(
        {"reminder_id": reminder_id, "user_id": user.user_id}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    return {"message": "Reminder deleted"}

@api_router.patch("/reminders/{reminder_id}/toggle")
async def toggle_reminder(reminder_id: str, user: User = Depends(get_current_user)):
    """Toggle reminder enabled state."""
    reminder = await db.reminders.find_one(
        {"reminder_id": reminder_id, "user_id": user.user_id}
    )
    
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    new_state = not reminder.get("enabled", True)
    
    result = await db.reminders.find_one_and_update(
        {"reminder_id": reminder_id, "user_id": user.user_id},
        {"$set": {"enabled": new_state}},
        return_document=True,
        projection={"_id": 0}
    )
    
    return result

# ============== HISTORY DELETION ==============

@api_router.delete("/history/workouts/{workout_id}")
async def delete_workout_history(workout_id: str, user: User = Depends(get_current_user)):
    """Delete a specific workout."""
    result = await db.workouts.delete_one(
        {"workout_id": workout_id, "user_id": user.user_id}
    )
    # Also delete associated logs
    await db.workout_logs.delete_many(
        {"workout_id": workout_id, "user_id": user.user_id}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    return {"message": "Workout deleted"}

@api_router.delete("/history/meals/{meal_id}")
async def delete_meal_history(meal_id: str, user: User = Depends(get_current_user)):
    """Delete a specific meal."""
    result = await db.meals.delete_one(
        {"meal_id": meal_id, "user_id": user.user_id}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    return {"message": "Meal deleted"}

@api_router.delete("/history/steps/{date}")
async def delete_steps(date: str, user: User = Depends(get_current_user)):
    """Delete steps for a specific date."""
    result = await db.steps.delete_one(
        {"user_id": user.user_id, "date": date}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Steps entry not found")
    
    return {"message": "Steps entry deleted"}

@api_router.delete("/history/hydration/{date}")
async def delete_hydration(date: str, user: User = Depends(get_current_user)):
    """Delete hydration for a specific date."""
    result = await db.hydration.delete_one(
        {"user_id": user.user_id, "date": date}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hydration entry not found")
    
    return {"message": "Hydration entry deleted"}

@api_router.delete("/history/all")
async def delete_all_history(type: str, user: User = Depends(get_current_user)):
    """Delete all history of a specific type."""
    if type == "workouts":
        await db.workouts.delete_many({"user_id": user.user_id})
        await db.workout_logs.delete_many({"user_id": user.user_id})
    elif type == "meals":
        await db.meals.delete_many({"user_id": user.user_id})
    elif type == "steps":
        await db.steps.delete_many({"user_id": user.user_id})
    elif type == "hydration":
        await db.hydration.delete_many({"user_id": user.user_id})
    elif type == "all":
        await db.workouts.delete_many({"user_id": user.user_id})
        await db.workout_logs.delete_many({"user_id": user.user_id})
        await db.meals.delete_many({"user_id": user.user_id})
        await db.steps.delete_many({"user_id": user.user_id})
        await db.hydration.delete_many({"user_id": user.user_id})
    else:
        raise HTTPException(status_code=400, detail="Invalid history type")
    
    return {"message": f"All {type} history deleted"}

# ============== CHALLENGES SYSTEM ==============

class ChallengeCreate(BaseModel):
    template_id: str
    type: str
    name: str
    description: str
    target: int
    xp_reward: int
    metric: str

@api_router.get("/challenges")
async def get_challenges(user: User = Depends(get_current_user)):
    """Get user's active and completed challenges."""
    # Get current week range
    now = datetime.now(timezone.utc)
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Get all challenges for this week
    active = await db.challenges.find(
        {
            "user_id": user.user_id,
            "status": "active",
            "week_start": {"$gte": start_of_week.isoformat()}
        },
        {"_id": 0}
    ).to_list(50)
    
    completed = await db.challenges.find(
        {
            "user_id": user.user_id,
            "status": "completed",
            "week_start": {"$gte": start_of_week.isoformat()}
        },
        {"_id": 0}
    ).to_list(50)
    
    return {"active": active, "completed": completed}

@api_router.get("/challenges/stats")
async def get_challenge_stats(user: User = Depends(get_current_user)):
    """Get challenge statistics."""
    total_completed = await db.challenges.count_documents({
        "user_id": user.user_id,
        "status": "completed"
    })
    
    # Calculate total XP earned from challenges
    pipeline = [
        {"$match": {"user_id": user.user_id, "status": "completed", "claimed": True}},
        {"$group": {"_id": None, "total": {"$sum": "$xp_reward"}}}
    ]
    result = await db.challenges.aggregate(pipeline).to_list(1)
    total_xp = result[0]["total"] if result else 0
    
    # Get user's current streak
    user_data = await db.users.find_one({"user_id": user.user_id}, {"_id": 0, "streak": 1})
    current_streak = user_data.get("streak", 0) if user_data else 0
    
    return {
        "total_completed": total_completed,
        "total_xp_earned": total_xp,
        "current_streak": current_streak
    }

@api_router.post("/challenges/start")
async def start_challenge(challenge: ChallengeCreate, user: User = Depends(get_current_user)):
    """Start a new challenge."""
    now = datetime.now(timezone.utc)
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Check if already active
    existing = await db.challenges.find_one({
        "user_id": user.user_id,
        "template_id": challenge.template_id,
        "week_start": {"$gte": start_of_week.isoformat()},
        "status": {"$in": ["active", "completed"]}
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Challenge already active or completed this week")
    
    challenge_doc = {
        "challenge_id": f"chal_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        "template_id": challenge.template_id,
        "type": challenge.type,
        "name": challenge.name,
        "description": challenge.description,
        "target": challenge.target,
        "progress": 0,
        "xp_reward": challenge.xp_reward,
        "metric": challenge.metric,
        "status": "active",
        "claimed": False,
        "week_start": start_of_week.isoformat(),
        "started_at": now.isoformat()
    }
    
    await db.challenges.insert_one(challenge_doc)
    del challenge_doc["_id"]
    
    return challenge_doc

@api_router.post("/challenges/{challenge_id}/claim")
async def claim_challenge_reward(challenge_id: str, user: User = Depends(get_current_user)):
    """Claim XP reward for completed challenge."""
    challenge = await db.challenges.find_one({
        "challenge_id": challenge_id,
        "user_id": user.user_id
    })
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    if challenge.get("claimed"):
        raise HTTPException(status_code=400, detail="Already claimed")
    
    if challenge["progress"] < challenge["target"]:
        raise HTTPException(status_code=400, detail="Challenge not completed")
    
    # Mark as claimed and add XP
    await db.challenges.update_one(
        {"challenge_id": challenge_id},
        {"$set": {"claimed": True, "status": "completed"}}
    )
    
    # Add XP to user
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$inc": {"xp": challenge["xp_reward"]}}
    )
    
    return {"message": "Reward claimed", "xp_earned": challenge["xp_reward"]}

@api_router.put("/challenges/{challenge_id}/progress")
async def update_challenge_progress(challenge_id: str, progress: int, user: User = Depends(get_current_user)):
    """Update challenge progress."""
    result = await db.challenges.find_one_and_update(
        {"challenge_id": challenge_id, "user_id": user.user_id},
        {"$set": {"progress": progress}},
        return_document=True,
        projection={"_id": 0}
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Check if completed
    if result["progress"] >= result["target"] and result["status"] == "active":
        await db.challenges.update_one(
            {"challenge_id": challenge_id},
            {"$set": {"status": "completed", "completed_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    return result

# ============== NUTRITION SCORE SYSTEM ==============

NUTRITION_BADGES = [
    # ═══════════════════════════════════════
    # CATÉGORIE 1 — RÉGULARITÉ (streaks suivi)
    # ═══════════════════════════════════════
    {"id": "streak_1",   "name": "Première Journée",     "description": "1 jour de suivi nutritionnel",      "threshold": 1,   "xp": 25,   "icon": "🌱", "color": "#B0E301", "type": "days_tracked"},
    {"id": "streak_3",   "name": "3 Jours Consécutifs",  "description": "3 jours de suivi consécutifs",      "threshold": 3,   "xp": 50,   "icon": "🔥", "color": "#B0E301", "type": "days_tracked"},
    {"id": "streak_7",   "name": "Semaine Parfaite",      "description": "7 jours de suivi consécutifs",      "threshold": 7,   "xp": 150,  "icon": "⚡", "color": "#B0E301", "type": "days_tracked"},
    {"id": "streak_14",  "name": "Deux Semaines",         "description": "14 jours de suivi consécutifs",     "threshold": 14,  "xp": 300,  "icon": "💪", "color": "#B0E301", "type": "days_tracked"},
    {"id": "streak_21",  "name": "Trois Semaines",        "description": "21 jours de suivi consécutifs",     "threshold": 21,  "xp": 450,  "icon": "🎯", "color": "#B0E301", "type": "days_tracked"},
    {"id": "streak_30",  "name": "Un Mois Complet",       "description": "30 jours de suivi consécutifs",     "threshold": 30,  "xp": 750,  "icon": "🏅", "color": "#B0E301", "type": "days_tracked"},
    {"id": "streak_60",  "name": "Deux Mois",             "description": "60 jours de suivi consécutifs",     "threshold": 60,  "xp": 1500, "icon": "🥈", "color": "#B0E301", "type": "days_tracked"},
    {"id": "streak_90",  "name": "Trois Mois",            "description": "90 jours de suivi consécutifs",     "threshold": 90,  "xp": 2500, "icon": "🥇", "color": "#B0E301", "type": "days_tracked"},
    {"id": "streak_180", "name": "Six Mois",              "description": "180 jours de suivi consécutifs",    "threshold": 180, "xp": 5000, "icon": "👑", "color": "#FFD700", "type": "days_tracked"},
    {"id": "streak_365", "name": "Une Année Entière",     "description": "365 jours de suivi consécutifs",    "threshold": 365, "xp": 10000,"icon": "🌟", "color": "#FFD700", "type": "days_tracked"},

    # ═══════════════════════════════════════
    # CATÉGORIE 2 — CALORIES (objectif atteint)
    # ═══════════════════════════════════════
    {"id": "cal_1",   "name": "Premier Objectif Cal.",    "description": "Objectif calorique atteint 1×",     "threshold": 1,   "xp": 30,   "icon": "🔥", "color": "#FF6B35", "type": "days_calorie_target"},
    {"id": "cal_3",   "name": "3× Objectif Calories",    "description": "Objectif calorique atteint 3×",     "threshold": 3,   "xp": 75,   "icon": "🔥", "color": "#FF6B35", "type": "days_calorie_target"},
    {"id": "cal_5",   "name": "5× Objectif Calories",    "description": "Objectif calorique atteint 5×",     "threshold": 5,   "xp": 120,  "icon": "🔥", "color": "#FF6B35", "type": "days_calorie_target"},
    {"id": "cal_10",  "name": "10× Objectif Calories",   "description": "Objectif calorique atteint 10×",    "threshold": 10,  "xp": 250,  "icon": "🔥", "color": "#FF6B35", "type": "days_calorie_target"},
    {"id": "cal_20",  "name": "20× Objectif Calories",   "description": "Objectif calorique atteint 20×",    "threshold": 20,  "xp": 500,  "icon": "🔥", "color": "#FF6B35", "type": "days_calorie_target"},
    {"id": "cal_30",  "name": "Maître des Calories",      "description": "Objectif calorique atteint 30×",    "threshold": 30,  "xp": 750,  "icon": "🔥", "color": "#FF6B35", "type": "days_calorie_target"},
    {"id": "cal_50",  "name": "50× Objectif Calories",   "description": "Objectif calorique atteint 50×",    "threshold": 50,  "xp": 1200, "icon": "🔥", "color": "#FF6B35", "type": "days_calorie_target"},
    {"id": "cal_75",  "name": "75× Objectif Calories",   "description": "Objectif calorique atteint 75×",    "threshold": 75,  "xp": 1800, "icon": "🔥", "color": "#FF6B35", "type": "days_calorie_target"},
    {"id": "cal_100", "name": "Centurion Calorique",      "description": "Objectif calorique atteint 100×",   "threshold": 100, "xp": 3000, "icon": "💯", "color": "#FFD700", "type": "days_calorie_target"},
    {"id": "cal_200", "name": "Légende Calorique",        "description": "Objectif calorique atteint 200×",   "threshold": 200, "xp": 6000, "icon": "🌟", "color": "#FFD700", "type": "days_calorie_target"},

    # ═══════════════════════════════════════
    # CATÉGORIE 3 — PROTÉINES (objectif atteint)
    # ═══════════════════════════════════════
    {"id": "prot_1",   "name": "Première Protéine",       "description": "Objectif protéines atteint 1×",     "threshold": 1,   "xp": 30,   "icon": "💪", "color": "#B0E301", "type": "days_protein_target"},
    {"id": "prot_3",   "name": "3× Objectif Protéines",  "description": "Objectif protéines atteint 3×",     "threshold": 3,   "xp": 80,   "icon": "💪", "color": "#B0E301", "type": "days_protein_target"},
    {"id": "prot_5",   "name": "5× Objectif Protéines",  "description": "Objectif protéines atteint 5×",     "threshold": 5,   "xp": 130,  "icon": "💪", "color": "#B0E301", "type": "days_protein_target"},
    {"id": "prot_7",   "name": "Roi des Protéines",       "description": "Objectif protéines atteint 7×",     "threshold": 7,   "xp": 200,  "icon": "💪", "color": "#B0E301", "type": "days_protein_target"},
    {"id": "prot_14",  "name": "Champion Protéine",       "description": "Objectif protéines atteint 14×",    "threshold": 14,  "xp": 400,  "icon": "💪", "color": "#B0E301", "type": "days_protein_target"},
    {"id": "prot_21",  "name": "Maître des Acides Am.",   "description": "Objectif protéines atteint 21×",    "threshold": 21,  "xp": 600,  "icon": "💪", "color": "#B0E301", "type": "days_protein_target"},
    {"id": "prot_30",  "name": "30× Objectif Protéines", "description": "Objectif protéines atteint 30×",    "threshold": 30,  "xp": 900,  "icon": "🏋️", "color": "#B0E301", "type": "days_protein_target"},
    {"id": "prot_50",  "name": "50× Objectif Protéines", "description": "Objectif protéines atteint 50×",    "threshold": 50,  "xp": 1500, "icon": "🏋️", "color": "#B0E301", "type": "days_protein_target"},
    {"id": "prot_75",  "name": "75× Objectif Protéines", "description": "Objectif protéines atteint 75×",    "threshold": 75,  "xp": 2200, "icon": "🏋️", "color": "#B0E301", "type": "days_protein_target"},
    {"id": "prot_100", "name": "Centurion Protéines",     "description": "Objectif protéines atteint 100×",   "threshold": 100, "xp": 4000, "icon": "🥩", "color": "#FFD700", "type": "days_protein_target"},

    # ═══════════════════════════════════════
    # CATÉGORIE 4 — REPAS GÉNÉRÉS / LOGGÉS
    # ═══════════════════════════════════════
    {"id": "meal_1",   "name": "Premier Repas",           "description": "1 repas enregistré",                "threshold": 1,   "xp": 20,   "icon": "🍽️", "color": "#6441a5", "type": "total_meals"},
    {"id": "meal_5",   "name": "5 Repas",                 "description": "5 repas enregistrés",               "threshold": 5,   "xp": 50,   "icon": "🍽️", "color": "#6441a5", "type": "total_meals"},
    {"id": "meal_10",  "name": "10 Repas",                "description": "10 repas enregistrés",              "threshold": 10,  "xp": 100,  "icon": "🍽️", "color": "#6441a5", "type": "total_meals"},
    {"id": "meal_25",  "name": "25 Repas",                "description": "25 repas enregistrés",              "threshold": 25,  "xp": 200,  "icon": "🍽️", "color": "#6441a5", "type": "total_meals"},
    {"id": "meal_50",  "name": "50 Repas",                "description": "50 repas enregistrés",              "threshold": 50,  "xp": 400,  "icon": "🍽️", "color": "#6441a5", "type": "total_meals"},
    {"id": "meal_100", "name": "100 Repas",               "description": "100 repas enregistrés",             "threshold": 100, "xp": 800,  "icon": "🍽️", "color": "#6441a5", "type": "total_meals"},
    {"id": "meal_200", "name": "200 Repas",               "description": "200 repas enregistrés",             "threshold": 200, "xp": 1600, "icon": "👨‍🍳", "color": "#6441a5", "type": "total_meals"},
    {"id": "meal_365", "name": "365 Repas",               "description": "365 repas enregistrés",             "threshold": 365, "xp": 3000, "icon": "👨‍🍳", "color": "#6441a5", "type": "total_meals"},
    {"id": "meal_500", "name": "Gourmet 500",             "description": "500 repas enregistrés",             "threshold": 500, "xp": 5000, "icon": "⭐", "color": "#FFD700", "type": "total_meals"},
    {"id": "meal_1000","name": "Chef Légendaire",         "description": "1000 repas enregistrés",             "threshold": 1000,"xp": 10000,"icon": "👑", "color": "#FFD700", "type": "total_meals"},

    # ═══════════════════════════════════════
    # CATÉGORIE 5 — DIVERSITÉ & QUALITÉ
    # ═══════════════════════════════════════
    {"id": "first_balanced",  "name": "Premier Équilibre",   "description": "1er repas parfaitement équilibré",  "threshold": 1,  "xp": 50,   "icon": "🥗", "color": "#00BFFF", "type": "days_balanced"},
    {"id": "balanced_3",      "name": "3 Jours Équilibrés",  "description": "3 jours d'alimentation équilibrée", "threshold": 3,  "xp": 100,  "icon": "🥗", "color": "#00BFFF", "type": "days_balanced"},
    {"id": "balanced_5",      "name": "5 Jours Équilibrés",  "description": "5 jours d'alimentation équilibrée", "threshold": 5,  "xp": 200,  "icon": "🥗", "color": "#00BFFF", "type": "days_balanced"},
    {"id": "balanced_7",      "name": "Semaine Équilibrée",  "description": "7 jours d'alimentation équilibrée", "threshold": 7,  "xp": 350,  "icon": "⚖️", "color": "#00BFFF", "type": "days_balanced"},
    {"id": "balanced_10",     "name": "Équilibriste",        "description": "10 jours d'alimentation équilibrée","threshold": 10, "xp": 500,  "icon": "⚖️", "color": "#00BFFF", "type": "days_balanced"},
    {"id": "balanced_14",     "name": "14 Jours Équilibrés", "description": "14 jours d'alimentation équilibrée","threshold": 14, "xp": 700,  "icon": "⚖️", "color": "#00BFFF", "type": "days_balanced"},
    {"id": "balanced_21",     "name": "3 Semaines Parfaites","description": "21 jours d'alimentation équilibrée","threshold": 21, "xp": 1000, "icon": "🎯", "color": "#00BFFF", "type": "days_balanced"},
    {"id": "balanced_30",     "name": "Mois Parfait",        "description": "30 jours d'alimentation équilibrée","threshold": 30, "xp": 2000, "icon": "🏅", "color": "#00BFFF", "type": "days_balanced"},
    {"id": "balanced_60",     "name": "2 Mois Parfaits",     "description": "60 jours d'alimentation équilibrée","threshold": 60, "xp": 4000, "icon": "🥈", "color": "#00BFFF", "type": "days_balanced"},
    {"id": "balanced_90",     "name": "Nutrition Champion",  "description": "90 jours d'alimentation équilibrée","threshold": 90, "xp": 7500, "icon": "🏆", "color": "#FFD700", "type": "days_balanced"},

    # ═══════════════════════════════════════
    # CATÉGORIE 6 — REPAS IA GÉNÉRÉS
    # ═══════════════════════════════════════
    {"id": "ai_1",    "name": "Premier Repas IA",          "description": "1 repas généré par l'IA",           "threshold": 1,   "xp": 25,   "icon": "🤖", "color": "#a855f7", "type": "ai_meals"},
    {"id": "ai_5",    "name": "5 Repas IA",                "description": "5 repas générés par l'IA",          "threshold": 5,   "xp": 60,   "icon": "🤖", "color": "#a855f7", "type": "ai_meals"},
    {"id": "ai_10",   "name": "10 Repas IA",               "description": "10 repas générés par l'IA",         "threshold": 10,  "xp": 120,  "icon": "🤖", "color": "#a855f7", "type": "ai_meals"},
    {"id": "ai_25",   "name": "25 Repas IA",               "description": "25 repas générés par l'IA",         "threshold": 25,  "xp": 300,  "icon": "🤖", "color": "#a855f7", "type": "ai_meals"},
    {"id": "ai_50",   "name": "Ami de l'IA",               "description": "50 repas générés par l'IA",         "threshold": 50,  "xp": 600,  "icon": "🤖", "color": "#a855f7", "type": "ai_meals"},
    {"id": "ai_100",  "name": "100 Repas IA",              "description": "100 repas générés par l'IA",        "threshold": 100, "xp": 1200, "icon": "⚡", "color": "#a855f7", "type": "ai_meals"},
    {"id": "ai_200",  "name": "200 Repas IA",              "description": "200 repas générés par l'IA",        "threshold": 200, "xp": 2500, "icon": "⚡", "color": "#a855f7", "type": "ai_meals"},
    {"id": "ai_500",  "name": "Maître de l'IA",            "description": "500 repas générés par l'IA",        "threshold": 500, "xp": 6000, "icon": "🌟", "color": "#FFD700", "type": "ai_meals"},

    # ═══════════════════════════════════════
    # CATÉGORIE 7 — SCORE NUTRITIONNEL
    # ═══════════════════════════════════════
    {"id": "score_50_1",  "name": "Score 50+ (1j)",        "description": "Score nutri > 50% pendant 1 jour",  "threshold": 1,   "xp": 20,   "icon": "📊", "color": "#38bdf8", "type": "score_days_50"},
    {"id": "score_50_7",  "name": "Score 50+ (7j)",        "description": "Score nutri > 50% pendant 7 jours", "threshold": 7,   "xp": 100,  "icon": "📊", "color": "#38bdf8", "type": "score_days_50"},
    {"id": "score_50_30", "name": "Score 50+ (30j)",       "description": "Score nutri > 50% pendant 30 jours","threshold": 30,  "xp": 500,  "icon": "📊", "color": "#38bdf8", "type": "score_days_50"},
    {"id": "score_70_1",  "name": "Score 70+ (1j)",        "description": "Score nutri > 70% pendant 1 jour",  "threshold": 1,   "xp": 50,   "icon": "📈", "color": "#38bdf8", "type": "score_days_70"},
    {"id": "score_70_7",  "name": "Score 70+ (7j)",        "description": "Score nutri > 70% pendant 7 jours", "threshold": 7,   "xp": 200,  "icon": "📈", "color": "#38bdf8", "type": "score_days_70"},
    {"id": "score_70_30", "name": "Score 70+ (30j)",       "description": "Score nutri > 70% pendant 30 jours","threshold": 30,  "xp": 800,  "icon": "📈", "color": "#38bdf8", "type": "score_days_70"},
    {"id": "score_80_1",  "name": "Score 80+ (1j)",        "description": "Score nutri > 80% pendant 1 jour",  "threshold": 1,   "xp": 75,   "icon": "🎯", "color": "#38bdf8", "type": "score_days_80"},
    {"id": "score_80_7",  "name": "Score 80+ (7j)",        "description": "Score nutri > 80% pendant 7 jours", "threshold": 7,   "xp": 300,  "icon": "🎯", "color": "#38bdf8", "type": "score_days_80"},
    {"id": "score_80_14", "name": "Score 80+ (14j)",       "description": "Score nutri > 80% pendant 14 jours","threshold": 14,  "xp": 600,  "icon": "🎯", "color": "#38bdf8", "type": "score_days_80"},
    {"id": "score_80_30", "name": "Nutrition Champion",    "description": "Score nutri > 80% pendant 30 jours","threshold": 30,  "xp": 1000, "icon": "🏆", "color": "#00BFFF", "type": "score_days_80"},

    # ═══════════════════════════════════════
    # CATÉGORIE 8 — MACROS SPÉCIFIQUES
    # ═══════════════════════════════════════
    {"id": "prot_daily_150", "name": "150g de Protéines",  "description": "Dépasser 150g de protéines en 1j",  "threshold": 5,   "xp": 150,  "icon": "🥩", "color": "#B0E301", "type": "high_protein_days"},
    {"id": "prot_daily_200", "name": "200g de Protéines",  "description": "Dépasser 200g de protéines en 1j",  "threshold": 3,   "xp": 250,  "icon": "🥩", "color": "#B0E301", "type": "very_high_protein_days"},
    {"id": "low_cal_day",    "name": "Journée Légère",     "description": "Moins de 1500 kcal en 1 jour",      "threshold": 5,   "xp": 100,  "icon": "🥬", "color": "#38bdf8", "type": "low_calorie_days"},
    {"id": "keto_day",       "name": "Jour Cétogène",      "description": "Moins de 50g de glucides en 1j",    "threshold": 3,   "xp": 200,  "icon": "🥑", "color": "#FF6B35", "type": "low_carb_days"},
    {"id": "fiber_hero",     "name": "Héros des Fibres",   "description": "Repas très riches en légumes",      "threshold": 10,  "xp": 200,  "icon": "🥦", "color": "#B0E301", "type": "days_balanced"},
    {"id": "hydra_nut",      "name": "Nutrition Complète", "description": "3 macros en objectif le même jour", "threshold": 10,  "xp": 400,  "icon": "💧", "color": "#00BFFF", "type": "days_balanced"},

    # ═══════════════════════════════════════
    # CATÉGORIE 9 — SPÉCIAUX & RÉCOMPENSES
    # ═══════════════════════════════════════
    {"id": "first_like",     "name": "Premier J'aime",     "description": "Premier repas aimé",                "threshold": 1,  "xp": 20,   "icon": "👍", "color": "#B0E301", "type": "liked_meals"},
    {"id": "likes_10",       "name": "10 Repas Aimés",     "description": "10 repas ajoutés aux favoris",      "threshold": 10, "xp": 100,  "icon": "❤️", "color": "#ff4b6e", "type": "liked_meals"},
    {"id": "likes_25",       "name": "Gourmet Affirmé",    "description": "25 repas aimés",                    "threshold": 25, "xp": 250,  "icon": "❤️", "color": "#ff4b6e", "type": "liked_meals"},
    {"id": "likes_50",       "name": "Collection de Goûts","description": "50 repas aimés",                    "threshold": 50, "xp": 500,  "icon": "❤️", "color": "#ff4b6e", "type": "liked_meals"},
    {"id": "first_dislike",  "name": "Sélectif",           "description": "Premier repas refusé",              "threshold": 1,  "xp": 20,   "icon": "🚫", "color": "#52525B", "type": "disliked_meals"},
    {"id": "plan_builder_1", "name": "Mon Premier Plan",   "description": "1 plan manuel créé depuis Favoris", "threshold": 1,  "xp": 50,   "icon": "📋", "color": "#6441a5", "type": "manual_plans"},
    {"id": "plan_builder_5", "name": "5 Plans Manuels",    "description": "5 plans manuels créés",             "threshold": 5,  "xp": 200,  "icon": "📋", "color": "#6441a5", "type": "manual_plans"},
    {"id": "plan_week",      "name": "Semaine Planifiée",  "description": "Plan complet 4 repas 7 jours",      "threshold": 7,  "xp": 500,  "icon": "📅", "color": "#6441a5", "type": "manual_plans"},
    {"id": "calorie_deficit_5",  "name": "5 Jours en Déficit",  "description": "5 jours consécutifs en déficit calorique",  "threshold": 5,  "xp": 200, "icon": "📉", "color": "#FF6B35", "type": "deficit_days"},
    {"id": "calorie_deficit_14", "name": "14 Jours en Déficit", "description": "14 jours consécutifs en déficit calorique", "threshold": 14, "xp": 600, "icon": "📉", "color": "#FF6B35", "type": "deficit_days"},
    {"id": "calorie_deficit_30", "name": "30 Jours en Déficit", "description": "30 jours consécutifs en déficit calorique", "threshold": 30, "xp": 1500,"icon": "📉", "color": "#FF6B35", "type": "deficit_days"},
]


@api_router.get("/nutrition/score")
async def get_nutrition_score(user: User = Depends(get_current_user)):
    """Get user's nutrition score and badges."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%d")
    
    # Get user's nutrition targets
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    daily_calories = user_doc.get("daily_calories", 2000)
    target_protein = user_doc.get("target_protein", 120)
    
    # Get meals for today
    today_meals = await db.meals.find({
        "user_id": user.user_id,
        "date": today
    }, {"_id": 0}).to_list(20)
    
    today_calories = sum(m.get("calories", 0) for m in today_meals)
    today_protein = sum(m.get("protein", 0) for m in today_meals)
    today_carbs = sum(m.get("carbs", 0) for m in today_meals)
    today_fat = sum(m.get("fat", 0) for m in today_meals)
    
    # Calculate today's score (0-100)
    calorie_score = 100 - min(abs(today_calories - daily_calories) / daily_calories * 100, 100)
    protein_score = min((today_protein / target_protein) * 100, 100) if target_protein > 0 else 0
    
    # Balance score (ideal ratio: 40% carbs, 30% protein, 30% fat by calories)
    total_macro_calories = (today_protein * 4) + (today_carbs * 4) + (today_fat * 9)
    if total_macro_calories > 0:
        actual_protein_pct = (today_protein * 4) / total_macro_calories * 100
        actual_carbs_pct = (today_carbs * 4) / total_macro_calories * 100
        actual_fat_pct = (today_fat * 9) / total_macro_calories * 100
        
        balance_score = 100 - (
            abs(actual_protein_pct - 30) + 
            abs(actual_carbs_pct - 40) + 
            abs(actual_fat_pct - 30)
        ) / 3
        balance_score = max(0, balance_score)
    else:
        balance_score = 0
        actual_protein_pct = 0
        actual_carbs_pct = 0
        actual_fat_pct = 0
    
    # Overall daily score
    daily_score = int((calorie_score * 0.4 + protein_score * 0.3 + balance_score * 0.3))
    
    # Get stats over last 90 days for comprehensive badge tracking
    days_90_ago = (datetime.now(timezone.utc) - timedelta(days=90)).strftime("%Y-%m-%d")
    all_user_meals = await db.meals.find(
        {"user_id": user.user_id, "date": {"$gte": days_90_ago}},
        {"_id": 0, "date": 1, "calories": 1, "protein": 1, "carbs": 1, "ai_generated": 1, "liked": 1}
    ).to_list(5000)

    # Also get week meals for display
    week_meals = [m for m in all_user_meals if m.get("date", "") >= week_ago]

    # Group by date (90 day window)
    daily_stats = {}
    for meal in all_user_meals:
        date = meal.get("date")
        if date not in daily_stats:
            daily_stats[date] = {"calories": 0, "protein": 0, "carbs": 0}
        daily_stats[date]["calories"] += meal.get("calories", 0)
        daily_stats[date]["protein"] += meal.get("protein", 0)
        daily_stats[date]["carbs"] += meal.get("carbs", 0)

    # Week stats for display
    week_daily_stats = {d: s for d, s in daily_stats.items() if d >= week_ago}

    # Count badge metrics across all 90 days
    days_calorie_target = 0
    days_protein_target = 0
    days_balanced = 0
    days_tracked = len(daily_stats)
    score_days_50 = 0
    score_days_70 = 0
    score_days_80 = 0
    high_protein_days = 0
    very_high_protein_days = 0
    low_calorie_days = 0
    low_carb_days = 0
    deficit_days = 0

    for date, stats in daily_stats.items():
        cal = stats["calories"]; prot = stats["protein"]; carbs = stats["carbs"]
        cal_diff_pct = abs(cal - daily_calories) / max(daily_calories, 1) * 100
        cal_score_d = 100 - min(cal_diff_pct, 100)
        prot_score_d = min((prot / max(target_protein, 1)) * 100, 100)
        day_score = (cal_score_d * 0.5 + prot_score_d * 0.5)
        if cal_diff_pct <= 15: days_calorie_target += 1
        if prot >= target_protein * 0.9: days_protein_target += 1
        if cal_diff_pct <= 15 and prot >= target_protein * 0.9: days_balanced += 1
        if day_score >= 50: score_days_50 += 1
        if day_score >= 70: score_days_70 += 1
        if day_score >= 80: score_days_80 += 1
        if prot >= 150: high_protein_days += 1
        if prot >= 200: very_high_protein_days += 1
        if cal < 1500 and cal > 0: low_calorie_days += 1
        if carbs < 50 and cal > 0: low_carb_days += 1
        if cal > 0 and cal < daily_calories * 0.9: deficit_days += 1

    # Count total meals and AI meals
    all_meals = await db.meals.count_documents({"user_id": user.user_id})
    ai_meals_count = await db.meals.count_documents({"user_id": user.user_id, "ai_generated": True})
    liked_meals_count = await db.meals.count_documents({"user_id": user.user_id, "liked": True})
    disliked_count = len(user_doc.get("disliked_meals", []))
    manual_plans_count = user_doc.get("manual_plans_count", 0)

    badge_progress_map = {
        "days_tracked": days_tracked,
        "days_calorie_target": days_calorie_target,
        "days_protein_target": days_protein_target,
        "days_balanced": days_balanced,
        "total_meals": all_meals,
        "ai_meals": ai_meals_count,
        "liked_meals": liked_meals_count,
        "disliked_meals": disliked_count,
        "score_days_50": score_days_50,
        "score_days_70": score_days_70,
        "score_days_80": score_days_80,
        "high_protein_days": high_protein_days,
        "very_high_protein_days": very_high_protein_days,
        "low_calorie_days": low_calorie_days,
        "low_carb_days": low_carb_days,
        "deficit_days": deficit_days,
        "manual_plans": manual_plans_count,
    }

    # Calculate badges
    user_badges = user_doc.get("nutrition_badges_claimed", [])
    badges_status = []

    for badge in NUTRITION_BADGES:
        badge_type = badge.get("type", "days_balanced")
        progress = badge_progress_map.get(badge_type, 0)
        
        is_unlocked = progress >= badge["threshold"]
        is_claimed = badge["id"] in user_badges
        can_claim = is_unlocked and not is_claimed
        
        badges_status.append({
            **badge,
            "progress": progress,
            "is_unlocked": is_unlocked,
            "is_claimed": is_claimed,
            "can_claim": can_claim
        })
    
    # Calculate weekly average score
    if daily_stats:
        week_scores = []
        for date, stats in daily_stats.items():
            cal_score = 100 - min(abs(stats["calories"] - daily_calories) / daily_calories * 100, 100)
            prot_score = min((stats["protein"] / target_protein) * 100, 100) if target_protein > 0 else 0
            week_scores.append((cal_score + prot_score) / 2)
        weekly_avg_score = int(sum(week_scores) / len(week_scores))
    else:
        weekly_avg_score = 0
    
    return {
        "daily_score": daily_score,
        "weekly_avg_score": weekly_avg_score,
        "today": {
            "calories": today_calories,
            "protein": today_protein,
            "carbs": today_carbs,
            "fat": today_fat,
            "meals_count": len(today_meals),
            "calorie_target": daily_calories,
            "protein_target": target_protein,
            "calorie_progress": min(int((today_calories / daily_calories) * 100), 150) if daily_calories > 0 else 0,
            "protein_progress": min(int((today_protein / target_protein) * 100), 150) if target_protein > 0 else 0,
            "macro_distribution": {
                "protein_pct": round(actual_protein_pct, 1),
                "carbs_pct": round(actual_carbs_pct, 1),
                "fat_pct": round(actual_fat_pct, 1)
            }
        },
        "week_stats": {
            "days_tracked": len(daily_stats),
            "days_calorie_target": days_calorie_target,
            "days_protein_target": days_protein_target,
            "days_balanced": days_balanced
        },
        "total_meals": all_meals,
        "badges": badges_status
    }

@api_router.post("/nutrition/claim-badge/{badge_id}")
async def claim_nutrition_badge(badge_id: str, user: User = Depends(get_current_user)):
    """Claim a nutrition badge reward."""
    # Find the badge
    badge = next((b for b in NUTRITION_BADGES if b["id"] == badge_id), None)
    if not badge:
        raise HTTPException(status_code=400, detail="Badge invalide")
    
    # Check if already claimed
    user_doc = await db.users.find_one({"user_id": user.user_id})
    claimed_badges = user_doc.get("nutrition_badges_claimed", [])
    
    if badge_id in claimed_badges:
        raise HTTPException(status_code=400, detail="Badge déjà réclamé")
    
    # Award XP and mark as claimed
    await db.users.update_one(
        {"user_id": user.user_id},
        {
            "$inc": {"total_xp": badge["xp"]},
            "$addToSet": {"nutrition_badges_claimed": badge_id}
        }
    )
    
    return {
        "success": True,
        "xp_awarded": badge["xp"],
        "badge_id": badge_id,
        "message": f"Badge '{badge['name']}' réclamé ! +{badge['xp']} XP"
    }

# ============== SLEEP TRACKING SYSTEM ==============

class SleepEntry(BaseModel):
    date: str  # YYYY-MM-DD
    bedtime: str  # HH:MM
    wake_time: str  # HH:MM
    quality: int  # 1-5
    notes: Optional[str] = None

@api_router.get("/sleep")
async def get_sleep_entries(days: int = 7, user: User = Depends(get_current_user)):
    """Get sleep entries for the last N days."""
    cutoff_date = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
    entries = await db.sleep.find(
        {"user_id": user.user_id, "date": {"$gte": cutoff_date}},
        {"_id": 0}
    ).sort("date", -1).to_list(100)
    
    # Calculate stats
    if entries:
        total_duration = 0
        total_quality = 0
        for entry in entries:
            # Parse times and calculate duration
            try:
                bedtime = datetime.strptime(entry["bedtime"], "%H:%M")
                wake_time = datetime.strptime(entry["wake_time"], "%H:%M")
                if wake_time < bedtime:
                    wake_time += timedelta(days=1)
                duration = (wake_time - bedtime).total_seconds() / 3600
                entry["duration_hours"] = round(duration, 1)
                total_duration += duration
                total_quality += entry.get("quality", 3)
            except Exception:
                entry["duration_hours"] = 0
        
        avg_duration = round(total_duration / len(entries), 1)
        avg_quality = round(total_quality / len(entries), 1)
    else:
        avg_duration = 0
        avg_quality = 0
    
    return {
        "entries": entries,
        "stats": {
            "avg_duration": avg_duration,
            "avg_quality": avg_quality,
            "total_entries": len(entries),
            "target_hours": 8
        }
    }

@api_router.post("/sleep")
async def add_sleep_entry(entry: SleepEntry, user: User = Depends(get_current_user)):
    """Add or update a sleep entry."""
    sleep_doc = {
        "user_id": user.user_id,
        "date": entry.date,
        "bedtime": entry.bedtime,
        "wake_time": entry.wake_time,
        "quality": min(max(entry.quality, 1), 5),
        "notes": entry.notes,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Upsert based on date
    await db.sleep.update_one(
        {"user_id": user.user_id, "date": entry.date},
        {"$set": sleep_doc},
        upsert=True
    )
    
    # Award XP for tracking
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$inc": {"total_xp": 5}}
    )
    
    return {**sleep_doc, "xp_awarded": 5, "message": "Sommeil enregistré ! +5 XP"}

@api_router.delete("/sleep/{date}")
async def delete_sleep_entry(date: str, user: User = Depends(get_current_user)):
    """Delete a sleep entry."""
    result = await db.sleep.delete_one({"user_id": user.user_id, "date": date})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entrée non trouvée")
    return {"message": "Entrée supprimée"}

# ============== PROGRESSION CALENDAR ==============

@api_router.get("/progression/calendar")
async def get_progression_calendar(month: int, year: int, user: User = Depends(get_current_user)):
    """Get detailed progression data for a calendar month."""
    start_date = f"{year}-{str(month).zfill(2)}-01"
    if month == 12:
        end_date = f"{year + 1}-01-01"
    else:
        end_date = f"{year}-{str(month + 1).zfill(2)}-01"
    
    # Fetch all data for the month
    workouts = await db.workouts.find({
        "user_id": user.user_id,
        "completed": True,
        "completed_at": {"$gte": start_date, "$lt": end_date}
    }, {"_id": 0, "completed_at": 1, "name": 1, "duration_minutes": 1, "xp_earned": 1}).to_list(100)
    
    meals = await db.meals.find({
        "user_id": user.user_id,
        "date": {"$gte": start_date, "$lt": end_date}
    }, {"_id": 0, "date": 1, "calories": 1, "protein": 1}).to_list(500)
    
    sleep_entries = await db.sleep.find({
        "user_id": user.user_id,
        "date": {"$gte": start_date, "$lt": end_date}
    }, {"_id": 0, "date": 1, "quality": 1, "bedtime": 1, "wake_time": 1}).to_list(50)
    
    steps_entries = await db.steps.find({
        "user_id": user.user_id,
        "date": {"$gte": start_date, "$lt": end_date}
    }, {"_id": 0, "date": 1, "steps": 1}).to_list(50)
    
    hydration_entries = await db.hydration.find({
        "user_id": user.user_id,
        "date": {"$gte": start_date, "$lt": end_date}
    }, {"_id": 0, "date": 1, "glasses": 1}).to_list(50)
    
    # Organize by day
    days_data = {}
    
    for workout in workouts:
        date = workout.get("completed_at", "")[:10]
        if date not in days_data:
            days_data[date] = {"workouts": [], "meals": [], "sleep": None, "steps": 0, "hydration": 0}
        days_data[date]["workouts"].append(workout)
    
    for meal in meals:
        date = meal.get("date")
        if date not in days_data:
            days_data[date] = {"workouts": [], "meals": [], "sleep": None, "steps": 0, "hydration": 0}
        days_data[date]["meals"].append(meal)
    
    for sleep in sleep_entries:
        date = sleep.get("date")
        if date not in days_data:
            days_data[date] = {"workouts": [], "meals": [], "sleep": None, "steps": 0, "hydration": 0}
        days_data[date]["sleep"] = sleep
    
    for step in steps_entries:
        date = step.get("date")
        if date not in days_data:
            days_data[date] = {"workouts": [], "meals": [], "sleep": None, "steps": 0, "hydration": 0}
        days_data[date]["steps"] = step.get("steps", 0)
    
    for hydro in hydration_entries:
        date = hydro.get("date")
        if date not in days_data:
            days_data[date] = {"workouts": [], "meals": [], "sleep": None, "steps": 0, "hydration": 0}
        days_data[date]["hydration"] = hydro.get("glasses", 0)
    
    # Calculate day summaries
    calendar_days = []
    for date, data in days_data.items():
        day_calories = sum(m.get("calories", 0) for m in data["meals"])
        day_protein = sum(m.get("protein", 0) for m in data["meals"])
        
        calendar_days.append({
            "date": date,
            "has_workout": len(data["workouts"]) > 0,
            "workout_count": len(data["workouts"]),
            "total_calories": day_calories,
            "total_protein": day_protein,
            "meals_count": len(data["meals"]),
            "sleep_quality": data["sleep"]["quality"] if data["sleep"] else None,
            "steps": data["steps"],
            "hydration_glasses": data["hydration"]
        })
    
    # Calculate monthly summary
    total_workouts = len(workouts)
    total_calories = sum(m.get("calories", 0) for m in meals)
    avg_sleep_quality = sum(s["quality"] for s in sleep_entries) / len(sleep_entries) if sleep_entries else 0
    
    return {
        "month": month,
        "year": year,
        "days": calendar_days,
        "summary": {
            "total_workouts": total_workouts,
            "total_calories": total_calories,
            "avg_sleep_quality": round(avg_sleep_quality, 1),
            "days_tracked": len(days_data)
        }
    }

# ============== SMART PLANNING (AI) ==============

@api_router.post("/planning/generate")
async def generate_smart_planning(
    goal: str = "general",  # general, muscle_gain, fat_loss, endurance
    days_per_week: int = 4,
    user: User = Depends(get_current_user)
):
    """Generate a personalized workout plan using AI."""
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    
    # Get user profile info
    weight = user_doc.get("weight", 70)
    height = user_doc.get("height", 170)
    fitness_level = user_doc.get("fitness_level", "intermediate")
    
    # Onboarding enrichment
    main_goal = user_doc.get("main_goal", goal)
    secondary_goals = user_doc.get("secondary_goals", [])
    habits_to_change = user_doc.get("habits_to_change", [])
    
    # Get recent workout history for context
    recent_workouts = await db.workouts.find(
        {"user_id": user.user_id, "completed": True},
        {"_id": 0, "name": 1, "exercises": 1}
    ).sort("completed_at", -1).limit(10).to_list(10)
    
    workout_history = [w.get("name", "") for w in recent_workouts]
    
    prompt = f"""Génère un plan d'entraînement hebdomadaire de {days_per_week} jours en français pour quelqu'un avec ces caractéristiques :
- Poids: {weight}kg, Taille: {height}cm
- Niveau: {fitness_level}
- Objectif principal: {main_goal}
- Objectifs secondaires: {', '.join(secondary_goals) if secondary_goals else 'Aucun'}
- Habitudes à changer: {', '.join(habits_to_change) if habits_to_change else 'Aucune'}
- Historique récent: {', '.join(workout_history[:5]) if workout_history else 'Aucun'}
 
Prends en compte les objectifs secondaires pour adapter l'intensité et le type d'exercices (ex: yoga/étirements si 'gérer le stress', plus de renforcement si 'tonification').

Return ONLY a valid JSON object with this exact structure:
{{
  "plan_name": "Name of the plan",
  "description": "Brief description",
  "days": [
    {{
      "day": "Lundi",
      "focus": "Muscle group focus",
      "workout_name": "Workout name",
      "duration_minutes": 45,
      "exercises": [
        {{"name": "Exercise name", "sets": 3, "reps": "10-12", "rest_seconds": 60}}
      ]
    }}
  ],
  "tips": ["Tip 1", "Tip 2"]
}}"""

    try:
        # --- Remplacement Gemini (Planning) ---
        gemini_response = model.generate_content(prompt)
        response_text = gemini_response.text
        
        # Nettoyage du code JSON (Gemini aime bien mettre des balises ```)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0]
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0]
            
        plan = json.loads(response_text)
        # --------------------------------------
        # Store the plan
        plan_doc = {
            "plan_id": str(uuid.uuid4()),
            "user_id": user.user_id,
            "goal": goal,
            "days_per_week": days_per_week,
            "plan": plan,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "active": True
        }
        
        # Deactivate old plans
        await db.smart_plans.update_many(
            {"user_id": user.user_id},
            {"$set": {"active": False}}
        )
        
        await db.smart_plans.insert_one(plan_doc)
        del plan_doc["_id"]
        
        return plan_doc
        
    except Exception as e:
        logger.error(f"Error generating plan: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur de génération: {str(e)}")

@api_router.get("/planning/current")
async def get_current_plan(user: User = Depends(get_current_user)):
    """Get the user's current active plan."""
    plan = await db.smart_plans.find_one(
        {"user_id": user.user_id, "active": True},
        {"_id": 0}
    )
    return plan or {"message": "Aucun plan actif"}

@api_router.get("/planning/history")
async def get_plan_history(user: User = Depends(get_current_user)):
    """Get all user's generated plans."""
    plans = await db.smart_plans.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(20)
    return plans

# ============== WEEKLY PLANNING (MANUAL) ==============

class WeeklyPlanningDay(BaseModel):
    date: str          # YYYY-MM-DD
    shift_type: str    # 6h-18h | 7h-18h | 18h-6h | repos | repos_sport
    workout_type: str  # aucun | renforcement | cardio | hiit | repos_actif
    notes: Optional[str] = None

@api_router.post("/planning/weekly")
async def save_weekly_planning(days: List[WeeklyPlanningDay], user: User = Depends(get_current_user)):
    """Sauvegarde le planning hebdomadaire manuel (type poste + séance sport par jour)."""
    saved = []
    for day in days:
        doc = {
            "user_id": user.user_id,
            "date": day.date,
            "shift_type": day.shift_type,
            "workout_type": day.workout_type,
            "notes": day.notes,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.weekly_planning.update_one(
            {"user_id": user.user_id, "date": day.date},
            {"$set": doc},
            upsert=True
        )
        saved.append(doc)
    return {"message": f"{len(saved)} jour(s) sauvegardé(s)", "days": saved}

@api_router.get("/planning/weekly")
async def get_weekly_planning(
    week_start: Optional[str] = None,
    user: User = Depends(get_current_user)
):
    """Récupère le planning hebdomadaire. Si week_start (YYYY-MM-DD lundi) est fourni, filtre la semaine."""
    query = {"user_id": user.user_id}
    if week_start:
        try:
            start = datetime.strptime(week_start, "%Y-%m-%d")
            end = start + timedelta(days=7)
            query["date"] = {
                "$gte": week_start,
                "$lt": end.strftime("%Y-%m-%d")
            }
        except ValueError:
            pass
    days = await db.weekly_planning.find(query, {"_id": 0}).sort("date", 1).to_list(100)
    return days

@api_router.delete("/planning/weekly/{date}")
async def delete_weekly_planning_day(date: str, user: User = Depends(get_current_user)):
    """Supprime un jour du planning hebdomadaire."""
    result = await db.weekly_planning.delete_one({"user_id": user.user_id, "date": date})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Jour non trouvé")
    return {"message": "Jour supprimé"}

# ============== PROGRAM IMPORT (JSON) ==============

class ProgramImport(BaseModel):
    program_json: str  # JSON string of the program

@api_router.post("/programs/import")
async def import_program(data: ProgramImport, user: User = Depends(get_current_user)):
    """Import a workout program from JSON."""
    try:
        program = json.loads(data.program_json)
        
        # Validate required fields
        if "name" not in program:
            raise HTTPException(status_code=400, detail="Le programme doit avoir un nom")
        
        # Create program document
        program_doc = {
            "program_id": str(uuid.uuid4()),
            "user_id": user.user_id,
            "name": program.get("name"),
            "description": program.get("description", ""),
            "duration_weeks": program.get("duration_weeks", 4),
            "days_per_week": program.get("days_per_week", 4),
            "difficulty": program.get("difficulty", "intermediate"),
            "workouts": program.get("workouts", []),
            "imported": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.programs.insert_one(program_doc)
        del program_doc["_id"]
        
        # Award XP for importing
        await db.users.update_one(
            {"user_id": user.user_id},
            {"$inc": {"total_xp": 25}}
        )
        
        return {**program_doc, "xp_awarded": 25, "message": "Programme importé avec succès ! +25 XP"}
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="JSON invalide")

@api_router.get("/programs/export/{program_id}")
async def export_program(program_id: str, user: User = Depends(get_current_user)):
    """Export a program as JSON."""
    program = await db.programs.find_one(
        {"program_id": program_id, "user_id": user.user_id},
        {"_id": 0, "user_id": 0}
    )
    if not program:
        raise HTTPException(status_code=404, detail="Programme non trouvé")
    
    return {"program_json": json.dumps(program, ensure_ascii=False, indent=2)}

# ============== ENHANCED NUTRITION AI ==============

@api_router.post("/nutrition/analyze")
async def analyze_nutrition(user: User = Depends(get_current_user)):
    """AI-powered nutrition analysis with personalized suggestions."""
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    
    # Get last 7 days of meals
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%d")
    meals = await db.meals.find(
        {"user_id": user.user_id, "date": {"$gte": week_ago}},
        {"_id": 0}
    ).to_list(100)
    
    if not meals:
        return {"message": "Pas assez de données pour l'analyse", "suggestions": []}
    
    # Calculate averages
    daily_data = {}
    for meal in meals:
        date = meal.get("date")
        if date not in daily_data:
            daily_data[date] = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "meals": []}
        daily_data[date]["calories"] += meal.get("calories", 0)
        daily_data[date]["protein"] += meal.get("protein", 0)
        daily_data[date]["carbs"] += meal.get("carbs", 0)
        daily_data[date]["fat"] += meal.get("fat", 0)
        daily_data[date]["meals"].append(meal.get("name", ""))
    
    avg_calories = sum(d["calories"] for d in daily_data.values()) / len(daily_data)
    avg_protein = sum(d["protein"] for d in daily_data.values()) / len(daily_data)
    avg_carbs = sum(d["carbs"] for d in daily_data.values()) / len(daily_data)
    avg_fat = sum(d["fat"] for d in daily_data.values()) / len(daily_data)
    
    target_calories = user_doc.get("daily_calories", 2000)
    target_protein = user_doc.get("target_protein", 120)
    goal = user_doc.get("goal", "maintain")
    
    prompt = f"""Analyse ces données nutritionnelles et donne des conseils personnalisés en français:

Moyennes sur 7 jours:
- Calories: {round(avg_calories)} kcal (objectif: {target_calories})
- Protéines: {round(avg_protein)}g (objectif: {target_protein}g)
- Glucides: {round(avg_carbs)}g
- Lipides: {round(avg_fat)}g

Objectif utilisateur: {goal}
Repas récents: {', '.join(set(m.get('name', '') for m in meals[:10]))}

Retourne UNIQUEMENT un JSON avec cette structure exacte:
{{
  "score": 75,
  "strengths": ["Point fort 1", "Point fort 2"],
  "improvements": ["Amélioration 1", "Amélioration 2"],
  "meal_suggestions": [
    {{"meal_type": "petit_dejeuner", "suggestion": "Description du repas suggéré", "calories": 400, "protein": 30}},
    {{"meal_type": "dejeuner", "suggestion": "Description", "calories": 600, "protein": 40}}
  ],
  "tips": ["Conseil pratique 1", "Conseil pratique 2", "Conseil pratique 3"]
}}"""

    try:
        # --- Remplacement Gemini (Analyse) ---
        gemini_response = model.generate_content(prompt)
        response_text = gemini_response.text
        
        # Nettoyage du code JSON
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0]
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0]
            
        analysis = json.loads(response_text)
        # -------------------------------------
        
        return {
            "analysis": analysis,
            "stats": {
                "avg_calories": round(avg_calories),
                "avg_protein": round(avg_protein),
                "avg_carbs": round(avg_carbs),
                "avg_fat": round(avg_fat),
                "days_tracked": len(daily_data),
                "total_meals": len(meals)
            }
        }
        
    except Exception as e:
        logger.error(f"Error analyzing nutrition: {e}")
        # Return basic analysis without AI
        return {
            "analysis": {
                "score": 50,
                "strengths": ["Vous suivez votre alimentation régulièrement"],
                "improvements": ["Essayez d'atteindre votre objectif calorique"],
                "meal_suggestions": [],
                "tips": ["Continuez à enregistrer vos repas"]
            },
            "stats": {
                "avg_calories": round(avg_calories),
                "avg_protein": round(avg_protein),
                "avg_carbs": round(avg_carbs),
                "avg_fat": round(avg_fat),
                "days_tracked": len(daily_data),
                "total_meals": len(meals)
            }
        }


# ============== DASHBOARD ENDPOINTS ==============

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(user: User = Depends(get_current_user)):
    """Get aggregated stats for the dashboard."""
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Calories & Protein Today
    today_meals = await db.meals.find({"user_id": user.user_id, "date": today}, {"calories": 1, "protein": 1}).to_list(100)
    calories_today = sum(m.get("calories", 0) for m in today_meals)
    protein_today = sum(m.get("protein", 0) for m in today_meals)
    
    # Workouts this week
    now = datetime.now(timezone.utc)
    start_of_week = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    workouts_this_week = await db.workouts.count_documents({
        "user_id": user.user_id,
        "completed": True,
        "completed_at": {"$gte": start_of_week.isoformat()}
    })
    
    # Streak (Simplified calculation)
    streak = user_doc.get("streak", 0)
    
    return {
        "calories_today": calories_today,
        "target_calories": user_doc.get("daily_calories", 2000),
        "protein_today": int(protein_today),
        "target_protein": user_doc.get("target_protein", 120),
        "workouts_this_week": workouts_this_week,
        "target_sessions": user_doc.get("sessions_per_week", 4),
        "streak": streak
    }

@api_router.get("/dashboard/meals/today")
async def get_todays_meals(user: User = Depends(get_current_user)):
    """Get meals for today."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    meals = await db.meals.find({"user_id": user.user_id, "date": today}, {"_id": 0}).to_list(100)
    return meals

@api_router.get("/dashboard/workouts/today")
async def get_todays_workouts(user: User = Depends(get_current_user)):
    """Get workouts scheduled for today."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    # Fetch scheduled OR completed today
    workouts = await db.workouts.find({
        "user_id": user.user_id,
        "$or": [
            {"scheduled_date": today},
            {"completed_at": {"$regex": f"^{today}"}}
        ]
    }, {"_id": 0}).to_list(20)
    return workouts

@api_router.get("/dashboard/hydration")
async def get_dashboard_hydration(user: User = Depends(get_current_user)):
    """Get hydration for today (Dashboard alias)."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    entry = await db.hydration.find_one({"user_id": user.user_id, "date": today}, {"_id": 0})
    if not entry:
        return {"glasses": 0, "target": 8}
    return entry

@api_router.get("/dashboard/steps")
async def get_dashboard_steps(user: User = Depends(get_current_user)):
    """Get steps for today (Dashboard alias)."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"steps_target": 1})
    default_target = user_doc.get("steps_target", 10000) if user_doc else 10000
    
    entry = await db.steps.find_one({"user_id": user.user_id, "date": today}, {"_id": 0})
    if not entry:
        return {"steps": 0, "target": default_target}
    if "target" not in entry:
        entry["target"] = default_target
    return entry

@api_router.get("/dashboard/calendar-workouts")
async def get_calendar_workouts(month: int, year: int, user: User = Depends(get_current_user)):
    """Get dates with workouts for a specific month."""
    start_date = f"{year}-{str(month).zfill(2)}-01"
    if month == 12:
        end_date = f"{year + 1}-01-01"
    else:
        end_date = f"{year}-{str(month + 1).zfill(2)}-01"
        
    workouts = await db.workouts.find({
        "user_id": user.user_id,
        "completed": True,
        "completed_at": {"$gte": start_date, "$lt": end_date}
    }, {"completed_at": 1}).to_list(100)
    
    dates = list(set(w["completed_at"][:10] for w in workouts if "completed_at" in w))
    return {"workout_dates": dates}

# Include the router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
