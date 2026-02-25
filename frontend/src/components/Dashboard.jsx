import { useState, useEffect, useCallback } from 'react';
import {
  Flame,
  Dumbbell,
  Target,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Utensils,
  Plus,
  Zap,
  Droplet,
  Footprints,
  Minus,
  Bell,
  CheckCircle2,
  Trophy,
  User,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { HydrationSystem } from './HydrationSystem';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Dashboard = () => {
  const { user, lastSync } = useAuth();
  const [stats, setStats] = useState(null);
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hydration state
  // Now handled by HydrationSystem component

  // Steps state
  const [steps, setSteps] = useState({ current: 0, target: 10000 });
  const [editingSteps, setEditingSteps] = useState(false);
  const [editingMode, setEditingMode] = useState('count'); // 'count' or 'target'
  const [stepsInput, setStepsInput] = useState('');

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [workoutDates, setWorkoutDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [statsRes, mealsRes, workoutsRes, stepsRes, workoutDaysRes] = await Promise.all([
          axios.get(`${API}/dashboard/stats`, { withCredentials: true }),
          axios.get(`${API}/dashboard/meals/today`, { withCredentials: true }),
          axios.get(`${API}/dashboard/workouts/today`, { withCredentials: true }),
          axios.get(`${API}/dashboard/steps`, { withCredentials: true }),
          axios.get(`${API}/dashboard/calendar-workouts?month=${calendarMonth + 1}&year=${calendarYear}`, { withCredentials: true })
        ]);

        setStats(statsRes.data);
        setMeals(mealsRes.data);
        setWorkouts(workoutsRes.data);
        setSteps(stepsRes.data);
        setWorkoutDates(workoutDaysRes.data.workout_dates || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, calendarMonth, calendarYear, lastSync]);

  // Fetch workout days when month changes
  const fetchWorkoutDays = async (month, year) => {
    try {
      const res = await axios.get(`${API}/performance/workout-days?month=${month}&year=${year}`, { withCredentials: true });
      setWorkoutDates(res.data.workout_dates || []);
    } catch (error) {
      console.error('Error fetching workout days:', error);
    }
  };

  const changeMonth = (direction) => {
    let newMonth = calendarMonth + direction;
    let newYear = calendarYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
    fetchWorkoutDays(newMonth, newYear);
  };



  // Steps handlers
  const updateSteps = async () => {
    const newVal = parseInt(stepsInput);
    if (isNaN(newVal) || newVal < 0) {
      toast.error('Valeur invalide');
      return;
    }

    try {
      if (editingMode === 'target') {
        // Update Target
        // Try to update via API, fallback to local state if endpoint missing
        try {
          await axios.put(`${API}/steps/target`, { target: newVal }, { withCredentials: true });
        } catch (e) {
          console.warn("Backend might not support PUT /steps/target yet, updating locally.");
        }

        setSteps(prev => ({ ...prev, target: newVal }));
        toast.success('Objectif de pas mis à jour !');
      } else {
        // Update Daily Count
        const res = await axios.post(`${API}/steps`, {
          steps: newVal,
          date: new Date().toISOString().split('T')[0]
        }, { withCredentials: true });
        // The API returns the updated steps object usually
        setSteps(prev => ({ ...prev, steps: newVal }));
        toast.success('Nombre de pas mis à jour !');
      }

      setEditingSteps(false);
    } catch (error) {
      console.error('Error updating steps:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const statCards = [
    {
      label: 'Calories Aujourd\'hui',
      value: stats?.calories_today || 0,
      target: stats?.target_calories || 2000,
      icon: Flame,
      color: '#B0E301',
      unit: 'kcal'
    },
    {
      label: 'Séances Cette Semaine',
      value: stats?.workouts_this_week || 0,
      target: stats?.target_sessions || 4,
      icon: Dumbbell,
      color: '#6441a5',
      unit: 'sessions'
    },
    {
      label: 'Objectif Protéines',
      value: stats?.protein_today || 0,
      target: stats?.target_protein || 120,
      icon: Target,
      color: '#FFD600',
      unit: 'g'
    },
    {
      label: 'Streak Actuel',
      value: stats?.streak || 0,
      target: 7,
      icon: TrendingUp,
      color: '#B0E301',
      unit: 'jours'
    },
  ];

  const mealTypeLabels = {
    petit_dejeuner: 'Petit-déjeuner',
    dejeuner: 'Déjeuner',
    collation: 'Collation',
    diner: 'Dîner'
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Bonjour,</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-[#6441a5]">{user?.name?.split(' ')[0] || 'Athlète'}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Prêt pour une nouvelle journée de performance ?</p>
        </div>
        <Link to="/sport">
          <Button variant="brand" className="px-6 py-3" data-testid="start-workout-btn">
            <Dumbbell className="w-4 h-4 mr-2" />
            Démarrer une Séance
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card
            key={stat.label}
            className="card-stat p-5"
            data-testid={`stat-card-${index}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-xs text-muted-foreground font-mono">{stat.target} {stat.unit}</span>
            </div>
            <p className="text-muted-foreground text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold font-mono stat-number">{stat.value}</p>
            <div className="mt-3">
              <Progress
                value={Math.min((stat.value / stat.target) * 100, 100)}
                className="h-1 bg-secondary"
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Hydration & Steps Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Card */}
        <HydrationSystem />

        {/* Steps Card */}
        <Card className="card-stat" data-testid="steps-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Footprints className="w-4 h-4 text-[#FF6B35]" />
                PAS AUJOURD'HUI
              </CardTitle>
              {/* TARGET EDIT BUTTON (PENCIL) */}
              <button
                onClick={() => {
                  setEditingMode('target');
                  setStepsInput(steps.target?.toString() || '10000');
                  setEditingSteps(true);
                }}
                className="text-sm text-[#A1A1AA] hover:text-[#B0E301] transition-colors flex items-center gap-1"
                title="Modifier l'objectif"
              >
                Objectif: {steps.target?.toLocaleString()} <span className="text-lg">✏️</span>
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              {/* COUNT EDIT BUTTON (CENTER AREA) */}
              <button
                onClick={() => {
                  setEditingMode('count');
                  setStepsInput(steps.steps?.toString() || '0');
                  setEditingSteps(true);
                }}
                className="group w-full hover:bg-white/5 rounded-lg p-2 transition-colors"
                data-testid="edit-steps-btn"
                title="Modifier le nombre de pas effectués"
              >
                <p className="text-5xl font-bold font-mono text-[#FF6B35] group-hover:scale-105 transition-transform">
                  {steps.steps?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-[#52525B] mt-1 underline decoration-dashed underline-offset-4 group-hover:text-[#FF6B35] transition-colors">
                  Cliquez ici pour modifier
                </p>
              </button>
            </div>
            <Progress
              value={Math.min((steps.steps / steps.target) * 100, 100)}
              className="h-3"
            />
            <div className="flex justify-between text-xs text-[#52525B] mt-2">
              <span>0</span>
              <span>{steps.target?.toLocaleString()}</span>
            </div>
            {steps.steps >= steps.target && (
              <div className="flex items-center justify-center gap-2 mt-3 text-[#B0E301]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Objectif atteint !</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak Calendar */}
        <Card className="card-stat lg:col-span-2" data-testid="streak-calendar">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#FFD600]" />
                CALENDRIER DE STREAK
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#A1A1AA] flex items-center gap-1">
                  <Flame className="w-4 h-4 text-[#FF6B35]" />
                  {stats?.streak || 0} jours
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeMonth(-1)}
                className="text-[#A1A1AA] hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-sm">
                {new Date(calendarYear, calendarMonth - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeMonth(1)}
                className="text-[#A1A1AA] hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center text-xs text-[#52525B] py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const firstDay = new Date(calendarYear, calendarMonth - 1, 1);
                const lastDay = new Date(calendarYear, calendarMonth, 0);
                const daysInMonth = lastDay.getDate();

                // Get day of week for first day (0 = Sunday, adjust for Monday start)
                let startDay = firstDay.getDay();
                startDay = startDay === 0 ? 6 : startDay - 1;

                const days = [];

                // Empty cells before first day
                for (let i = 0; i < startDay; i++) {
                  days.push(<div key={`empty-${i}`} className="h-9" />);
                }

                // Days of month
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];

                for (let day = 1; day <= daysInMonth; day++) {
                  const dateStr = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const hasWorkout = workoutDates.includes(dateStr);
                  const isToday = dateStr === todayStr;
                  const isFuture = new Date(dateStr) > today;

                  days.push(
                    <div
                      key={day}
                      className={`h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${hasWorkout
                        ? 'bg-[#B0E301] text-black'
                        : isToday
                          ? 'border-2 border-[#B0E301] text-white'
                          : isFuture
                            ? 'text-[#52525B]'
                            : 'text-[#A1A1AA] hover:bg-white/5'
                        }`}
                      data-testid={`calendar-day-${day}`}
                    >
                      {day}
                    </div>
                  );
                }

                return days;
              })()}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                <div className="w-4 h-4 rounded bg-[#B0E301]" />
                <span>Entraînement effectué</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                <div className="w-4 h-4 rounded border-2 border-[#B0E301]" />
                <span>Aujourd'hui</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Meals */}
        <Card className="card-stat" data-testid="todays-meals">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#6441a5]" />
                REPAS DU JOUR
              </CardTitle>
              <Link to="/repas">
                <Button variant="ghost" size="sm" className="text-xs text-[#A1A1AA]">
                  Voir tout <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {meals.length > 0 ? (
              meals.map((meal, index) => (
                <div
                  key={meal.meal_id}
                  className="flex items-center justify-between p-3 rounded bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                  data-testid={`meal-item-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-8 rounded-full ${meal.meal_type === 'petit_dejeuner' ? 'bg-[#FFD600]' :
                      meal.meal_type === 'dejeuner' ? 'bg-[#B0E301]' :
                        meal.meal_type === 'collation' ? 'bg-[#6441a5]' : 'bg-[#FF6B35]'
                      }`} />
                    <div>
                      <p className="font-medium text-sm">{meal.name}</p>
                      <p className="text-xs text-[#52525B]">{mealTypeLabels[meal.meal_type]}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm text-[#A1A1AA]">{meal.calories} kcal</span>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Utensils className="w-8 h-8 text-[#52525B] mx-auto mb-2" />
                <p className="text-sm text-[#52525B]">Aucun repas enregistré</p>
              </div>
            )}
            <Link to="/repas">
              <Button
                variant="outline"
                className="w-full mt-2 border-white/10 hover:border-[#B0E301]/30 hover:bg-[#B0E301]/5"
                data-testid="add-meal-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un repas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Workouts */}
      <Card className="card-stat" data-testid="upcoming-workouts">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#B0E301]" />
              PROCHAINES SÉANCES
            </CardTitle>
            <Link to="/sport">
              <Button variant="ghost" size="sm" className="text-xs text-[#A1A1AA]">
                Voir tout <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.map((workout, index) => (
                <div
                  key={workout.workout_id}
                  className="card-workout p-4 rounded flex items-center justify-between"
                  data-testid={`workout-item-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-[#B0E301]/10 flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-[#B0E301]" />
                    </div>
                    <div>
                      <p className="font-semibold">{workout.name}</p>
                      <p className="text-sm text-[#A1A1AA]">
                        {workout.scheduled_date || 'Non planifié'} - {workout.duration_minutes || 45} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`tag ${workout.intensity === 'haute' ? 'tag-green' : 'tag-purple'}`}>
                      {workout.intensity}
                    </span>
                    <ChevronRight className="w-5 h-5 text-[#52525B]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Dumbbell className="w-10 h-10 text-[#52525B] mx-auto mb-3" />
              <p className="text-[#A1A1AA] mb-4">Aucune séance planifiée</p>
              <Link to="/sport">
                <Button variant="brand">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une séance
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links Row (Profile & Settings) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/profil">
          <Card className="card-stat hover:bg-white/5 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#6441a5]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#6441a5] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold">Mon Profil</p>
                  <p className="text-xs text-[#A1A1AA]">Gérer mes informations</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#52525B] group-hover:text-white transition-colors" />
            </CardContent>
          </Card>
        </Link>
        <Link to="/parametres">
          <Card className="card-stat hover:bg-white/5 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#52525B]/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#A1A1AA] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold">Paramètres</p>
                  <p className="text-xs text-[#A1A1AA]">Préférences de l'application</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#52525B] group-hover:text-white transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Step Goal/Count Modal (Dual Purpose) */}
      <Dialog open={editingSteps} onOpenChange={setEditingSteps}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {editingMode === 'target' ? 'Objectif de Pas' : 'Pas du Jour'}
            </DialogTitle>
            <p className="text-center text-[#A1A1AA] text-sm">
              {editingMode === 'target'
                ? "Définissez votre cible quotidienne"
                : "Modifiez votre nombre de pas actuel"}
            </p>
          </DialogHeader>

          <div className="py-6 space-y-8">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4">
                <Footprints className="w-8 h-8 text-[#FF6B35]" />
                <span className="text-4xl font-bold font-mono">
                  {/* Display Target or Current based on edit mode for context? 
                      No, display what we are editing as large number. 
                      Actually current implementation displays value from state, that's fine. */}
                  {parseInt(stepsInput || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="px-4">
              {/* Quick Selectors - only show for target or both? Both is fine. */}
              <div className="flex justify-center gap-2 mb-4">
                {[5000, 8000, 10000, 12000, 15000].map(val => (
                  <button
                    key={val}
                    onClick={() => setStepsInput(val.toString())}
                    className={`px-3 py-1 text-xs rounded-full border ${parseInt(stepsInput) === val
                      ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                      : 'border-white/10 hover:border-white/30 text-[#A1A1AA]'
                      }`}
                  >
                    {val / 1000}k
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setStepsInput(Math.max(0, parseInt(stepsInput || 0) - 500).toString())}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <input
                  type="number"
                  value={stepsInput}
                  onChange={(e) => setStepsInput(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded px-4 py-2 text-xl font-mono min-w-[100px] text-center w-32 focus:outline-none focus:border-[#B0E301] transition-colors"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setStepsInput((parseInt(stepsInput || 0) + 500).toString())}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="brand"
              className="w-full bg-[#FF6B35] text-white md:hover:bg-[#FF6B35]/90 md:hover:shadow-[0_0_20px_rgba(255,107,53,0.6)] active:bg-[#FF6B35] active:text-white"
              onClick={updateSteps}
            >
              {editingMode === 'target' ? 'Valider l\'objectif' : 'Valider les pas'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
