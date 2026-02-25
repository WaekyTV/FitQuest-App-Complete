import { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Target,
  Heart,
  Flame,
  Dumbbell,
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Zap,
  Sparkles,
  Smile,
  Activity,
  Apple,
  Clock,
  Utensils,
  Home,
  ShoppingBag,
  MapPin,
  Leaf,
  Beef,
  Fish,
  Salad,
  Cookie,
  AlertCircle,
  Check,
  User,
  Calendar,
  Ruler, // Imported
  Bell
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Step configurations
const STEPS = [
  { id: 'main_goal', title: 'Objectif Principal', icon: Target },
  { id: 'secondary_goals', title: 'Autres Objectifs', icon: Heart },
  { id: 'calorie_experience', title: 'Comptage Calories', icon: Flame },
  { id: 'intermittent_fasting', title: 'Jeûne Intermittent', icon: Clock },
  { id: 'personal_info', title: 'Informations', icon: User },
  { id: 'height', title: 'Taille', icon: Ruler },
  { id: 'weight', title: 'Poids', icon: Scale }, // Added
  { id: 'target_weight', title: 'Objectif', icon: Target }, // Added
  { id: 'caloric_deficit', title: 'Déficit Calorique', icon: TrendingDown }, // Weight loss only
  { id: 'activity_level', title: 'Niveau d\'Activité', icon: Activity },
  { id: 'workouts_frequency', title: 'Fréquence', icon: Dumbbell }, // Added
  { id: 'reminders_setup', title: 'Rappels', icon: Bell },
  { id: 'meals_frequency', title: 'Repas par Jour', icon: Utensils }, // Renamed from meals_per_day
  { id: 'meal_timing', title: 'Horaires Repas', icon: Clock }, // Added/Split
  { id: 'eating_location', title: 'Lieu des Repas', icon: Home },
  { id: 'diet_preference', title: 'Régime Alimentaire', icon: Leaf },
  { id: 'restrictions', title: 'Restrictions', icon: AlertCircle },
  { id: 'habits_to_change', title: 'Habitudes à Changer', icon: Sparkles },
  { id: 'summary', title: 'Récapitulatif', icon: Check }
];

const ShieldCheck = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const MAIN_GOALS = [
  { id: 'weight_loss', label: 'Perte de poids', icon: TrendingDown, color: '#B0E301' },
  { id: 'maintain', label: 'Maintenir mon poids', icon: Minus, color: '#6441a5' },
  { id: 'weight_gain', label: 'Prendre du poids', icon: TrendingUp, color: '#FF6B35' },
  { id: 'muscle_gain', label: 'Prise de muscle', icon: Dumbbell, color: '#00BFFF' },
  { id: 'endurance', label: 'Endurance', icon: Activity, color: '#FFD700' }
];

const SECONDARY_GOALS = [
  { id: 'healthy_relationship', label: 'Développer une relation saine avec la nourriture', icon: Heart },
  { id: 'wellbeing', label: 'Améliorer mon bien-être général', icon: Smile },
  { id: 'energy', label: 'Booster mon énergie au quotidien', icon: Zap },
  { id: 'gut_health', label: 'Améliorer ma santé intestinale', icon: Activity },
  { id: 'body_confidence', label: 'Me sentir mieux dans ma peau', icon: Sparkles },
  { id: 'sports_performance', label: 'Améliorer mes performances sportives', icon: Dumbbell },
  { id: 'reduce_stress', label: 'Réduire le stress', icon: Brain },
  { id: 'learn_nutrition', label: 'En savoir plus sur la nutrition', icon: Apple }
];

const CALORIE_EXPERIENCE = [
  { id: 'beginner', label: 'Je débute dans le comptage de calories', description: 'C\'est nouveau pour moi' },
  { id: 'tried_before', label: 'J\'ai déjà essayé mais j\'ai arrêté', description: 'Je veux réessayer' },
  { id: 'experienced', label: 'Je compte déjà mes calories', description: 'J\'ai de l\'expérience' }
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Peu actif(ve)', description: 'Je suis vite essoufflé(e) en montant les escaliers', multiplier: 1.2 },
  { id: 'light', label: 'Légèrement actif(ve)', description: 'Je fais parfois de courtes séances pour rester actif(ve)', multiplier: 1.375 },
  { id: 'moderate', label: 'Modérément actif(ve)', description: 'J\'ai une routine d\'exercice régulière de 1 à 2 fois par semaine', multiplier: 1.55 },
  { id: 'very_active', label: 'Très actif(ve)', description: 'Le sport est une partie essentielle de mon mode de vie', multiplier: 1.725 }
];

const EATING_LOCATIONS = [
  { id: 'home', label: 'Je cuisine à la maison', icon: Home },
  { id: 'delivery', label: 'Je commande de l\'extérieur', icon: ShoppingBag },
  { id: 'outside', label: 'Je mange à l\'extérieur', icon: MapPin }
];

const DIET_PREFERENCES = [
  { id: 'balanced', label: 'Équilibré', icon: Scale },
  { id: 'vegetarian', label: 'Végétarien', icon: Leaf },
  { id: 'vegan', label: 'Vegan', icon: Salad },
  { id: 'paleo', label: 'Paléo', icon: Beef },
  { id: 'keto', label: 'Cétogène', icon: Fish },
  { id: 'high_protein', label: 'Riche en protéines', icon: Dumbbell },
  { id: 'low_carb', label: 'Pauvre en glucides', icon: Apple }
];

const RESTRICTIONS = [
  'Sans gluten', 'Sans lactose', 'Sans fruits de mer', 'Sans noix',
  'Sans soja', 'Sans oeufs', 'Halal', 'Casher', 'Sans porc'
];

const HABITS_TO_CHANGE = [
  { id: 'reduce_sugar', label: 'Réduire ma consommation de sucre' },
  { id: 'less_junk', label: 'Manger moins de malbouffe' },
  { id: 'stop_cravings', label: 'Arrêter les fringales compulsives' },
  { id: 'more_vegetables', label: 'Manger plus de légumes et de verdure' },
  { id: 'stop_stress_eating', label: 'Arrêter de manger à cause du stress' },
  { id: 'cook_more', label: 'Cuisiner plus souvent à la maison' },
  { id: 'reduce_salt', label: 'Réduire ma consommation de sel' }
];

const ScrollPicker = ({ min, max, value, onChange, unit = '' }) => {
  const scrollRef = useRef(null);
  const itemHeight = 64; // h-16 = 64px

  // Generate items
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  useEffect(() => {
    // Initial scroll to value
    if (scrollRef.current) {
      const index = value - min;
      scrollRef.current.scrollTop = index * itemHeight;
    }
  }, []);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const newValue = min + index;
    if (newValue >= min && newValue <= max && newValue !== value) {
      onChange(newValue);
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleArrowUp = () => {
    const currentIndex = value - min;
    if (currentIndex > 0) {
      const nextIndex = currentIndex - 1;
      onChange(min + nextIndex);
      scrollToIndex(nextIndex);
    }
  };

  const handleArrowDown = () => {
    const currentIndex = value - min;
    if (currentIndex < items.length - 1) {
      const nextIndex = currentIndex + 1;
      onChange(min + nextIndex);
      scrollToIndex(nextIndex);
    }
  };

  return (
    <div className="relative h-64 overflow-hidden select-none group">
      {/* Navigation Arrows (Desktop Only) */}
      <button
        onClick={(e) => { e.preventDefault(); handleArrowUp(); }}
        className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full bg-white/5 border border-white/10 hidden lg:flex items-center justify-center text-white/40 hover:text-[#B0E301] hover:bg-[#B0E301]/10 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => { e.preventDefault(); handleArrowDown(); }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full bg-white/5 border border-white/10 hidden lg:flex items-center justify-center text-white/40 hover:text-[#B0E301] hover:bg-[#B0E301]/10 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronDown className="w-6 h-6" />
      </button>

      {/* Selection Overlay Lines */}
      <div className="absolute top-1/2 left-0 right-0 h-16 -mt-8 pointer-events-none flex items-center justify-center z-20">
        <div className="w-16 h-[2px] bg-[#B0E301] absolute top-0 rounded-full"></div>
        <div className="w-16 h-[2px] bg-[#B0E301] absolute bottom-0 rounded-full"></div>
      </div>

      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none"></div>

      <div
        ref={scrollRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide py-24" // py-24 ensures first/last item can be centered
        onScroll={handleScroll}
      >
        {items.map(item => (
          <div
            key={item}
            className={`h-16 flex items-center justify-center snap-center transition-all duration-200 ${item === value
              ? 'text-5xl font-bold text-white scale-110'
              : 'text-3xl text-white/20 scale-90'
              }`}
          >
            {item} <span className={`text-sm ml-2 mt-4 font-bold ${item === value ? 'text-[#B0E301]' : 'text-transparent'}`}>{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimeScrollPicker = ({ value, onChange, options }) => {
  const scrollRef = useRef(null);
  const itemHeight = 64; // h-16 = 64px

  useEffect(() => {
    if (scrollRef.current) {
      const index = options.indexOf(value);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * itemHeight;
      }
    }
  }, []); // Only on mount

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (index >= 0 && index < options.length) {
      const newValue = options[index];
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleArrowUp = () => {
    const currentIndex = options.indexOf(value);
    if (currentIndex > 0) {
      const nextIndex = currentIndex - 1;
      onChange(options[nextIndex]);
      scrollToIndex(nextIndex);
    }
  };

  const handleArrowDown = () => {
    const currentIndex = options.indexOf(value);
    if (currentIndex < options.length - 1) {
      const nextIndex = currentIndex + 1;
      onChange(options[nextIndex]);
      scrollToIndex(nextIndex);
    }
  };

  return (
    <div className="relative h-64 overflow-hidden select-none group">
      {/* Navigation Arrows (Desktop Only) */}
      <button
        onClick={(e) => { e.preventDefault(); handleArrowUp(); }}
        className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full bg-white/5 border border-white/10 hidden lg:flex items-center justify-center text-white/40 hover:text-[#B0E301] hover:bg-[#B0E301]/10 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => { e.preventDefault(); handleArrowDown(); }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full bg-white/5 border border-white/10 hidden lg:flex items-center justify-center text-white/40 hover:text-[#B0E301] hover:bg-[#B0E301]/10 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronDown className="w-6 h-6" />
      </button>

      {/* Selection Overlay Lines */}
      <div className="absolute top-1/2 left-0 right-0 h-16 -mt-8 pointer-events-none flex items-center justify-center z-20">
        <div className="w-16 h-[2px] bg-[#B0E301] absolute top-0 rounded-full"></div>
        <div className="w-16 h-[2px] bg-[#B0E301] absolute bottom-0 rounded-full"></div>
      </div>

      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none"></div>

      <div
        ref={scrollRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide py-24"
        onScroll={handleScroll}
      >
        {options.map(option => (
          <div
            key={option}
            className={`h-16 flex items-center justify-center snap-center transition-all duration-200 ${option === value
              ? 'text-4xl font-bold text-white scale-110'
              : 'text-2xl text-white/20 scale-90'
              }`}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export const OnboardingFlow = ({ onComplete }) => {
  const { updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('start'); // Moved from renderStep

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Main goal
    main_goal: '',
    // Step 2: Secondary goals
    secondary_goals: [],
    // Step 3: Calorie experience
    calorie_experience: '',
    // Step 4: Intermittent fasting
    knows_intermittent_fasting: null,
    wants_intermittent_fasting: null,
    // Step 5: Personal info
    gender: '',
    birthdate: '',
    birthdateInput: '',
    age: 25,
    height: 170,
    weight: 70,
    target_weight: 70,
    target_weeks: 12,
    caloric_deficit_kcal: null,  // chosen deficit (kcal/day below TDEE)
    // Step 6: Activity level & weight loss rate
    activity_level: '',
    weekly_weight_loss: 0.5,
    // Step X: Sessions per week
    sessions_per_week: 4,
    // Step 7: Reminders
    workout_reminder_enabled: true,
    workout_reminder_time: '18:00',
    water_reminder_enabled: true,
    // Step 8: Meals per day
    meals_per_day: 3,
    // Step 9: Meal times
    meal_times: { start: '07:00', end: '21:00' },
    // Step 10: Eating location
    eating_location: '',
    // Step 11: Diet preference
    diet_preference: '',
    // Step 12: Restrictions
    dietary_restrictions: [],
    // Step 13: Habits to change
    habits_to_change: []
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key, item) => {
    setFormData(prev => {
      const current = prev[key] || [];
      const newItems = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      // Force uniqueness just in case
      return { ...prev, [key]: [...new Set(newItems)] };
    });
  };

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case 'main_goal': return !!formData.main_goal;
      case 'secondary_goals': return formData.secondary_goals.length > 0;
      case 'calorie_experience': return !!formData.calorie_experience;
      case 'intermittent_fasting': return formData.wants_intermittent_fasting !== null;
      case 'personal_info': return formData.gender && formData.birthdate;
      case 'height': return !!formData.height;
      case 'weight': return !!formData.weight;
      case 'target_weight': return !!formData.target_weight;
      case 'caloric_deficit': return formData.caloric_deficit_kcal !== null;
      case 'activity_level': return !!formData.activity_level;
      case 'workouts_frequency': return true; // Default is 4, always valid
      case 'meals_frequency': return formData.meals_per_day >= 1;
      case 'meal_timing': return !!formData.meal_times.start && !!formData.meal_times.end;
      case 'eating_location': return !!formData.eating_location;
      case 'diet_preference': return !!formData.diet_preference;
      default: return true;
    }
  };

  const handleNext = () => {
    let next = currentStep + 1;
    // Skip caloric_deficit step if goal is not weight_loss
    if (STEPS[next]?.id === 'caloric_deficit' && formData.main_goal !== 'weight_loss') {
      next += 1;
    }
    if (next < STEPS.length) setCurrentStep(next);
  };

  const handleBack = () => {
    let prev = currentStep - 1;
    // Skip caloric_deficit step if goal is not weight_loss
    if (STEPS[prev]?.id === 'caloric_deficit' && formData.main_goal !== 'weight_loss') {
      prev -= 1;
    }
    if (prev >= 0) setCurrentStep(prev);
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return 0;
    const diff = Date.now() - new Date(birthdate).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Calculate nutrition targets
      const currentAge = calculateAge(formData.birthdate) || formData.age;
      const bmr = formData.gender === 'male'
        ? 10 * formData.weight + 6.25 * formData.height - 5 * currentAge + 5
        : 10 * formData.weight + 6.25 * formData.height - 5 * currentAge - 161;

      const activityMultiplier = ACTIVITY_LEVELS.find(a => a.id === formData.activity_level)?.multiplier || 1.55;
      let tdee = bmr * activityMultiplier;

      // Adjust for goal
      if (formData.main_goal === 'weight_loss') {
        // Use the user's chosen caloric deficit if available, otherwise fallback
        const deficit = formData.caloric_deficit_kcal ?? (formData.weekly_weight_loss * 1100);
        tdee -= deficit;
      } else if (formData.main_goal === 'weight_gain' || formData.main_goal === 'muscle_gain') {
        tdee += 300;
      }

      const daily_calories = Math.round(Math.max(1200, tdee));
      const target_protein = Math.round(formData.weight * (formData.main_goal === 'muscle_gain' ? 2 : 1.6));

      // Prepare payload (exclude frontend-only fields)
      const rawPayload = {
        ...formData,
        daily_calories,
        target_protein,
        onboarding_completed: true,
        onboarding_date: new Date().toISOString(),
        goal: formData.main_goal, // Map main_goal to goal for backend logic
        age: currentAge,
        // Fix types
        knows_intermittent_fasting: formData.knows_intermittent_fasting === 'explained' ? true : formData.knows_intermittent_fasting
      };

      // Remove fields not in UserUpdate schema & Frontend noise
      const fieldsToRemove = [
        'birthdateInput',
        'workout_reminder_enabled',
        'workout_reminder_time',
        'water_reminder_enabled',
      ];

      fieldsToRemove.forEach(f => delete rawPayload[f]);

      // Filter out null values to avoid Pydantic issues
      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(([_, v]) => v !== null && v !== undefined)
      );

      console.log("Sending payload:", payload);

      // Save to backend using context to refresh global state
      await updateUser(payload);

      // Create reminders if enabled...

      // Create reminders if enabled
      if (formData.workout_reminder_enabled) {
        await axios.post(`${API}/reminders`, {
          type: 'workout',
          title: 'C\'est l\'heure de l\'entraînement !',
          time: formData.workout_reminder_time,
          days: [],
          enabled: true
        }, { withCredentials: true });
      }

      if (formData.water_reminder_enabled) {
        await axios.post(`${API}/reminders`, {
          type: 'water',
          title: 'N\'oublie pas de boire !',
          time: '09:00',
          days: [],
          enabled: true,
          interval_hours: 1
        }, { withCredentials: true });
      }

      toast.success('Profil configuré avec succès !');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding:', error);
      const msg = error.response?.data?.detail
        ? (typeof error.response.data.detail === 'object'
          ? JSON.stringify(error.response.data.detail)
          : error.response.data.detail)
        : 'Erreur lors de la sauvegarde';
      toast.error(`Erreur: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate time options for picker
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return options;
  };

  const renderStep = () => {
    const stepId = STEPS[currentStep].id;

    switch (stepId) {
      case 'main_goal':
        return (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-center mb-4">Objectif principal ?</h2>
            <div className="grid grid-cols-1 gap-3">
              {MAIN_GOALS.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => updateFormData('main_goal', goal.id)}
                  className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-4 ${formData.main_goal === goal.id
                    ? 'border-[#B0E301] bg-[#B0E301]/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <goal.icon className="w-6 h-6" style={{ color: goal.color }} />
                  </div>
                  <span className="font-bold text-lg text-left flex-1">{goal.label}</span>
                  {formData.main_goal === goal.id && (
                    <div className="w-6 h-6 rounded-full bg-[#B0E301] flex items-center justify-center">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'secondary_goals':
        return (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-center mb-1">Autres objectifs ?</h2>
            <p className="text-center text-[#A1A1AA] text-xs mb-4">Choix multiples</p>
            <div className="grid grid-cols-1 gap-3">
              {SECONDARY_GOALS.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleArrayItem('secondary_goals', goal.id)}
                  className={`p-4 rounded-full border-2 transition-all flex items-center gap-4 ${formData.secondary_goals.includes(goal.id)
                    ? 'border-[#B0E301] bg-[#B0E301]/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${formData.secondary_goals.includes(goal.id) ? 'bg-[#B0E301]/20' : 'bg-white/10'}`}>
                    <goal.icon className={`w-5 h-5 ${formData.secondary_goals.includes(goal.id) ? 'text-[#B0E301]' : 'text-[#A1A1AA]'}`} />
                  </div>
                  <span className="font-medium text-left flex-1">{goal.label}</span>
                  {formData.secondary_goals.includes(goal.id) && (
                    <div className="w-6 h-6 rounded-full bg-[#B0E301] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'calorie_experience':
        return (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-center mb-4">Comptage calories ?</h2>
            <div className="grid grid-cols-1 gap-3">
              {CALORIE_EXPERIENCE.map(exp => (
                <button
                  key={exp.id}
                  onClick={() => updateFormData('calorie_experience', exp.id)}
                  className={`p-4 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${formData.calorie_experience === exp.id
                    ? 'border-[#B0E301] bg-[#B0E301]/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                >
                  <div className="flex-1">
                    <p className="font-bold text-lg">{exp.label}</p>
                    <p className="text-xs text-[#A1A1AA] mt-1">{exp.description}</p>
                  </div>
                  {formData.calorie_experience === exp.id && (
                    <div className="w-6 h-6 rounded-full bg-[#B0E301] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'intermittent_fasting':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-2">Jeûne intermittent ?</h2>

            {/* PHASE 1: Connais-tu ? */}
            {formData.knows_intermittent_fasting === null ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => updateFormData('knows_intermittent_fasting', false)} // Show explanation even if they know
                  className="p-4 rounded-xl border border-white/10 hover:border-[#B0E301] hover:bg-[#B0E301]/10 transition-all"
                >
                  <p className="text-lg font-bold">Oui, je connais</p>
                </button>
                <button
                  onClick={() => updateFormData('knows_intermittent_fasting', false)}
                  className="p-4 rounded-xl border border-white/10 hover:border-[#B0E301] hover:bg-[#B0E301]/10 transition-all"
                >
                  <p className="text-lg font-bold">Non, c'est quoi ?</p>
                </button>
              </div>
            ) : (
              /* PHASE 2: Décision ou Explication */
              !formData.knows_intermittent_fasting ? (
                /* ECRAN RICHE TYPE IMAGE FOURNIE */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {/* Illustration Icon */}
                  <div className="flex justify-center mb-2">
                    <div className="w-32 h-32 bg-[#E0F2FE] rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(224,242,254,0.1)]">
                      <Clock className="w-12 h-12 text-[#0ea5e9] absolute left-6 top-6" />
                      <Utensils className="w-6 h-6 text-[#22c55e] absolute left-4 bottom-10" />
                      <div className="absolute right-6 bottom-8 w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🌙</span>
                      </div>
                    </div>
                  </div>

                  {/* Headline */}
                  <div className="text-center space-y-1">
                    <h2 className="text-3xl font-black uppercase leading-tight tracking-tight">
                      LE JEÛNE TE FAIT<br />PERDRE DU POIDS
                    </h2>
                    <h2 className="text-3xl font-black uppercase text-[#3B82F6] leading-tight tracking-tight">
                      1,2x PLUS VITE
                    </h2>
                  </div>

                  {/* Subtext */}
                  <p className="text-center text-[#A1A1AA] text-sm leading-relaxed px-2">
                    Le jeûne est une pause alimentaire planifiée, généralement de 12 heures ou plus.
                    Ce n'est pas une mode : c'est prouvé scientifiquement.
                  </p>

                  {/* Harvard Card */}
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl flex items-start gap-4">
                    <div className="w-8 h-8 shrink-0 bg-[#DC2626] rounded flex items-center justify-center mt-1">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#0F172A] mb-1">Harvard Health Publishing <span className="font-normal text-[#64748B]">affirme que</span></p>
                      <p className="text-xs text-[#334155] leading-relaxed">
                        le jeûne intermittent peut aider à la perte de poids en réduisant les niveaux d'insuline et en améliorant la santé métabolique.
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <a
                      href="https://www.google.com/search?q=intermittent+fasting+benefits+harvard+health"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#94A3B8] underline decoration-1 underline-offset-2 hover:text-white transition-colors"
                    >
                      Source des recommandations
                    </a>
                  </div>

                  <button
                    onClick={() => updateFormData('knows_intermittent_fasting', 'explained')}
                    className="w-full py-4 text-center bg-[#1F2937] hover:bg-[#374151] rounded-full text-white font-bold text-lg transition-all"
                  >
                    Continuer
                  </button>

                  <button
                    onClick={() => updateFormData('knows_intermittent_fasting', null)}
                    className="w-full py-2 flex items-center justify-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors mt-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                  </button>
                </div>
              ) : (
                /* Choix Final (Après explanation ou si 'Oui je connais') */
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-center text-lg font-medium text-white">
                    {formData.knows_intermittent_fasting === 'explained'
                      ? "Alors, on l'intègre à ton programme ?"
                      : "Souhaites-tu l'intégrer à ton programme ?"}
                  </h3>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => updateFormData('wants_intermittent_fasting', true)}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between ${formData.wants_intermittent_fasting === true
                        ? 'border-[#B0E301] bg-[#B0E301]/10'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                      <span className="font-bold">Oui, je veux tester !</span>
                      {formData.wants_intermittent_fasting === true && <Check className="w-5 h-5 text-[#B0E301]" />}
                    </button>

                    <button
                      onClick={() => updateFormData('wants_intermittent_fasting', false)}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between ${formData.wants_intermittent_fasting === false
                        ? 'border-white/30 bg-white/5'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                      <span>Non, pas pour l'instant</span>
                      {formData.wants_intermittent_fasting === false && <Check className="w-5 h-5 text-white" />}
                    </button>

                    <button
                      onClick={() => {
                        updateFormData('knows_intermittent_fasting', null);
                        updateFormData('wants_intermittent_fasting', null);
                      }}
                      className="w-full py-2 flex items-center justify-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors mt-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Retour aux choix
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        );

      case 'height':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-center mb-6">Quelle est ta taille ?</h2>

            <div className="bg-white/5 rounded-3xl p-4 border border-white/10 relative">
              <ScrollPicker
                min={140}
                max={220}
                value={formData.height}
                onChange={(val) => updateFormData('height', val)}
                unit="cm"
              />
            </div>

            <p className="text-center text-[#52525B] text-sm">
              Fais défiler pour sélectionner ta taille
            </p>
          </div>
        );

      case 'personal_info':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Parle-nous de toi</h2>

            {/* Gender */}
            <div>
              <label className="text-sm text-[#A1A1AA] mb-2 block">Genre</label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female'].map(g => (
                  <button
                    key={g}
                    onClick={() => updateFormData('gender', g)}
                    className={`p-3 rounded-lg border transition-all ${formData.gender === g
                      ? 'border-[#B0E301] bg-[#B0E301]/10'
                      : 'border-white/10 hover:border-white/30'
                      }`}
                  >
                    {g === 'male' ? 'Homme' : 'Femme'}
                  </button>
                ))}
              </div>
            </div>

            {/* Birthdate & Age (Manual Input) */}
            <div>
              <label className="text-sm text-[#A1A1AA] mb-2 block">Date de naissance (JJ/MM/AAAA)</label>
              <input
                type="text"
                maxLength={10}
                placeholder="JJ/MM/AAAA"
                value={formData.birthdateInput}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '');
                  if (v.length > 8) v = v.slice(0, 8);

                  let formatted = v;
                  if (v.length >= 5) {
                    formatted = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
                  } else if (v.length >= 3) {
                    formatted = `${v.slice(0, 2)}/${v.slice(2)}`;
                  }

                  const updates = { birthdateInput: formatted };

                  // Calculate age if valid full date
                  if (v.length === 8) {
                    const day = parseInt(v.slice(0, 2));
                    const month = parseInt(v.slice(2, 4));
                    const year = parseInt(v.slice(4));

                    if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900 && year < new Date().getFullYear()) {
                      const birthDate = new Date(year, month - 1, day);
                      const today = new Date();
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const m = today.getMonth() - birthDate.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                      }
                      updates.age = age;
                      // Store ISO date for backend
                      updates.birthdate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    }
                  }
                  setFormData(prev => ({ ...prev, ...updates }));
                }}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#B0E301] focus:outline-none placeholder-white/20"
              />
              {formData.age && formData.birthdateInput.length === 10 && (
                <p className="text-xs text-[#52525B] mt-2 text-right">Age : <span className="text-[#B0E301] font-bold">{formData.age} ans</span></p>
              )}
            </div>

            {/* Height - REMOVED (Moved to own step) */}
            {/* Weight & Target Weight - REMOVED (Moved to own steps) */}
          </div>
        );

      case 'weight':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-center mb-6">Quel est ton poids ?</h2>

            <div className="bg-white/5 rounded-3xl p-4 border border-white/10 relative">
              <ScrollPicker
                min={40}
                max={150}
                value={formData.weight}
                onChange={(val) => updateFormData('weight', val)}
                unit="kg"
              />
            </div>

            <p className="text-center text-[#52525B] text-sm">
              Fais défiler pour sélectionner ton poids
            </p>
          </div>
        );

      case 'target_weight':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-center mb-2">Quel est ton objectif ?</h2>

            <div className="bg-white/5 rounded-3xl p-4 border border-white/10 relative">
              <ScrollPicker
                min={40}
                max={150}
                value={formData.target_weight}
                onChange={(val) => updateFormData('target_weight', val)}
                unit="kg"
              />
            </div>

            {formData.main_goal !== 'maintain' && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm text-[#A1A1AA] font-medium">Durée de l'objectif</label>
                  <span className="text-xl font-bold text-[#B0E301]">{formData.target_weeks} semaines</span>
                </div>

                <Slider
                  className="h-8 cursor-pointer" // Taller touch area
                  value={[formData.target_weeks]}
                  onValueChange={([v]) => updateFormData('target_weeks', v)}
                  min={4}
                  max={52}
                  step={1}
                />

                <div className="flex justify-between text-xs text-[#52525B] mt-2 font-medium">
                  <span>Rapide (4 sem)</span>
                  <span>Progressif (52 sem)</span>
                </div>

                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-[#A1A1AA] text-center">
                    Perte estimée: <span className="text-white font-bold">
                      {formData.main_goal === 'weight_loss'
                        ? ((formData.weight - formData.target_weight) / formData.target_weeks).toFixed(1)
                        : ((formData.target_weight - formData.weight) / formData.target_weeks).toFixed(1)} kg/semaine
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'caloric_deficit': {
        // Pre-calculate an estimated TDEE (before activity — we don't have activity yet,
        // so we use a moderate multiplier as a preview; final TDEE is computed in handleComplete)
        const age = formData.age || 25;
        const bmr = formData.gender === 'male'
          ? 10 * formData.weight + 6.25 * formData.height - 5 * age + 5
          : 10 * formData.weight + 6.25 * formData.height - 5 * age - 161;
        const estimatedTDEE = Math.round(bmr * 1.55); // moderate activity preview

        const weightToLose = Math.max(0, formData.weight - formData.target_weight);
        // Recommended deficit: aim to lose weight linearly over target_weeks, capped at 1000 kcal for safety
        const recommendedDeficit = Math.min(1000, Math.max(200, Math.round((weightToLose * 7700) / (formData.target_weeks * 7))));

        const DEFICIT_OPTIONS = [
          {
            id: 'deficit_250',
            value: 250,
            label: 'Léger',
            emoji: '🟢',
            desc: 'Perte douce, facile à tenir',
            lossPerWeek: 0.25,
            color: '#22c55e',
          },
          {
            id: 'deficit_500',
            value: 500,
            label: 'Modéré',
            emoji: '🟡',
            desc: 'Équilibre idéal perte / énergie',
            lossPerWeek: 0.5,
            color: '#B0E301',
            recommended: true,
          },
          {
            id: 'deficit_750',
            value: 750,
            label: 'Intensif',
            emoji: '🔴',
            desc: 'Résultats rapides, demande plus de discipline',
            lossPerWeek: 0.75,
            color: '#f97316',
          },
          {
            id: 'deficit_custom',
            value: recommendedDeficit,
            label: 'Sur-mesure ✨',
            emoji: '🤖',
            desc: `Calculé spécialement pour atteindre ton objectif en ${formData.target_weeks} sem.`,
            lossPerWeek: +(recommendedDeficit / 1100).toFixed(2),
            color: '#6441a5',
            custom: true,
          },
        ];

        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">Ton déficit calorique</h2>
              <p className="text-sm text-[#A1A1AA]">
                Ton apport estimé (maintenance) : <span className="text-white font-bold">{estimatedTDEE} kcal/j</span>
              </p>
              <p className="text-xs text-[#52525B] mt-1">Choisis le rythme qui te convient</p>
            </div>

            <div className="space-y-3">
              {DEFICIT_OPTIONS.map(opt => {
                const dailyCals = Math.max(1200, estimatedTDEE - opt.value);
                const isSelected = formData.caloric_deficit_kcal === opt.value;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      updateFormData('caloric_deficit_kcal', opt.value);
                      updateFormData('weekly_weight_loss', opt.lossPerWeek);
                    }}
                    className="w-full p-4 rounded-2xl border-2 transition-all text-left"
                    style={{
                      borderColor: isSelected ? opt.color : 'rgba(255,255,255,0.1)',
                      backgroundColor: isSelected ? `${opt.color}15` : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{opt.emoji}</span>
                        <span className="font-bold text-base" style={{ color: isSelected ? opt.color : 'white' }}>
                          {opt.label}
                        </span>
                        {opt.recommended && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{ backgroundColor: `${opt.color}25`, color: opt.color }}>
                            Recommandé
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm" style={{ color: opt.color }}>
                          -{opt.value} kcal/j
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#A1A1AA] mb-2">{opt.desc}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-[#52525B]">
                        Apport : <span className="text-white font-semibold">{dailyCals} kcal/j</span>
                      </span>
                      <span className="text-[#52525B]">
                        Perte : <span className="font-semibold" style={{ color: opt.color }}>
                          ~{opt.lossPerWeek} kg/sem
                        </span>
                      </span>
                    </div>
                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" style={{ color: opt.color }} />
                        <span className="text-xs font-semibold" style={{ color: opt.color }}>Sélectionné</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
      case 'activity_level':
        return (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-center mb-4">Niveau d'activité ?</h2>
            <div className="grid grid-cols-1 gap-3">
              {ACTIVITY_LEVELS.map(level => (
                <button
                  key={level.id}
                  onClick={() => updateFormData('activity_level', level.id)}
                  className={`p-4 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${formData.activity_level === level.id
                    ? 'border-[#B0E301] bg-[#B0E301]/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                >
                  <div className="flex-1">
                    <p className="font-bold text-lg">{level.label}</p>
                    <p className="text-xs text-[#A1A1AA] mt-1">{level.description}</p>
                  </div>
                  {formData.activity_level === level.id && (
                    <div className="w-6 h-6 rounded-full bg-[#B0E301] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Weight Loss Slider - REMOVED (Duplicate logic) */}

          </div>
        );

      case 'workouts_frequency':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-center mb-6">Combien de séances par semaine ?</h2>
            <div className="text-center">
              <p className="text-6xl font-bold text-[#B0E301] mb-4">{formData.sessions_per_week}</p>
              <Slider
                value={[formData.sessions_per_week]}
                onValueChange={([v]) => updateFormData('sessions_per_week', v)}
                min={1}
                max={7}
                step={1}
              />
              <div className="flex justify-between text-xs text-[#52525B] mt-2">
                <span>1</span>
                <span>7+</span>
              </div>
              <p className="text-[#A1A1AA] text-sm mt-6 bg-white/5 p-4 rounded-xl border border-white/5">
                💡 Un rythme de <span className="text-white font-bold">3 à 5 séances</span> est souvent idéal pour commencer et progresser durablement.
              </p>
            </div>
          </div>
        );

      case 'reminders_setup':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Configure tes rappels</h2>

            <Card className="card-stat">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Dumbbell className="w-5 h-5 text-[#B0E301]" />
                    <div>
                      <p className="font-medium">Rappel d'entraînement</p>
                      <p className="text-xs text-[#52525B]">Notification quotidienne</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.workout_reminder_enabled}
                    onCheckedChange={(v) => updateFormData('workout_reminder_enabled', v)}
                  />
                </div>

                {formData.workout_reminder_enabled && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 relative">
                    <TimeScrollPicker
                      value={formData.workout_reminder_time}
                      onChange={(val) => updateFormData('workout_reminder_time', val)}
                      options={generateTimeOptions()}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-stat">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Apple className="w-5 h-5 text-[#00BFFF]" />
                    <div>
                      <p className="font-medium">Rappel d'hydratation</p>
                      <p className="text-xs text-[#52525B]">Toutes les heures (8h-20h)</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.water_reminder_enabled}
                    onCheckedChange={(v) => updateFormData('water_reminder_enabled', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'meals_frequency':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-center mb-6">Combien de repas par jour ?</h2>
            <div className="text-center">
              <p className="text-6xl font-bold text-[#B0E301] mb-4">{formData.meals_per_day}</p>
              <Slider
                value={[formData.meals_per_day]}
                onValueChange={([v]) => updateFormData('meals_per_day', v)}
                min={1}
                max={6}
                step={1}
              />
              <div className="flex justify-between text-xs text-[#52525B] mt-2">
                <span>1</span>
                <span>6</span>
              </div>
            </div>
            <p className="text-[#A1A1AA] text-sm text-center">
              Inclut les repas principaux et les collations.
            </p>
          </div>
        );

      case 'meal_timing':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-center mb-6">Tes horaires de repas</h2>

            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
              <button
                onClick={() => setActiveTab('start')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'start'
                  ? 'bg-[#B0E301] text-black shadow-lg'
                  : 'text-[#A1A1AA] hover:text-white'
                  }`}
              >
                Premier repas
              </button>
              <button
                onClick={() => setActiveTab('end')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'end'
                  ? 'bg-[#B0E301] text-black shadow-lg'
                  : 'text-[#A1A1AA] hover:text-white'
                  }`}
              >
                Dernier repas
              </button>
            </div>

            <div className="bg-white/5 rounded-3xl p-4 border border-white/10 relative">
              <TimeScrollPicker
                value={activeTab === 'start' ? formData.meal_times.start : formData.meal_times.end}
                onChange={(val) => updateFormData('meal_times', {
                  ...formData.meal_times,
                  [activeTab]: val
                })}
                options={generateTimeOptions()}
              />
            </div>

            <p className="text-center text-[#52525B] text-sm">
              {activeTab === 'start'
                ? "Heure approximative de ton petit-déjeuner ou premier repas"
                : "Heure approximative de ton dîner ou dernier repas"}
            </p>
          </div>
        );

      case 'eating_location':
        return (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-center mb-4">Lieu des repas ?</h2>
            <div className="grid grid-cols-1 gap-3">
              {EATING_LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => updateFormData('eating_location', loc.id)}
                  className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-4 ${formData.eating_location === loc.id
                    ? 'border-[#B0E301] bg-[#B0E301]/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                >
                  <loc.icon className={`w-6 h-6 ${formData.eating_location === loc.id ? 'text-[#B0E301]' : 'text-[#52525B]'
                    }`} />
                  <span className="font-bold text-lg text-left flex-1">{loc.label}</span>
                  {formData.eating_location === loc.id && (
                    <div className="w-6 h-6 rounded-full bg-[#B0E301] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'diet_preference':
        return (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-center mb-4">Régime alimentaire ?</h2>
            <div className="grid grid-cols-1 gap-3">
              {DIET_PREFERENCES.map(diet => (
                <button
                  key={diet.id}
                  onClick={() => updateFormData('diet_preference', diet.id)}
                  className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-4 ${formData.diet_preference === diet.id
                    ? 'border-[#B0E301] bg-[#B0E301]/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                >
                  <diet.icon className={`w-6 h-6 ${formData.diet_preference === diet.id ? 'text-[#B0E301]' : 'text-[#52525B]'
                    }`} />
                  <span className="font-bold text-lg text-left flex-1">{diet.label}</span>
                  {formData.diet_preference === diet.id && (
                    <div className="w-6 h-6 rounded-full bg-[#B0E301] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'restrictions':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-2">As-tu des restrictions alimentaires ?</h2>
            <p className="text-center text-[#A1A1AA] mb-6">Sélectionne toutes celles qui s'appliquent</p>
            <div className="flex flex-wrap gap-2">
              {RESTRICTIONS.map(restriction => (
                <button
                  key={restriction}
                  onClick={() => toggleArrayItem('dietary_restrictions', restriction)}
                  className={`px-4 py-2 rounded-full border transition-all ${formData.dietary_restrictions.includes(restriction)
                    ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]'
                    : 'border-white/10 hover:border-white/30'
                    }`}
                >
                  {restriction}
                </button>
              ))}
            </div>
          </div>
        );

      case 'habits_to_change':
        return (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-center mb-1">Habitudes à changer ?</h2>
            <p className="text-center text-[#A1A1AA] text-xs mb-4">Choix multiples</p>
            <div className="grid grid-cols-1 gap-3">
              {HABITS_TO_CHANGE.map(habit => (
                <button
                  key={habit.id}
                  onClick={() => toggleArrayItem('habits_to_change', habit.id)}
                  className={`p-4 rounded-full border-2 transition-all flex items-center gap-4 ${formData.habits_to_change.includes(habit.id)
                    ? 'border-[#B0E301] bg-[#B0E301]/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                >
                  <span className="font-medium text-left flex-1 ml-2">{habit.label}</span>
                  {formData.habits_to_change.includes(habit.id) && (
                    <div className="w-6 h-6 rounded-full bg-[#B0E301] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'summary':
        const goalLabel = MAIN_GOALS.find(g => g.id === formData.main_goal)?.label;
        const activityLabel = ACTIVITY_LEVELS.find(a => a.id === formData.activity_level)?.label;
        const dietLabel = DIET_PREFERENCES.find(d => d.id === formData.diet_preference)?.label;

        // Calculate estimated date
        const weightDiff = Math.abs(formData.target_weight - formData.weight);
        const weeksNeeded = formData.main_goal === 'maintain' ? 0 : Math.ceil(weightDiff / formData.weekly_weight_loss);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + weeksNeeded * 7);

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Ton plan personnalisé</h2>

            <Card className="card-stat border-[#B0E301]/30">
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <Target className="w-12 h-12 mx-auto mb-2 text-[#B0E301]" />
                  <h3 className="text-xl font-bold">{goalLabel}</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Poids actuel</span>
                    <span className="font-bold">{formData.weight} kg</span>
                  </div>
                  {formData.main_goal !== 'maintain' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-[#A1A1AA]">Poids objectif</span>
                        <span className="font-bold">{formData.target_weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A1A1AA]">Date estimée</span>
                        <span className="font-bold text-[#B0E301]">
                          {targetDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Niveau d'activité</span>
                    <span className="font-bold">{activityLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Régime</span>
                    <span className="font-bold">{dietLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Repas par jour</span>
                    <span className="font-bold">{formData.meals_per_day}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-[#A1A1AA] text-sm">
                En cliquant sur "Valider", tu acceptes que l'IA génère ton plan nutritionnel personnalisé.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepId = STEPS[currentStep].id;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" data-testid="onboarding-flow">
      {/* Progress Header - COMPACT */}
      <div className="px-4 py-3 border-b border-white/10 shrink-0">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#A1A1AA]">
              Étape {currentStep + 1}/{STEPS.length}
            </span>
            <span className="text-xs font-medium text-[#B0E301]">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Content - SCROLL BEHIND BUTTON */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide pb-32">
        <div className="max-w-md mx-auto" key={stepId}>
          {renderStep()}
        </div>
      </div>

      {/* Navigation - FLOATING BUTTON */}
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-full bg-[#1F2937] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 h-14 rounded-full bg-[#1F2937] text-white font-bold text-lg shadow-xl shadow-black/50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              Suivant <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex-1 h-14 rounded-full bg-[#B0E301] text-black font-bold text-lg shadow-xl shadow-[#B0E301]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? '...' : 'Valider'} <Check className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
