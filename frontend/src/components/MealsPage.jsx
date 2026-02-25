import { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Clock,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Plus,
  RefreshCw,
  Trash2,
  ChevronDown,
  Award,
  Target,
  TrendingUp,
  Check,
  Star,
  Heart,
  Brain,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  UsersRound,
  UtensilsCrossed,
  Globe,
  Recycle,
  MapPin,
  ChefHat,
  ScrollText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const mealTypeLabels = {
  petit_dejeuner: 'Petit-déjeuner',
  dejeuner: 'Déjeuner',
  collation: 'Collation',
  diner: 'Dîner'
};

const mealTypeColors = {
  petit_dejeuner: '#FFD600',
  dejeuner: '#B0E301',
  collation: '#6441a5',
  diner: '#FF6B35'
};

const goalLabels = {
  weight_loss: 'Perte de poids',
  muscle_gain: 'Prise de muscle',
  maintenance: 'Maintien',
  endurance: 'Endurance'
};

const NutrientBadge = ({ icon: Icon, value, label, color }) => (
  <div className="nutrient-badge">
    <Icon className="w-4 h-4 mb-1" style={{ color }} />
    <span className="font-mono text-sm font-semibold">{value}</span>
    <span className="text-xs text-[#52525B]">{label}</span>
  </div>
);

export const MealsPage = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingCount, setGeneratingCount] = useState(0);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  // Favorites tab
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  // Regenerating meal IDs
  const [regenerating, setRegenerating] = useState(new Set());
  // Global meal preferences
  const [mealPrefs, setMealPrefs] = useState({
    num_people: 1,
    allow_meat_fish: true,
    prefer_powdered_protein: false,
  });
  // Favorites plan builder slots {petit_dejeuner, dejeuner, collation, diner}
  const [planDaySlots, setPlanDaySlots] = useState({});
  const [savingPlan, setSavingPlan] = useState(false);

  // Nutrition score state
  const [nutritionScore, setNutritionScore] = useState(null);
  const [claimingBadge, setClaimingBadge] = useState(null);

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [generateMode, setGenerateMode] = useState('day'); // 'day' or 'week'

  const [newMeal, setNewMeal] = useState({
    name: '',
    meal_type: 'dejeuner',
    date: new Date().toISOString().split('T')[0],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    fetchMeals();
    fetchNutritionScore();
    fetchMealPrefs();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`${API}/meals`, { withCredentials: true });
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast.error('Erreur lors du chargement des repas');
    } finally {
      setLoading(false);
    }
  };

  // Load saved meal preferences from user profile
  const fetchMealPrefs = async () => {
    try {
      const resp = await axios.get(`${API}/users/me`, { withCredentials: true });
      const u = resp.data;
      setMealPrefs({
        num_people: u.num_people || 1,
        allow_meat_fish: u.allow_meat_fish !== false,
        prefer_powdered_protein: !!u.prefer_powdered_protein,
      });
    } catch { }
  };

  const saveMealPrefs = async (newPrefs) => {
    try {
      await axios.patch(`${API}/users/meal-preferences`, newPrefs, { withCredentials: true });
    } catch (e) { console.warn('Could not save meal prefs', e); }
  };

  const fetchNutritionScore = async () => {
    try {
      const response = await axios.get(`${API}/nutrition/score`, { withCredentials: true });
      setNutritionScore(response.data);
    } catch (error) {
      console.error('Error fetching nutrition score:', error);
    }
  };

  const handleClaimBadge = async (badgeId) => {
    setClaimingBadge(badgeId);
    try {
      const response = await axios.post(`${API}/nutrition/claim-badge/${badgeId}`, {}, { withCredentials: true });
      toast.success(response.data.message);
      fetchNutritionScore();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Erreur lors de la réclamation';
      toast.error(errorMsg);
    } finally {
      setClaimingBadge(null);
    }
  };

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await axios.post(`${API}/nutrition/analyze`, {}, { withCredentials: true });
      setAiAnalysis(response.data);
      setAnalysisDialogOpen(true);
    } catch (error) {
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratingCount(0);
    try {
      // Fetch planning context to adapt macros
      const todayStr = new Date().toISOString().split('T')[0];
      let planning = [];
      try {
        const planResp = await axios.get(`${API}/planning/weekly`, { withCredentials: true });
        if (Array.isArray(planResp.data)) {
          planning = planResp.data;
        }
      } catch (e) {
        console.error("Failed to fetch planning", e);
      }

      // If day mode: target today. If week mode: target next 7 days.
      const daysToGenerate = generateMode === 'day'
        ? [planning.find(p => p.date === todayStr) || { date: todayStr, workout_type: 'aucun', shift_type: 'repos' }]
        : planning.filter(p => p.date >= todayStr).slice(0, 7);

      if (daysToGenerate.length === 0 && generateMode === 'week') {
        toast.error("Aucun planning trouvé pour la semaine. Remplis ton planning d'abord !");
        setIsGenerating(false);
        return;
      }

      const MEAL_TYPES = ['petit_dejeuner', 'dejeuner', 'collation', 'diner'];
      const synchronizableCache = {}; // Cache for reusing Breakfast & Snacks
      const likedIds = meals.filter(m => m.liked).map(m => m.meal_id).slice(0, 5);
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      const macroMap = {
        renforcement: { protein_bonus: 30, calorie_bonus: 0 },
        hiit: { protein_bonus: 15, calorie_bonus: 100 },
        cardio: { protein_bonus: 10, calorie_bonus: 50 },
        repos_actif: { protein_bonus: 5, calorie_bonus: -100 },
        aucun: { protein_bonus: 0, calorie_bonus: -200 },
        repos: { protein_bonus: 0, calorie_bonus: -200 },
      };

      const allGenerated = [];
      let lastCallTime = 0;

      for (const day of daysToGenerate) {
        const workoutType = day.workout_type || 'aucun';
        const shiftType = day.shift_type || 'repos';
        const adj = macroMap[workoutType] || macroMap.aucun;

        for (const meal_type of MEAL_TYPES) {
          const isSynchronizable = (meal_type === 'petit_dejeuner' || meal_type === 'collation');
          const cacheKey = `${shiftType}_${workoutType}_${meal_type}`;

          if (isSynchronizable && synchronizableCache[cacheKey]) {
            // SYNC OPTIMIZATION: Reuse existing recipe for similar context
            try {
              const cachedMeal = { ...synchronizableCache[cacheKey] };
              // Strip unique IDs but keep the content to create a new instance via POST /meals
              const { meal_id, created_at, ...mealData } = cachedMeal;
              const res = await axios.post(`${API}/meals`, {
                ...mealData,
                date: day.date,
                ai_generated: true
              }, { withCredentials: true });

              allGenerated.push(res.data);
              setGeneratingCount(c => c + 1);
              continue; // Skip Gemini call
            } catch (e) {
              console.warn("Repetition failed, falling back to new generation", e);
            }
          }

          // GEMINI CALL: 6s delay to respect free tier quota
          const now = Date.now();
          const timeSinceLastCall = now - lastCallTime;
          if (timeSinceLastCall < 6000) {
            await sleep(6000 - timeSinceLastCall);
          }

          try {
            const res = await axios.post(`${API}/meals/generate`, {
              meal_type,
              date: day.date,
              calories_target: user?.daily_calories || 2000,
              protein_target: user?.target_protein || 120,
              dietary_restrictions: dietaryRestrictions,
              planning_context: day,
              protein_bonus: adj.protein_bonus,
              calorie_bonus: adj.calorie_bonus,
              liked_meal_ids: likedIds,
              num_people: mealPrefs.num_people,
              allow_meat_fish: mealPrefs.allow_meat_fish,
              prefer_powdered_protein: mealPrefs.prefer_powdered_protein,
            }, { withCredentials: true });

            const generatedMeal = res.data;
            allGenerated.push(generatedMeal);
            setGeneratingCount(c => c + 1);
            lastCallTime = Date.now();

            if (isSynchronizable) {
              synchronizableCache[cacheKey] = generatedMeal;
            }
          } catch (err) {
            console.error(`Failed to generate ${meal_type} for ${day.date}`, err);
            if (err?.response?.status === 429) {
              toast.error('⏳ Quota Gemini épuisé. Réessaie plus tard.');
              throw err; // Stop the loop
            }
          }
        }
      }

      if (allGenerated.length > 0) {
        setMeals(prev => [...allGenerated, ...prev]);
        setGenerateDialogOpen(false);
        toast.success(`${allGenerated.length} repas générés avec succès !`);
      }
    } catch (error) {
      console.error('Error generating meals:', error);
    } finally {
      setIsGenerating(false);
      setGeneratingCount(0);
    }
  };


  const handleToggleFav = useCallback(async (mealId) => {
    try {
      const resp = await axios.post(`${API}/meals/${mealId}/favorite`, {}, { withCredentials: true });
      const { liked } = resp.data;
      setMeals(prev => prev.map(m => m.meal_id === mealId ? { ...m, liked } : m));
      toast.success(liked ? '❤️ Ajouté aux favoris' : 'Retiré des favoris');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  }, []);

  const handleAddMeal = async () => {
    try {
      const response = await axios.post(`${API}/meals`, newMeal, { withCredentials: true });
      setMeals(prev => [response.data, ...prev]);
      setAddDialogOpen(false);
      setNewMeal({
        name: '',
        meal_type: 'dejeuner',
        date: new Date().toISOString().split('T')[0],
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      });
      toast.success('Repas ajouté !');
    } catch (error) {
      console.error('Error adding meal:', error);
      toast.error('Erreur lors de l\'ajout du repas');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await axios.delete(`${API}/meals/${mealId}`, { withCredentials: true });
      setMeals(prev => prev.filter(m => m.meal_id !== mealId));
      toast.success('Repas supprimé');
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleLike = async (mealId) => {
    try {
      const resp = await axios.post(`${API}/meals/${mealId}/like`, {}, { withCredentials: true });
      const { liked } = resp.data;
      setMeals(prev => prev.map(m => m.meal_id === mealId ? { ...m, liked, disliked: !liked ? m.disliked : false } : m));
      toast.success("C'est noté ! L'IA s'en inspirera.");
    } catch (e) {
      toast.error('Erreur lors du Like');
    }
  };

  const handleDislike = async (mealId) => {
    try {
      const resp = await axios.post(`${API}/meals/${mealId}/dislike`, {}, { withCredentials: true });
      const { disliked } = resp.data;
      setMeals(prev => prev.map(m => m.meal_id === mealId ? { ...m, disliked, liked: !disliked ? m.liked : false } : m));
      toast.success("Repas exclu des prochaines suggestions.");
    } catch (e) {
      toast.error('Erreur lors du Dislike');
    }
  };

  const handleRegenerate = async (meal) => {
    if (regenerating.has(meal.meal_id)) return;

    setRegenerating(prev => new Set(prev).add(meal.meal_id));
    try {
      // Small safety delay for single regeneration too
      await new Promise(r => setTimeout(r, 1000));

      const res = await axios.post(`${API}/meals/generate`, {
        meal_type: meal.meal_type,
        date: meal.date,
        num_people: mealPrefs.num_people,
        allow_meat_fish: mealPrefs.allow_meat_fish,
        prefer_powdered_protein: mealPrefs.prefer_powdered_protein
      }, { withCredentials: true });

      const newMeal = res.data;
      // Replace the old meal with the new one in the list
      setMeals(prev => prev.map(m => m.meal_id === meal.meal_id ? newMeal : m));
      toast.success('Repas régénéré !');
    } catch (error) {
      console.error('Error regenerating meal:', error);
      if (error?.response?.status === 429) {
        toast.error('⏳ Quota Gemini épuisé. Réessaie dans une minute.');
      } else {
        toast.error('Erreur lors de la régénération');
      }
    } finally {
      setRegenerating(prev => {
        const next = new Set(prev);
        next.delete(meal.meal_id);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="meals-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            GÉNÉRATEUR DE <span className="text-[#6441a5]">REPAS</span>
          </h1>
          <p className="text-[#A1A1AA] mt-1 text-sm">Laissez l'IA créer vos repas personnalisés</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAiAnalysis}
            disabled={analyzing}
            className="border-[#6441a5]/50"
            data-testid="ai-analysis-btn"
          >
            {analyzing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Brain className="w-4 h-4 mr-2 text-[#6441a5]" />
            )}
            Analyse IA
          </Button>
          <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="brand" data-testid="generate-meals-btn">
                <Sparkles className="w-4 h-4 mr-2" />
                Générer un Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0A] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {generateMode === 'day' ? "Générer le Plan du Jour" : "Générer la Semaine"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {/* Global meal settings */}
                <div className="p-3 rounded border border-white/10 space-y-3">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Paramètres de génération</p>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <UsersRound className="w-4 h-4 text-zinc-400" />
                      Nombre de personnes
                    </label>
                    <input
                      type="number" min={1} max={10}
                      value={mealPrefs.num_people}
                      onChange={e => {
                        const v = { ...mealPrefs, num_people: parseInt(e.target.value) || 1 };
                        setMealPrefs(v); saveMealPrefs(v);
                      }}
                      className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-center"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <UtensilsCrossed className="w-4 h-4 text-zinc-400" />
                      Autoriser viande &amp; poisson
                    </label>
                    <button
                      onClick={() => {
                        const v = { ...mealPrefs, allow_meat_fish: !mealPrefs.allow_meat_fish };
                        setMealPrefs(v); saveMealPrefs(v);
                      }}
                      className={`w-9 h-5 rounded-full transition-colors ${mealPrefs.allow_meat_fish ? 'bg-[#B0E301]' : 'bg-zinc-700'}`}
                    >
                      <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${mealPrefs.allow_meat_fish ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Beef className="w-4 h-4 text-zinc-400" />
                      Proteines en poudre (Whey)
                    </label>
                    <button
                      onClick={() => {
                        const v = { ...mealPrefs, prefer_powdered_protein: !mealPrefs.prefer_powdered_protein };
                        setMealPrefs(v); saveMealPrefs(v);
                      }}
                      className={`w-9 h-5 rounded-full transition-colors ${mealPrefs.prefer_powdered_protein ? 'bg-[#6441a5]' : 'bg-zinc-700'}`}
                    >
                      <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${mealPrefs.prefer_powdered_protein ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Sparkles className="w-4 h-4 text-[#6441a5]" />
                      Générer pour toute la semaine
                    </label>
                    <button
                      onClick={() => setGenerateMode(m => m === 'day' ? 'week' : 'day')}
                      className={`w-9 h-5 rounded-full transition-colors ${generateMode === 'week' ? 'bg-[#6441a5]' : 'bg-zinc-700'}`}
                    >
                      <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${generateMode === 'week' ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'petit_dejeuner', label: 'Petit-déjeuner', emoji: '🌅' },
                    { type: 'dejeuner', label: 'Déjeuner', emoji: '☀️' },
                    { type: 'collation', label: 'Collation', emoji: '🍎' },
                    { type: 'diner', label: 'Dîner', emoji: '🌙' },
                  ].map(({ type, label, emoji }) => (
                    <div
                      key={type}
                      className="flex items-center gap-2 p-3 rounded-lg border"
                      style={{
                        backgroundColor: `${mealTypeColors[type]}10`,
                        borderColor: `${mealTypeColors[type]}30`,
                      }}
                    >
                      <span className="text-lg">{emoji}</span>
                      <span className="text-sm font-medium" style={{ color: mealTypeColors[type] }}>
                        {label}
                      </span>
                      {isGenerating && generatingCount > ['petit_dejeuner', 'dejeuner', 'collation', 'diner'].indexOf(type) ? (
                        <CheckCircle className="w-4 h-4 ml-auto" style={{ color: mealTypeColors[type] }} />
                      ) : isGenerating ? (
                        <RefreshCw className="w-3 h-3 ml-auto animate-spin text-zinc-500" />
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Goal + calorie info */}
                <div className="p-3 rounded bg-[#B0E301]/10 border border-[#B0E301]/30">
                  <p className="text-sm text-[#B0E301] font-medium mb-1">Objectif : {goalLabels[user?.goal] || 'Maintien'}</p>
                  <p className="text-xs text-[#A1A1AA]">
                    {user?.daily_calories || 2000} kcal · {user?.target_protein || 120}g protéines · adapté à ton planning du jour
                  </p>
                </div>

                {/* Progress bar while generating */}
                {isGenerating && (
                  <div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>Génération en cours…</span>
                      <span>{generatingCount} repas</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (generatingCount / (generateMode === 'day' ? 4 : 28)) * 100)}%`, backgroundColor: '#B0E301' }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3" variant="brand"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours ({generatingCount} repas)…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {generateMode === 'day' ? "Générer les 4 repas du jour" : "Générer le plan de la semaine"}
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Nutrition Score Section */}
      {nutritionScore && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" data-testid="nutrition-score-section">
          {/* Daily Score */}
          <Card className="card-stat col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#B0E301]" />
                  <span className="text-sm font-semibold">Score Aujourd'hui</span>
                </div>
                <div
                  className={`text-2xl font-bold ${nutritionScore.daily_score >= 80 ? 'text-[#B0E301]' :
                    nutritionScore.daily_score >= 50 ? 'text-[#FFD700]' : 'text-[#FF6B35]'
                    }`}
                >
                  {nutritionScore.daily_score}%
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#52525B]">Calories</span>
                    <span className="font-mono">{nutritionScore.today.calories}/{nutritionScore.today.calorie_target}</span>
                  </div>
                  <Progress
                    value={Math.min(nutritionScore.today.calorie_progress, 100)}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#52525B]">Protéines</span>
                    <span className="font-mono">{nutritionScore.today.protein}g/{nutritionScore.today.protein_target}g</span>
                  </div>
                  <Progress
                    value={Math.min(nutritionScore.today.protein_progress, 100)}
                    className="h-2"
                  />
                </div>
              </div>

              {/* Macro distribution */}
              <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
                <div className="text-center">
                  <p className="text-xs text-[#52525B]">Prot.</p>
                  <p className="text-sm font-mono text-[#B0E301]">{nutritionScore.today.macro_distribution.protein_pct}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#52525B]">Glucides</p>
                  <p className="text-sm font-mono text-[#6441a5]">{nutritionScore.today.macro_distribution.carbs_pct}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#52525B]">Lipides</p>
                  <p className="text-sm font-mono text-[#FFD700]">{nutritionScore.today.macro_distribution.fat_pct}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Stats */}
          <Card className="card-stat col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#00BFFF]" />
                <span className="text-sm font-semibold">Cette Semaine</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded bg-white/5 text-center">
                  <p className="text-2xl font-bold text-[#B0E301]">{nutritionScore.weekly_avg_score}%</p>
                  <p className="text-xs text-[#52525B]">Score Moyen</p>
                </div>
                <div className="p-3 rounded bg-white/5 text-center">
                  <p className="text-2xl font-bold">{nutritionScore.week_stats.days_tracked}</p>
                  <p className="text-xs text-[#52525B]">Jours Suivis</p>
                </div>
                <div className="p-3 rounded bg-white/5 text-center">
                  <p className="text-2xl font-bold text-[#FFD700]">{nutritionScore.week_stats.days_calorie_target}</p>
                  <p className="text-xs text-[#52525B]">Obj. Calories</p>
                </div>
                <div className="p-3 rounded bg-white/5 text-center">
                  <p className="text-2xl font-bold text-[#FF6B35]">{nutritionScore.week_stats.days_protein_target}</p>
                  <p className="text-xs text-[#52525B]">Obj. Protéines</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Badges */}
          <Card className="card-stat col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-[#FFD700]" />
                <span className="text-sm font-semibold">Badges Nutrition</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nutritionScore.badges?.slice(0, 4).map(badge => {
                  const progress = Math.min((badge.progress / badge.threshold) * 100, 100);

                  return (
                    <div
                      key={badge.id}
                      className={`p-2 rounded-lg border transition-all ${badge.is_unlocked
                        ? badge.is_claimed
                          ? 'bg-white/5 border-white/20'
                          : 'bg-[#B0E301]/10 border-[#B0E301]/30'
                        : 'border-white/5 opacity-60'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{badge.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold truncate">{badge.name}</p>
                            <span className="text-[10px] text-[#B0E301] font-mono">+{badge.xp} XP</span>
                          </div>
                          {!badge.is_unlocked && (
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={progress} className="h-1 flex-1" />
                              <span className="text-[10px] text-[#52525B]">{badge.progress}/{badge.threshold}</span>
                            </div>
                          )}
                        </div>
                        {badge.is_unlocked && !badge.is_claimed && badge.can_claim && (
                          <Button
                            size="sm"
                            onClick={() => handleClaimBadge(badge.id)}
                            disabled={claimingBadge === badge.id}
                            className="h-6 text-[10px] px-2 bg-[#B0E301] text-black md:hover:bg-[#B0E301]/80 active:bg-[#B0E301]"
                          >
                            {claimingBadge === badge.id ? '...' : 'Réclamer'}
                          </Button>
                        )}
                        {badge.is_unlocked && badge.is_claimed && (
                          <Check className="w-4 h-4 text-[#B0E301]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Generation Card */}
      <Card className="ai-card" data-testid="ai-generation-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-[#6441a5]/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#6441a5]" />
                </div>
                <span className="tag tag-purple">Propulsé par IA</span>
              </div>
              <h2 className="text-xl font-bold mb-2">GÉNÉRATION INTELLIGENTE</h2>
              <p className="text-[#A1A1AA] text-sm">
                Notre IA analyse vos objectifs, préférences alimentaires et planning sportif
                pour créer des repas parfaitement adaptés à vos besoins.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-3 rounded bg-white/5 border border-white/10">
                <p className="text-xs text-[#52525B] mb-1">Objectif Calorique</p>
                <p className="font-mono font-bold text-lg">{user?.daily_calories || 2000} kcal</p>
              </div>
              <div className="px-4 py-3 rounded bg-white/5 border border-white/10">
                <p className="text-xs text-[#52525B] mb-1">Protéines Cible</p>
                <p className="font-mono font-bold text-lg">{user?.target_protein || 120}g</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Manual Meal Button */}
      <div className="flex justify-end">
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-white/10" data-testid="add-manual-meal-btn">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter manuellement
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0A] border-white/10">
            <DialogHeader>
              <DialogTitle>Ajouter un Repas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Nom du repas</Label>
                <Input
                  value={newMeal.name}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Poulet grillé et légumes"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Type de repas</Label>
                <Select
                  value={newMeal.meal_type}
                  onValueChange={(v) => setNewMeal(prev => ({ ...prev, meal_type: v }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petit_dejeuner">Petit-déjeuner</SelectItem>
                    <SelectItem value="dejeuner">Déjeuner</SelectItem>
                    <SelectItem value="collation">Collation</SelectItem>
                    <SelectItem value="diner">Dîner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Calories</Label>
                  <Input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Protéines (g)</Label>
                  <Input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, protein: parseInt(e.target.value) || 0 }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Glucides (g)</Label>
                  <Input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, carbs: parseInt(e.target.value) || 0 }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Lipides (g)</Label>
                  <Input
                    type="number"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, fat: parseInt(e.target.value) || 0 }))}
                    className="mt-2"
                  />
                </div>
              </div>
              <Button onClick={handleAddMeal} variant="brand" className="w-full">
                Ajouter le repas
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meals Grid */}
      <div>
        {/* Favorites / All tabs */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold flex-1">REPAS SUGGÉRÉS</h2>
          <button
            onClick={() => setFavoritesOnly(false)}
            className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${!favoritesOnly
              ? 'bg-[#6441a520] text-[#a78bfa] border border-[#6441a540]'
              : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Tous ({meals.length})
          </button>
          <button
            onClick={() => setFavoritesOnly(true)}
            className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${favoritesOnly
              ? 'bg-[#ff4b6e20] text-[#ff4b6e] border border-[#ff4b6e40]'
              : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-[#ff4b6e]' : ''}`} />
            Favoris ({meals.filter(m => m.liked).length})
          </button>
        </div>
        {(favoritesOnly ? meals.filter(m => m.liked) : meals).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(favoritesOnly ? meals.filter(m => m.liked) : meals).map((meal) => (
              <Card
                key={meal.meal_id}
                className="card-stat overflow-hidden hover:border-[#6441a5]/50 transition-colors cursor-pointer"
                onClick={() => setSelectedMeal(meal)}
                data-testid={`meal-card-${meal.meal_id}`}
              >
                {/* Meal Image */}
                {meal.image_url && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={meal.image_url}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor: `${mealTypeColors[meal.meal_type]}20`,
                          color: mealTypeColors[meal.meal_type],
                          borderColor: `${mealTypeColors[meal.meal_type]}40`
                        }}
                      >
                        {mealTypeLabels[meal.meal_type]}
                      </Badge>
                      {meal.ai_generated && (
                        <Badge className="bg-[#6441a5]/20 text-[#6441a5] border-[#6441a5]/40 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          IA
                        </Badge>
                      )}
                    </div>
                    {meal.prep_time && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded bg-black/60 text-xs">
                        <Clock className="w-3 h-3" />
                        {meal.prep_time} min
                      </div>
                    )}
                  </div>
                )}

                <CardContent className={`p-4 ${!meal.image_url ? 'border-l-4' : ''}`} style={{ borderLeftColor: !meal.image_url ? mealTypeColors[meal.meal_type] : 'transparent' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      {!meal.image_url && (
                        <Badge
                          className="mb-2 text-xs"
                          style={{
                            backgroundColor: `${mealTypeColors[meal.meal_type]}20`,
                            color: mealTypeColors[meal.meal_type]
                          }}
                        >
                          {mealTypeLabels[meal.meal_type]}
                        </Badge>
                      )}
                      <h3 className="font-bold text-base">{meal.name}</h3>
                      {meal.description && (
                        <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-2">{meal.description}</p>
                      )}
                      {meal.goal && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-[#B0E301]/10 text-[#B0E301] border border-[#B0E301]/20">
                          {goalLabels[meal.goal] || meal.goal}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 -mt-1 -mr-2">
                      {/* Favorite heart button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFav(meal.meal_id);
                        }}
                        title={meal.liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${meal.liked
                            ? 'fill-[#ff4b6e] text-[#ff4b6e]'
                            : 'text-zinc-600 hover:text-[#ff4b6e]'
                            }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#FF3333] hover:text-[#FF3333] hover:bg-[#FF3333]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMeal(meal.meal_id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <NutrientBadge icon={Flame} value={meal.calories} label="kcal" color="#FF3333" />
                    <NutrientBadge icon={Beef} value={`${meal.protein}g`} label="Prot" color="#B0E301" />
                    <NutrientBadge icon={Wheat} value={`${meal.carbs}g`} label="Carbs" color="#6441a5" />
                    <NutrientBadge icon={Droplet} value={`${meal.fat}g`} label="Fat" color="#FFD600" />
                  </div>

                  {/* Ma Portion */}
                  {meal.ma_portion && (
                    <div className="mt-2 p-2 rounded bg-[#6441a5]/10 border border-[#6441a5]/20">
                      <p className="text-[10px] font-semibold text-[#a78bfa] mb-0.5">🍽️ Votre portion</p>
                      <p className="text-xs text-zinc-300">{meal.ma_portion}</p>
                    </div>
                  )}

                  {/* Like / Dislike / Regenerate actions */}
                  <div className="flex gap-1 mt-3 pt-2 border-t border-white/5">
                    <button
                      onClick={e => { e.stopPropagation(); handleLike(meal.meal_id); }}
                      title="J'aime — servira d'inspiration"
                      className={`flex items-center gap-1.5 flex-1 justify-center py-1.5 px-2 rounded text-xs font-medium transition-all ${meal.liked ? 'bg-[#B0E301]/20 text-[#B0E301] border border-[#B0E301]/30' : 'text-zinc-500 hover:text-[#B0E301] hover:bg-[#B0E301]/10'
                        }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${meal.liked ? 'fill-[#B0E301]' : ''}`} />
                      J'aime
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDislike(meal.meal_id); }}
                      title="J'aime pas — exclu des futures générations"
                      className={`flex items-center gap-1.5 flex-1 justify-center py-1.5 px-2 rounded text-xs font-medium transition-all ${meal.disliked ? 'bg-red-900/20 text-red-400 border border-red-800/30' : 'text-zinc-500 hover:text-red-400 hover:bg-red-900/10'
                        }`}
                    >
                      <ThumbsDown className={`w-3.5 h-3.5 ${meal.disliked ? 'fill-red-400' : ''}`} />
                      J'aime pas
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleRegenerate(meal); }}
                      disabled={regenerating.has(meal.meal_id)}
                      title="Régénérer ce repas"
                      className="flex items-center gap-1.5 flex-1 justify-center py-1.5 px-2 rounded text-xs font-medium text-zinc-500 hover:text-[#6441a5] hover:bg-[#6441a5]/10 disabled:opacity-50 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${regenerating.has(meal.meal_id) ? 'animate-spin' : ''}`} />
                      Regénérer
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-stat">
            <CardContent className="p-12 text-center">
              {favoritesOnly ? (
                <>
                  <Heart className="w-12 h-12 text-[#52525B] mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Aucun favori pour l'instant</h3>
                  <p className="text-[#A1A1AA] mb-4">Cliquez sur ❤️ sur vos repas préférés pour les retrouver ici</p>
                  <Button variant="outline" onClick={() => setFavoritesOnly(false)} className="border-white/10">
                    Voir tous les repas
                  </Button>
                </>
              ) : (
                <>
                  <Sparkles className="w-12 h-12 text-[#52525B] mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Aucun repas enregistré</h3>
                  <p className="text-[#A1A1AA] mb-6">Générez votre premier repas avec l'IA ou ajoutez-en un manuellement</p>
                  <Button onClick={() => setGenerateDialogOpen(true)} variant="brand">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer un repas
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* ═══ FAVORITES PLAN BUILDER ═══ */}
        {favoritesOnly && meals.filter(m => m.liked).length > 0 && (
          <Card className="card-stat">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <ScrollText className="w-4 h-4 text-[#6441a5]" />
                <h3 className="text-sm font-bold">PLAN DU JOUR — Composer depuis vos favoris</h3>
                <span className="ml-auto text-xs text-zinc-500">Glissez un favori dans chaque slot</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['petit_dejeuner', 'dejeuner', 'collation', 'diner'].map(type => {
                  const mealTypeEmojis = { petit_dejeuner: '🌅', dejeuner: '☀️', collation: '🍎', diner: '🌙' };
                  const slot = planDaySlots[type];
                  return (
                    <div key={type} className="p-3 rounded-lg border" style={{ backgroundColor: `${mealTypeColors[type]}08`, borderColor: `${mealTypeColors[type]}30` }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: mealTypeColors[type] }}>
                        {mealTypeEmojis[type]} {mealTypeLabels[type]}
                      </p>
                      {slot ? (
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium line-clamp-1">{slot.name}</p>
                            <p className="text-[10px] text-zinc-500">{slot.calories} kcal · {slot.protein}g prot.</p>
                          </div>
                          <button onClick={() => setPlanDaySlots(prev => { const p = { ...prev }; delete p[type]; return p; })} className="text-zinc-600 hover:text-red-400 text-xs ml-1">✕</button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-600">Sélectionnez un favori ci-dessous</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {meals.filter(m => m.liked).map(meal => (
                  <div key={meal.meal_id} className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/8 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{meal.name}</p>
                      <p className="text-[10px] text-zinc-500">
                        <span style={{ color: mealTypeColors[meal.meal_type] }}>{mealTypeLabels[meal.meal_type]}</span>
                        {' · '}{meal.calories} kcal · {meal.protein}g prot.
                      </p>
                    </div>
                    <button
                      onClick={() => handleUseFavoriteInPlan(meal)}
                      className="ml-2 text-xs px-2 py-1 rounded bg-[#6441a5]/20 text-[#a78bfa] hover:bg-[#6441a5]/30 transition-colors"
                    >
                      Planifier
                    </button>
                  </div>
                ))}
              </div>
              {Object.keys(planDaySlots).length > 0 && (
                <Button onClick={handleSavePlanDay} disabled={savingPlan} variant="brand" className="w-full">
                  {savingPlan ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Enregistrer le plan du jour ({Object.keys(planDaySlots).length} repas)
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Meal Detail Dialog */}
      <Dialog open={!!selectedMeal} onOpenChange={() => setSelectedMeal(null)}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {selectedMeal && (
            <>
              {/* Meal Image Header */}
              {selectedMeal.image_url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={selectedMeal.image_url}
                    alt={selectedMeal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                </div>
              )}

              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">{selectedMeal.name}</DialogTitle>
                  {selectedMeal.description && (
                    <p className="text-sm text-[#A1A1AA] mt-1">{selectedMeal.description}</p>
                  )}
                  {/* Meta badges: origin, times, servings */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedMeal.country_of_origin && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                        <MapPin className="w-3 h-3" />{selectedMeal.country_of_origin}
                      </span>
                    )}
                    {selectedMeal.prep_time && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                        <Clock className="w-3 h-3" />Prep: {selectedMeal.prep_time} min
                      </span>
                    )}
                    {selectedMeal.cook_time && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                        <ChefHat className="w-3 h-3" />Cuisson: {selectedMeal.cook_time} min
                      </span>
                    )}
                    {selectedMeal.num_people && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                        <UsersRound className="w-3 h-3" />{selectedMeal.num_people} personne{selectedMeal.num_people > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  {/* Goal badge */}
                  {selectedMeal.goal && (
                    <div className="flex items-center gap-2">
                      <span className="tag tag-green">
                        🎯 {goalLabels[selectedMeal.goal] || selectedMeal.goal}
                      </span>
                      {selectedMeal.ai_generated && (
                        <span className="tag tag-purple">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Généré par IA
                        </span>
                      )}
                    </div>
                  )}

                  {/* Nutrition grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded bg-white/5 text-center">
                      <Flame className="w-5 h-5 text-[#FF3333] mx-auto mb-1" />
                      <p className="font-mono font-bold">{selectedMeal.calories}</p>
                      <p className="text-xs text-[#52525B]">kcal/pers.</p>
                    </div>
                    <div className="p-3 rounded bg-white/5 text-center">
                      <Beef className="w-5 h-5 text-[#B0E301] mx-auto mb-1" />
                      <p className="font-mono font-bold">{selectedMeal.protein}g</p>
                      <p className="text-xs text-[#52525B]">Protéines</p>
                    </div>
                    <div className="p-3 rounded bg-white/5 text-center">
                      <Wheat className="w-5 h-5 text-[#6441a5] mx-auto mb-1" />
                      <p className="font-mono font-bold">{selectedMeal.carbs}g</p>
                      <p className="text-xs text-[#52525B]">Glucides</p>
                    </div>
                    <div className="p-3 rounded bg-white/5 text-center">
                      <Droplet className="w-5 h-5 text-[#FFD600] mx-auto mb-1" />
                      <p className="font-mono font-bold">{selectedMeal.fat}g</p>
                      <p className="text-xs text-[#52525B]">Lipides</p>
                    </div>
                  </div>

                  {/* Ma portion */}
                  {selectedMeal.ma_portion && (
                    <div className="p-3 rounded-lg bg-[#6441a5]/10 border border-[#6441a5]/20">
                      <p className="text-xs font-bold text-[#a78bfa] mb-1">🍽️ Votre portion individuelle</p>
                      <p className="text-sm text-zinc-300">{selectedMeal.ma_portion}</p>
                    </div>
                  )}

                  {/* Ingredients */}
                  {selectedMeal.ingredients && selectedMeal.ingredients.length > 0 && (
                    <div>
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-[#B0E301]" />
                        Ingrédients {selectedMeal.num_people > 1 ? `(pour ${selectedMeal.num_people} personnes)` : ''}
                      </h4>
                      <ul className="space-y-1">
                        {selectedMeal.ingredients.map((ing, i) => (
                          <li key={i} className="text-sm text-[#A1A1AA] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#B0E301] shrink-0" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recipe */}
                  {selectedMeal.recipe && (
                    <div>
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <ScrollText className="w-4 h-4 text-[#6441a5]" />
                        Étapes de préparation
                      </h4>
                      <div className="space-y-2">
                        {selectedMeal.recipe.split(/\n/).filter(l => l.trim()).map((line, i) => (
                          <p key={i} className="text-sm text-[#A1A1AA] leading-relaxed">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Savings / reuse tip */}
                  {selectedMeal.conseils_reutilisation && (
                    <div className="p-3 rounded-lg bg-[#B0E301]/5 border border-[#B0E301]/20">
                      <p className="text-xs font-bold text-[#B0E301] mb-1 flex items-center gap-1">
                        <Recycle className="w-3.5 h-3.5" />Conseil économies &amp; restes
                      </p>
                      <p className="text-sm text-zinc-300">{selectedMeal.conseils_reutilisation}</p>
                    </div>
                  )}

                  {/* Nutritional notes */}
                  {selectedMeal.notes && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5" />Note nutritionnelle
                      </p>
                      <p className="text-sm text-zinc-300">{selectedMeal.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Analysis Dialog */}
      <Dialog open={analysisDialogOpen} onOpenChange={setAnalysisDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#6441a5]" />
              Analyse Nutritionnelle IA
            </DialogTitle>
          </DialogHeader>

          {aiAnalysis && (
            <div className="space-y-6 pt-4">
              {/* Score */}
              <div className="text-center p-6 rounded-lg bg-gradient-to-b from-white/5 to-transparent">
                <p className="text-sm text-[#52525B] mb-2">Score Global</p>
                <p className={`text-5xl font-bold ${aiAnalysis.analysis.score >= 80 ? 'text-[#B0E301]' :
                  aiAnalysis.analysis.score >= 50 ? 'text-[#FFD700]' : 'text-[#FF6B35]'
                  }`}>
                  {aiAnalysis.analysis.score}%
                </p>
                <p className="text-xs text-[#52525B] mt-2">
                  Basé sur {aiAnalysis.stats.days_tracked} jours et {aiAnalysis.stats.total_meals} repas
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded bg-white/5 text-center">
                  <p className="text-lg font-bold text-[#FF6B35]">{aiAnalysis.stats.avg_calories}</p>
                  <p className="text-xs text-[#52525B]">Cal/jour</p>
                </div>
                <div className="p-3 rounded bg-white/5 text-center">
                  <p className="text-lg font-bold text-[#B0E301]">{aiAnalysis.stats.avg_protein}g</p>
                  <p className="text-xs text-[#52525B]">Prot/jour</p>
                </div>
                <div className="p-3 rounded bg-white/5 text-center">
                  <p className="text-lg font-bold text-[#6441a5]">{aiAnalysis.stats.avg_carbs}g</p>
                  <p className="text-xs text-[#52525B]">Gluc/jour</p>
                </div>
                <div className="p-3 rounded bg-white/5 text-center">
                  <p className="text-lg font-bold text-[#FFD700]">{aiAnalysis.stats.avg_fat}g</p>
                  <p className="text-xs text-[#52525B]">Lip/jour</p>
                </div>
              </div>

              {/* Strengths */}
              {aiAnalysis.analysis.strengths?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-[#B0E301]" />
                    Points Forts
                  </h4>
                  <ul className="space-y-2">
                    {aiAnalysis.analysis.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                        <Check className="w-4 h-4 text-[#B0E301] mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {aiAnalysis.analysis.improvements?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-[#FFD700]" />
                    Axes d'Amélioration
                  </h4>
                  <ul className="space-y-2">
                    {aiAnalysis.analysis.improvements.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                        <Target className="w-4 h-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meal Suggestions */}
              {aiAnalysis.analysis.meal_suggestions?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-[#6441a5]" />
                    Suggestions de Repas
                  </h4>
                  <div className="space-y-2">
                    {aiAnalysis.analysis.meal_suggestions.map((meal, i) => (
                      <div key={i} className="p-3 rounded bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className="text-xs" style={{
                            backgroundColor: `${mealTypeColors[meal.meal_type] || '#6441a5'}20`,
                            color: mealTypeColors[meal.meal_type] || '#6441a5'
                          }}>
                            {mealTypeLabels[meal.meal_type] || meal.meal_type}
                          </Badge>
                          <span className="text-xs text-[#A1A1AA]">
                            {meal.calories} kcal · {meal.protein}g prot
                          </span>
                        </div>
                        <p className="text-sm">{meal.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {aiAnalysis.analysis.tips?.length > 0 && (
                <div className="p-4 rounded-lg bg-[#6441a5]/10 border border-[#6441a5]/30">
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#6441a5]" />
                    Conseils Personnalisés
                  </h4>
                  <ul className="space-y-2">
                    {aiAnalysis.analysis.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                        <span className="text-[#6441a5]">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
