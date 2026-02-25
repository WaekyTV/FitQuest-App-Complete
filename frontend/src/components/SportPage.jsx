import { useState, useEffect } from 'react';
import {
  Plus,
  Dumbbell,
  Timer,
  Flame,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Play,
  X,
  ExternalLink,
  Zap,
  Copy,
  Edit2,
  Trash2,
  Youtube,
  Settings,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const categoryLabels = {
  chest: 'Pectoraux',
  back: 'Dos',
  legs: 'Jambes',
  shoulders: 'Épaules',
  arms: 'Bras',
  core: 'Abdos',
  cardio: 'Cardio'
};

const difficultyColors = {
  'débutant': 'bg-green-500/20 text-green-400 border-green-500/30',
  'intermédiaire': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'avancé': 'bg-red-500/20 text-red-400 border-red-500/30'
};

// Composant pour configurer un intervalle cardio
const CardioIntervalConfig = ({ interval, onChange, onRemove, index }) => {
  return (
    <div className="p-3 rounded bg-white/5 border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#B0E301]">Intervalle {index + 1}</span>
        <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-400 h-6 w-6 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Durée (min)</Label>
          <Input
            type="number"
            min="1"
            value={interval.duration_minutes}
            onChange={(e) => onChange({ ...interval, duration_minutes: parseInt(e.target.value) || 1 })}
            className="mt-1 h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Intensité (1-10)</Label>
          <div className="flex gap-1 mt-1">
            <Input
              type="number"
              min="1"
              max="10"
              value={interval.intensity_min}
              onChange={(e) => onChange({ ...interval, intensity_min: parseInt(e.target.value) || 1 })}
              className="h-8 text-sm w-16"
              placeholder="Min"
            />
            <span className="self-center text-xs text-[#52525B]">à</span>
            <Input
              type="number"
              min="1"
              max="10"
              value={interval.intensity_max}
              onChange={(e) => onChange({ ...interval, intensity_max: parseInt(e.target.value) || 1 })}
              className="h-8 text-sm w-16"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
      <div>
        <Label className="text-xs">Description</Label>
        <Input
          value={interval.description || ''}
          onChange={(e) => onChange({ ...interval, description: e.target.value })}
          placeholder="Ex: Effort intense"
          className="mt-1 h-8 text-sm"
        />
      </div>
    </div>
  );
};

// Composant pour une ronde de cardio
const CardioRoundConfig = ({ round, roundIndex, onChange, onRemove, onDuplicate }) => {
  const addInterval = () => {
    const newIntervals = [...round.intervals, {
      duration_minutes: 3,
      intensity_min: 5,
      intensity_max: 7,
      description: 'Effort modéré'
    }];
    onChange({ ...round, intervals: newIntervals });
  };

  const updateInterval = (intervalIndex, updatedInterval) => {
    const newIntervals = [...round.intervals];
    newIntervals[intervalIndex] = updatedInterval;
    onChange({ ...round, intervals: newIntervals });
  };

  const removeInterval = (intervalIndex) => {
    const newIntervals = round.intervals.filter((_, i) => i !== intervalIndex);
    onChange({ ...round, intervals: newIntervals });
  };

  const totalDuration = round.intervals.reduce((acc, int) => acc + (int.duration_minutes || 0), 0) + (round.recovery_minutes || 0);

  return (
    <div className="p-4 rounded-lg bg-[#6441a5]/10 border border-[#6441a5]/30 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#6441a5]" />
          <span className="font-bold">Ronde {roundIndex + 1}</span>
          <Badge className="bg-[#6441a5]/20 text-[#6441a5] text-xs">
            {totalDuration} min
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onDuplicate} className="h-7 w-7 p-0">
            <Copy className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 w-7 p-0 text-red-400">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Répétitions de la séquence</Label>
          <Input
            type="number"
            min="1"
            value={round.repeat_count || 1}
            onChange={(e) => onChange({ ...round, repeat_count: parseInt(e.target.value) || 1 })}
            className="mt-1 h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Récupération après (min)</Label>
          <Input
            type="number"
            min="0"
            value={round.recovery_minutes || 0}
            onChange={(e) => onChange({ ...round, recovery_minutes: parseInt(e.target.value) || 0 })}
            className="mt-1 h-8 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-[#A1A1AA]">Intervalles</Label>
          <Button variant="ghost" size="sm" onClick={addInterval} className="h-6 text-xs text-[#B0E301]">
            <Plus className="w-3 h-3 mr-1" /> Intervalle
          </Button>
        </div>
        {round.intervals.map((interval, idx) => (
          <CardioIntervalConfig
            key={idx}
            index={idx}
            interval={interval}
            onChange={(updated) => updateInterval(idx, updated)}
            onRemove={() => removeInterval(idx)}
          />
        ))}
      </div>
    </div>
  );
};

// Composant pour configurer un exercice (musculation ou cardio)
const ExerciseConfigDialog = ({ exercise, isCardio, onSave, onClose }) => {
  const [config, setConfig] = useState(() => {
    if (exercise.exercise_type === 'cardio' || isCardio) {
      return {
        exercise_type: 'cardio',
        total_duration_minutes: exercise.total_duration_minutes || 50,
        warmup_minutes: exercise.warmup_minutes || 5,
        cooldown_minutes: exercise.cooldown_minutes || 5,
        rounds: exercise.rounds || [{
          repeat_count: 1,
          recovery_minutes: 5,
          intervals: [
            { duration_minutes: 3, intensity_min: 5, intensity_max: 7, description: 'Effort modéré' },
            { duration_minutes: 1, intensity_min: 8, intensity_max: 10, description: 'Effort intense' }
          ]
        }],
        notes: exercise.notes || ''
      };
    } else {
      return {
        exercise_type: 'strength',
        sets: exercise.sets || 3,
        reps: exercise.reps || '10-12',
        weight: exercise.weight || null,
        rest_seconds: exercise.rest_seconds || 60,
        notes: exercise.notes || ''
      };
    }
  });

  const addRound = () => {
    setConfig(prev => ({
      ...prev,
      rounds: [...prev.rounds, {
        repeat_count: 1,
        recovery_minutes: 5,
        intervals: [
          { duration_minutes: 3, intensity_min: 5, intensity_max: 7, description: 'Effort modéré' },
          { duration_minutes: 1, intensity_min: 8, intensity_max: 10, description: 'Effort intense' }
        ]
      }]
    }));
  };

  const updateRound = (index, updatedRound) => {
    const newRounds = [...config.rounds];
    newRounds[index] = updatedRound;
    setConfig(prev => ({ ...prev, rounds: newRounds }));
  };

  const removeRound = (index) => {
    setConfig(prev => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index)
    }));
  };

  const duplicateRound = (index) => {
    const roundToDuplicate = { ...config.rounds[index] };
    setConfig(prev => ({
      ...prev,
      rounds: [...prev.rounds, JSON.parse(JSON.stringify(roundToDuplicate))]
    }));
  };

  const calculateTotalDuration = () => {
    if (config.exercise_type !== 'cardio') return 0;
    let total = (config.warmup_minutes || 0) + (config.cooldown_minutes || 0);
    config.rounds?.forEach(round => {
      const roundDuration = round.intervals.reduce((acc, int) => acc + (int.duration_minutes || 0), 0);
      total += (roundDuration * (round.repeat_count || 1)) + (round.recovery_minutes || 0);
    });
    return total;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h3 className="font-bold">{exercise.name}</h3>
        <Badge className={difficultyColors[exercise.difficulty] || 'bg-gray-500/20'}>
          {exercise.difficulty}
        </Badge>
      </div>

      {config.exercise_type === 'cardio' ? (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {/* Durée totale calculée */}
            <div className="p-3 rounded bg-[#B0E301]/10 border border-[#B0E301]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm">Durée totale estimée</span>
                <span className="font-mono font-bold text-[#B0E301]">{calculateTotalDuration()} min</span>
              </div>
            </div>

            {/* Échauffement et retour au calme */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Échauffement (min)</Label>
                <Input
                  type="number"
                  min="0"
                  value={config.warmup_minutes}
                  onChange={(e) => setConfig(prev => ({ ...prev, warmup_minutes: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Retour au calme (min)</Label>
                <Input
                  type="number"
                  min="0"
                  value={config.cooldown_minutes}
                  onChange={(e) => setConfig(prev => ({ ...prev, cooldown_minutes: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Rondes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[#A1A1AA]">Rondes d'intervalle</Label>
                <Button variant="outline" size="sm" onClick={addRound} className="border-[#6441a5] text-[#6441a5]">
                  <Plus className="w-3 h-3 mr-1" /> Ajouter Ronde
                </Button>
              </div>

              {config.rounds?.map((round, idx) => (
                <CardioRoundConfig
                  key={idx}
                  round={round}
                  roundIndex={idx}
                  onChange={(updated) => updateRound(idx, updated)}
                  onRemove={() => removeRound(idx)}
                  onDuplicate={() => duplicateRound(idx)}
                />
              ))}
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={config.notes}
                onChange={(e) => setConfig(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes supplémentaires..."
                className="mt-1"
              />
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Séries</Label>
              <Input
                type="number"
                min="1"
                value={config.sets}
                onChange={(e) => setConfig(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Répétitions</Label>
              <Input
                value={config.reps}
                onChange={(e) => setConfig(prev => ({ ...prev, reps: e.target.value }))}
                placeholder="Ex: 10-12"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Poids (kg)</Label>
              <Input
                type="number"
                value={config.weight || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, weight: e.target.value ? parseFloat(e.target.value) : null }))}
                placeholder="Optionnel"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Repos (secondes)</Label>
              <Input
                type="number"
                min="0"
                value={config.rest_seconds}
                onChange={(e) => setConfig(prev => ({ ...prev, rest_seconds: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={config.notes}
              onChange={(e) => setConfig(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes supplémentaires..."
              className="mt-1"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Annuler
        </Button>
        <Button onClick={() => onSave(config)} variant="brand" className="flex-1">
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export const SportPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [configExercise, setConfigExercise] = useState(null);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null);

  // Recherche d'exercices
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryCategory, setLibraryCategory] = useState('all');
  const [libraryDifficulty, setLibraryDifficulty] = useState('all');

  const [newWorkout, setNewWorkout] = useState({
    name: '',
    workout_type: 'upper',
    exercises: [],
    scheduled_date: '',
    duration_minutes: 45,
    intensity: 'moyenne'
  });

  const [logData, setLogData] = useState({
    duration_minutes: 45,
    calories_burned: 300,
    exercises_completed: [],
    difficulty_rating: 'moyen',
    notes: ''
  });

  // Recherche d'exercices
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const params = new URLSearchParams({ q: query, limit: '20' });
      if (libraryCategory !== 'all') params.append('category', libraryCategory);
      if (libraryDifficulty !== 'all') params.append('difficulty', libraryDifficulty);

      const res = await axios.get(`${API}/exercises/search/query?${params}`, { withCredentials: true });
      setSearchResults(res.data.exercises);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Filtrer les exercices pour la bibliothèque
  const getFilteredExercises = () => {
    let filtered = exercises;
    if (libraryCategory !== 'all') {
      filtered = filtered.filter(e => e.category === libraryCategory);
    }
    if (libraryDifficulty !== 'all') {
      filtered = filtered.filter(e => e.difficulty === libraryDifficulty);
    }
    if (searchQuery && searchQuery.length >= 2) {
      return searchResults;
    }
    return filtered;
  };

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  function getWeekDates() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workoutsRes, logsRes, exercisesRes] = await Promise.all([
        axios.get(`${API}/workouts`, { withCredentials: true }),
        axios.get(`${API}/workout-logs`, { withCredentials: true }),
        axios.get(`${API}/exercises`, { withCredentials: true })
      ]);
      setWorkouts(workoutsRes.data);
      setWorkoutLogs(logsRes.data);
      setExercises(exercisesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = async () => {
    if (!newWorkout.name || newWorkout.exercises.length === 0) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await axios.post(`${API}/workouts`, newWorkout, { withCredentials: true });
      setWorkouts(prev => [response.data, ...prev]);
      setCreateDialogOpen(false);
      setNewWorkout({
        name: '',
        workout_type: 'upper',
        exercises: [],
        scheduled_date: '',
        duration_minutes: 45,
        intensity: 'moyenne'
      });
      toast.success('Séance créée !');
    } catch (error) {
      console.error('Error creating workout:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const handleLogWorkout = async () => {
    if (!selectedWorkout) return;

    try {
      await axios.post(`${API}/workout-logs`, {
        ...logData,
        workout_id: selectedWorkout.workout_id,
        date: formatDate(new Date())
      }, { withCredentials: true });

      await fetchData();
      setSummaryDialogOpen(false);
      setSelectedWorkout(null);
      toast.success('Séance enregistrée !');
    } catch (error) {
      console.error('Error logging workout:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  // Ouvre la config quand on ajoute un exercice
  const handleSelectExercise = (exercise) => {
    setConfigExercise(exercise);
    setEditingExerciseIndex(null);
  };

  // Sauvegarde la config de l'exercice
  const handleSaveExerciseConfig = (config) => {
    const workoutExercise = {
      exercise_id: configExercise.exercise_id,
      name: configExercise.name,
      category: configExercise.category,
      ...config
    };

    if (editingExerciseIndex !== null) {
      // Modification
      setNewWorkout(prev => {
        const newExercises = [...prev.exercises];
        newExercises[editingExerciseIndex] = workoutExercise;
        return { ...prev, exercises: newExercises };
      });
      toast.success('Exercice modifié');
    } else {
      // Ajout
      setNewWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, workoutExercise]
      }));
      toast.success('Exercice ajouté');
    }

    setConfigExercise(null);
    setEditingExerciseIndex(null);
    setExerciseDialogOpen(false);
  };

  const editExerciseInWorkout = (index) => {
    const exercise = newWorkout.exercises[index];
    const fullExercise = exercises.find(e => e.exercise_id === exercise.exercise_id) || exercise;
    setConfigExercise({ ...fullExercise, ...exercise });
    setEditingExerciseIndex(index);
  };

  const removeExerciseFromWorkout = (index) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const duplicateExerciseInWorkout = (index) => {
    const exerciseToDuplicate = { ...newWorkout.exercises[index] };
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, JSON.parse(JSON.stringify(exerciseToDuplicate))]
    }));
    toast.success('Exercice dupliqué');
  };

  // Calcule la durée totale d'un exercice
  const getExerciseDurationDisplay = (exercise) => {
    if (exercise.exercise_type === 'cardio') {
      let total = (exercise.warmup_minutes || 0) + (exercise.cooldown_minutes || 0);
      exercise.rounds?.forEach(round => {
        const roundDuration = round.intervals?.reduce((acc, int) => acc + (int.duration_minutes || 0), 0) || 0;
        total += (roundDuration * (round.repeat_count || 1)) + (round.recovery_minutes || 0);
      });
      return `${total} min`;
    } else {
      return `${exercise.sets || 3} × ${exercise.reps || '10-12'}`;
    }
  };

  const weekDates = getWeekDates();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getWorkoutForDate = (date) => {
    const dateStr = formatDate(date);
    return workouts.find(w => w.scheduled_date === dateStr);
  };

  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter(e => e.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="sport-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            PLANNING <span className="text-[#B0E301]">SPORTIF</span>
          </h1>
          <p className="text-[#A1A1AA] mt-1 text-sm">Organisez et suivez vos séances d'entraînement</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="brand" className="px-6 py-3" data-testid="add-workout-btn">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Séance
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-3xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Créer une Séance</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)]">
              <div className="space-y-4 pt-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nom de la séance</Label>
                    <Input
                      value={newWorkout.name}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Cardio Fractionné"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={newWorkout.workout_type}
                      onValueChange={(v) => setNewWorkout(prev => ({ ...prev, workout_type: v }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upper">Haut du corps</SelectItem>
                        <SelectItem value="lower">Bas du corps</SelectItem>
                        <SelectItem value="full_body">Full Body</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="hiit">HIIT / Fractionné</SelectItem>
                        <SelectItem value="core">Abdos/Core</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newWorkout.scheduled_date}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, scheduled_date: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Durée estimée (min)</Label>
                    <Input
                      type="number"
                      value={newWorkout.duration_minutes}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Intensité</Label>
                    <Select
                      value={newWorkout.intensity}
                      onValueChange={(v) => setNewWorkout(prev => ({ ...prev, intensity: v }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basse">Basse</SelectItem>
                        <SelectItem value="moyenne">Moyenne</SelectItem>
                        <SelectItem value="haute">Haute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Exercices */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base">Exercices ({newWorkout.exercises.length})</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExerciseDialogOpen(true)}
                      className="border-[#B0E301] text-[#B0E301]"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Ajouter exercice
                    </Button>
                  </div>

                  {newWorkout.exercises.length > 0 ? (
                    <div className="space-y-2">
                      {newWorkout.exercises.map((ex, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10 hover:border-[#B0E301]/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${ex.exercise_type === 'cardio' || ex.category === 'cardio'
                              ? 'bg-[#FF3333]/20 text-[#FF3333]'
                              : 'bg-[#B0E301]/10 text-[#B0E301]'
                              }`}>
                              {ex.exercise_type === 'cardio' || ex.category === 'cardio' ? (
                                <Zap className="w-4 h-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{ex.name}</p>
                              <p className="text-xs text-[#52525B]">
                                {getExerciseDurationDisplay(ex)}
                                {ex.weight && ` • ${ex.weight}kg`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editExerciseInWorkout(index)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateExerciseInWorkout(index)}
                              className="h-7 w-7 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExerciseFromWorkout(index)}
                              className="h-7 w-7 p-0 text-[#FF3333]"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded bg-white/5 text-center text-sm text-[#52525B] border border-dashed border-white/10">
                      <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Aucun exercice ajouté
                    </div>
                  )}
                </div>

                <Button onClick={handleCreateWorkout} variant="brand" className="w-full">
                  Créer la séance
                </Button>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Week Calendar */}
      <Card className="card-stat" data-testid="week-calendar">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">SEMAINE EN COURS</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => setCurrentWeekStart(prev => {
                  const d = new Date(prev);
                  d.setDate(d.getDate() - 7);
                  return d;
                })}
                data-testid="prev-week-btn"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-3">
                {weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {weekDates[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => setCurrentWeekStart(prev => {
                  const d = new Date(prev);
                  d.setDate(d.getDate() + 7);
                  return d;
                })}
                data-testid="next-week-btn"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const workout = getWorkoutForDate(date);
              const isToday = date.getTime() === today.getTime();
              const isSelected = selectedDay === index;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`
                    calendar-day flex flex-col items-center p-3
                    ${isToday ? 'today' : ''}
                    ${isSelected && !isToday ? 'selected' : ''}
                    ${workout ? 'has-workout' : ''}
                  `}
                  data-testid={`day-${weekDays[index].toLowerCase()}`}
                >
                  <span className={`text-xs ${isToday ? 'text-black' : 'text-[#A1A1AA]'}`}>
                    {weekDays[index]}
                  </span>
                  <span className={`text-lg font-bold mt-1 ${isToday ? 'text-black' : ''}`}>
                    {date.getDate()}
                  </span>
                  {workout && (
                    <div className={`w-2 h-2 rounded-full mt-1 ${isToday ? 'bg-black' : 'bg-[#B0E301]'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Day Workout */}
        <Card className="card-stat lg:col-span-2" data-testid="selected-workout">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#B0E301]" />
                {getWorkoutForDate(weekDates[selectedDay])?.name || 'Jour de Repos'}
              </CardTitle>
              {getWorkoutForDate(weekDates[selectedDay]) && (
                <Badge className={
                  getWorkoutForDate(weekDates[selectedDay]).completed
                    ? 'bg-[#B0E301]/10 text-[#B0E301] border-[#B0E301]/30'
                    : 'bg-[#6441a5]/10 text-[#6441a5] border-[#6441a5]/30'
                }>
                  {getWorkoutForDate(weekDates[selectedDay]).completed ? 'Terminé' : 'À faire'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const workout = getWorkoutForDate(weekDates[selectedDay]);
              if (workout) {
                return (
                  <>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="flex items-center gap-2 px-3 py-2 rounded bg-white/5">
                        <Timer className="w-4 h-4 text-[#6441a5]" />
                        <span className="text-sm">{workout.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded bg-white/5">
                        <Flame className="w-4 h-4 text-[#FF3333]" />
                        <span className="text-sm">~{Math.round(workout.duration_minutes * 7)} kcal</span>
                      </div>
                      <span className={`tag ${workout.intensity === 'haute' ? 'tag-green' : 'tag-purple'}`}>
                        {workout.intensity}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#A1A1AA] mb-3">EXERCICES</h3>
                    <div className="space-y-2">
                      {workout.exercises.map((ex, index) => {
                        const exerciseDetail = exercises.find(e => e.exercise_id === ex.exercise_id);
                        const isCardio = ex.exercise_type === 'cardio' || ex.category === 'cardio';
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                            onClick={() => exerciseDetail && setSelectedExercise(exerciseDetail)}
                            data-testid={`exercise-${index}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${isCardio ? 'bg-[#FF3333]/20 text-[#FF3333]' : 'bg-[#B0E301]/10 text-[#B0E301]'
                                }`}>
                                {isCardio ? <Zap className="w-4 h-4" /> : index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{exerciseDetail?.name || ex.name || ex.exercise_id}</p>
                                <p className="text-xs text-[#52525B]">
                                  {isCardio ? (
                                    `${ex.rounds?.length || 0} rondes • ${getExerciseDurationDisplay(ex)}`
                                  ) : (
                                    `${ex.sets} séries × ${ex.reps}`
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {ex.weight && (
                                <span className="font-mono text-sm text-[#A1A1AA]">{ex.weight}kg</span>
                              )}
                              {exerciseDetail?.video_url && (
                                <Youtube className="w-4 h-4 text-[#FF0000]" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      variant="brand"
                      className="w-full mt-6 py-4"
                      onClick={() => {
                        setSelectedWorkout(workout);
                        setSummaryDialogOpen(true);
                      }}
                      data-testid="start-session-btn"
                    >
                      {workout.completed ? 'Voir le Résumé' : 'Terminer la Séance'}
                    </Button>
                  </>
                );
              } else {
                return (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-[#52525B] mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Jour de Repos</h3>
                    <p className="text-[#A1A1AA] text-sm mb-6">
                      Profitez de cette journée pour récupérer.
                    </p>
                    <Button
                      variant="outline"
                      className="border-[#B0E301] text-[#B0E301] hover:bg-[#B0E301]/10"
                      onClick={() => setCreateDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une séance
                    </Button>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-stat" data-testid="recent-activity">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">HISTORIQUE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workoutLogs.slice(0, 5).map((log, index) => (
              <div
                key={log.log_id}
                className="card-workout p-3 rounded"
                data-testid={`history-item-${index}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#52525B]">{log.date}</span>
                  <Check className="w-4 h-4 text-[#B0E301]" />
                </div>
                <p className="font-semibold text-sm">
                  {workouts.find(w => w.workout_id === log.workout_id)?.name || 'Séance'}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-[#A1A1AA]">
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" /> {log.duration_minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {log.calories_burned} kcal
                  </span>
                </div>
              </div>
            ))}
            {workoutLogs.length === 0 && (
              <div className="text-center py-6 text-sm text-[#52525B]">
                Aucune séance enregistrée
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exercise Selection Dialog */}
      <Dialog open={exerciseDialogOpen} onOpenChange={(open) => {
        setExerciseDialogOpen(open);
        if (!open) {
          setConfigExercise(null);
          setEditingExerciseIndex(null);
          setSearchQuery('');
          setSearchResults([]);
        }
      }}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>
              {configExercise ? 'Configurer l\'exercice' : 'Ajouter un Exercice'}
            </DialogTitle>
          </DialogHeader>

          {configExercise ? (
            <ExerciseConfigDialog
              exercise={configExercise}
              isCardio={configExercise.category === 'cardio'}
              onSave={handleSaveExerciseConfig}
              onClose={() => {
                setConfigExercise(null);
                setEditingExerciseIndex(null);
              }}
            />
          ) : (
            <div className="space-y-4 pt-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#52525B]" />
                <Input
                  type="text"
                  placeholder="Rechercher un exercice..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 focus:border-[#B0E301]"
                  data-testid="exercise-search"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#B0E301] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes ({exercises.length})</SelectItem>
                    <SelectItem value="chest">Pectoraux</SelectItem>
                    <SelectItem value="back">Dos</SelectItem>
                    <SelectItem value="legs">Jambes</SelectItem>
                    <SelectItem value="shoulders">Épaules</SelectItem>
                    <SelectItem value="arms">Bras</SelectItem>
                    <SelectItem value="core">Abdos</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={libraryDifficulty} onValueChange={setLibraryDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Difficulté" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="débutant">Débutant</SelectItem>
                    <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="avancé">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Résultats */}
              <div className="text-xs text-[#52525B]">
                {searchQuery.length >= 2 ? (
                  `${searchResults.length} résultat${searchResults.length > 1 ? 's' : ''} pour "${searchQuery}"`
                ) : (
                  `${filteredExercises.length} exercices disponibles`
                )}
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-2 pr-4">
                  {(searchQuery.length >= 2 ? searchResults : filteredExercises).map((exercise) => (
                    <div
                      key={exercise.exercise_id}
                      className="exercise-card p-4 rounded cursor-pointer hover:border-[#B0E301]/50 transition-colors"
                      onClick={() => handleSelectExercise(exercise)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{exercise.name}</h4>
                            {exercise.video_url && (
                              <Youtube className="w-4 h-4 text-[#FF0000]" />
                            )}
                          </div>
                          <p className="text-xs text-[#52525B] mt-1">
                            {categoryLabels[exercise.category]} • {exercise.difficulty}
                          </p>
                          {exercise.muscle_groups?.length > 0 && (
                            <p className="text-xs text-[#A1A1AA] mt-0.5">
                              {exercise.muscle_groups.slice(0, 3).join(', ')}
                            </p>
                          )}
                          {exercise.equipment?.length > 0 && (
                            <p className="text-xs text-[#6441a5] mt-1">
                              {exercise.equipment.slice(0, 3).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {exercise.category === 'cardio' && (
                            <Zap className="w-4 h-4 text-[#FF3333]" />
                          )}
                          <Plus className="w-5 h-5 text-[#B0E301]" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(searchQuery.length >= 2 && searchResults.length === 0) && (
                    <div className="text-center py-8 text-[#52525B]">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Aucun exercice trouvé pour "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Exercise Detail Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedExercise.name}
                  {selectedExercise.video_url && (
                    <Youtube className="w-5 h-5 text-[#FF0000]" />
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="tag-purple">{categoryLabels[selectedExercise.category]}</Badge>
                  <Badge className={difficultyColors[selectedExercise.difficulty] || 'bg-gray-500/20'}>
                    {selectedExercise.difficulty}
                  </Badge>
                </div>

                <p className="text-[#A1A1AA]">{selectedExercise.description}</p>

                {selectedExercise.video_url && (
                  <div className="space-y-2">
                    <div className="aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/10">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedExercise.video_url.split('v=')[1]?.split('&')[0]}`}
                        title={`Vidéo: ${selectedExercise.name}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <a
                      href={selectedExercise.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Ouvrir sur YouTube</span>
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="font-bold mb-2">Instructions</h4>
                  <ol className="space-y-2">
                    {selectedExercise.instructions?.map((inst, i) => (
                      <li key={i} className="flex gap-3 text-sm text-[#A1A1AA]">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#B0E301]/10 text-[#B0E301] flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>

                {selectedExercise.tips?.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-2">Conseils</h4>
                    <ul className="space-y-1">
                      {selectedExercise.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                          <Check className="w-4 h-4 text-[#B0E301] flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedExercise.equipment?.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-2">Équipement</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.equipment.map((eq, i) => (
                        <Badge key={i} variant="outline" className="border-white/20">
                          {eq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Workout Summary Dialog */}
      <Dialog open={summaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10">
          <DialogHeader>
            <DialogTitle>Résumé de la Séance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Durée (min)</Label>
                <Input
                  type="number"
                  value={logData.duration_minutes}
                  onChange={(e) => setLogData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Calories brûlées</Label>
                <Input
                  type="number"
                  value={logData.calories_burned}
                  onChange={(e) => setLogData(prev => ({ ...prev, calories_burned: parseInt(e.target.value) || 0 }))}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Difficulté ressentie</Label>
              <Select
                value={logData.difficulty_rating}
                onValueChange={(v) => setLogData(prev => ({ ...prev, difficulty_rating: v }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facile">Facile</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (optionnel)</Label>
              <Textarea
                value={logData.notes}
                onChange={(e) => setLogData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Comment s'est passée la séance ?"
                className="mt-2"
              />
            </div>
            <Button onClick={handleLogWorkout} variant="brand" className="w-full">
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
