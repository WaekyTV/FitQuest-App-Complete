import { useState, useEffect } from 'react';
import {
  Dumbbell,
  Calendar,
  Clock,
  Target,
  ChevronRight,
  Play,
  CheckCircle,
  Zap,
  Flame,
  TrendingUp,
  Award,
  Upload,
  Download,
  FileJson,
  Copy,
  ChevronLeft,
  Video,
  ExternalLink,
  CalendarDays,
  Star,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GOAL_LABELS = {
  muscle_gain: { label: 'Prise de muscle', color: '#B0E301', icon: Dumbbell },
  weight_loss: { label: 'Perte de poids', color: '#FF6B35', icon: Flame },
  endurance: { label: 'Endurance', color: '#00BFFF', icon: TrendingUp }
};

const LEVEL_COLORS = {
  'débutant': '#4CAF50',
  'intermédiaire': '#FF9800',
  'avancé': '#F44336'
};

export const ProgramsPage = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [activeProgram, setActiveProgram] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programDetails, setProgramDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Import/Export state
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [exportJson, setExportJson] = useState('');
  const [importing, setImporting] = useState(false);

  // Program calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [workoutDays, setWorkoutDays] = useState([]);

  // Exercise video modal
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeProgram) {
      fetchWorkoutDays();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProgram, calendarMonth, calendarYear]);

  const fetchData = async () => {
    try {
      const [programsRes, activeRes] = await Promise.all([
        axios.get(`${API}/programs`, { withCredentials: true }),
        axios.get(`${API}/programs/user/active`, { withCredentials: true })
      ]);
      setPrograms(programsRes.data);
      setActiveProgram(activeRes.data.active_program);
    } catch (err) {
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutDays = async () => {
    try {
      const res = await axios.get(`${API}/performance/workout-days?month=${calendarMonth}&year=${calendarYear}`, { withCredentials: true });
      setWorkoutDays(res.data.workout_days || []);
    } catch (err) {
      console.error('Error fetching workout days:', err);
    }
  };

  const changeCalendarMonth = (direction) => {
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
  };

  const handleViewExercise = async (exerciseId) => {
    try {
      const res = await axios.get(`${API}/exercises/${exerciseId}`, { withCredentials: true });
      setSelectedExercise(res.data);
      setExerciseDialogOpen(true);
    } catch (err) {
      console.error('Error fetching exercise:', err);
    }
  };

  const handleSelectProgram = async (program) => {
    setSelectedProgram(program);
    setDetailsLoading(true);
    try {
      const res = await axios.get(`${API}/programs/${program.program_id}`, { withCredentials: true });
      setProgramDetails(res.data);
    } catch (err) {
      console.error('Error fetching program details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStartProgram = async () => {
    if (!selectedProgram) return;

    try {
      const res = await axios.post(
        `${API}/programs/${selectedProgram.program_id}/start`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setSelectedProgram(null);
      setProgramDetails(null);
      fetchData(); // Refresh to show active program
    } catch (err) {
      toast.error('Erreur lors du démarrage du programme');
    }
  };

  const handleImportProgram = async () => {
    if (!importJson.trim()) {
      toast.error('Veuillez coller le JSON du programme');
      return;
    }

    setImporting(true);
    try {
      const res = await axios.post(
        `${API}/programs/import`,
        { program_json: importJson },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setImportDialogOpen(false);
      setImportJson('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de l\'import');
    } finally {
      setImporting(false);
    }
  };

  const handleExportProgram = async (programId) => {
    try {
      const res = await axios.get(`${API}/programs/export/${programId}`, { withCredentials: true });
      setExportJson(res.data.program_json);
      setExportDialogOpen(true);
    } catch (err) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportJson);
    toast.success('JSON copié dans le presse-papier !');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="programs-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            PROGRAMMES <span className="text-[#6441a5]">D'ENTRAÎNEMENT</span>
          </h1>
          <p className="text-[#A1A1AA] mt-1 text-sm">Choisis ton programme et atteins tes objectifs</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            className="border-white/10"
            data-testid="import-program-btn"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer JSON
          </Button>
        </div>
      </div>

      {/* Active Program with Calendar */}
      {activeProgram && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Program Info */}
          <Card className="card-stat border-[#B0E301]/30 bg-gradient-to-r from-[#B0E301]/10 to-transparent lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#B0E301]" />
                  PROGRAMME ACTIF
                </CardTitle>
                <Badge className="bg-[#B0E301]/20 text-[#B0E301]">En cours</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold mb-2">{activeProgram.program_name}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-[#A1A1AA] mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Semaine {activeProgram.current_week}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {activeProgram.workouts_completed} séances
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#FFD700]" />
                  {workoutDays.length} ce mois
                </span>
              </div>
              <Progress value={Math.min((activeProgram.workouts_completed / (activeProgram.duration_weeks * activeProgram.days_per_week || 1)) * 100, 100)} className="h-2" />
              <p className="text-xs text-[#52525B] mt-2">
                Progression: {activeProgram.workouts_completed} / {(activeProgram.duration_weeks || 4) * (activeProgram.days_per_week || 4)} séances
              </p>
            </CardContent>
          </Card>

          {/* Mini Calendar */}
          <Card className="card-stat" data-testid="program-calendar">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => changeCalendarMonth(-1)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <CardTitle className="text-sm font-medium">
                  {new Date(calendarYear, calendarMonth - 1).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                </CardTitle>
                <button
                  onClick={() => changeCalendarMonth(1)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-7 gap-1 text-center">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-[10px] text-[#52525B] py-1">{d}</div>
                ))}
                {(() => {
                  const firstDay = new Date(calendarYear, calendarMonth - 1, 1);
                  const lastDay = new Date(calendarYear, calendarMonth, 0);
                  const daysInMonth = lastDay.getDate();
                  let startDay = firstDay.getDay();
                  startDay = startDay === 0 ? 6 : startDay - 1;

                  const days = [];
                  const today = new Date();
                  const todayStr = today.toISOString().split('T')[0];

                  for (let i = 0; i < startDay; i++) {
                    days.push(<div key={`empty-${i}`} className="h-6" />);
                  }

                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isWorkoutDay = workoutDays.includes(dateStr);
                    const isToday = dateStr === todayStr;

                    days.push(
                      <div
                        key={day}
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs mx-auto ${isWorkoutDay
                          ? 'bg-[#B0E301] text-black font-bold'
                          : isToday
                            ? 'ring-1 ring-white/50'
                            : ''
                          }`}
                      >
                        {day}
                      </div>
                    );
                  }

                  return days;
                })()}
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-white/5 text-xs text-[#52525B]">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#B0E301]" />
                  <span>Entraînement</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map(program => {
          const goalInfo = GOAL_LABELS[program.goal] || GOAL_LABELS.muscle_gain;
          const GoalIcon = goalInfo.icon;
          const isActive = activeProgram?.program_id === program.program_id;

          return (
            <Card
              key={program.program_id}
              className={`card-stat cursor-pointer transition-all hover:border-[#6441a5]/50 ${isActive ? 'border-[#B0E301]/50' : ''
                }`}
              onClick={() => handleSelectProgram(program)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${goalInfo.color}20` }}
                  >
                    <GoalIcon className="w-6 h-6" style={{ color: goalInfo.color }} />
                  </div>
                  {isActive && (
                    <Badge className="bg-[#B0E301]/20 text-[#B0E301]">Actif</Badge>
                  )}
                </div>

                <h3 className="font-bold text-lg mb-2">{program.name}</h3>
                <p className="text-sm text-[#A1A1AA] mb-4 line-clamp-2">{program.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    style={{
                      backgroundColor: `${LEVEL_COLORS[program.level]}20`,
                      color: LEVEL_COLORS[program.level]
                    }}
                  >
                    {program.level}
                  </Badge>
                  <Badge style={{ backgroundColor: `${goalInfo.color}20`, color: goalInfo.color }}>
                    {goalInfo.label}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-[#52525B]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {program.duration_weeks} semaines
                  </span>
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-4 h-4" />
                    {program.days_per_week}x/sem
                  </span>
                </div>

                <Button
                  className="w-full mt-4 btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectProgram(program);
                  }}
                >
                  Voir le programme
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Program Details Dialog */}
      <Dialog open={!!selectedProgram} onOpenChange={() => { setSelectedProgram(null); setProgramDetails(null); }}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedProgram?.name}</DialogTitle>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : programDetails ? (
            <div className="space-y-6">
              <p className="text-[#A1A1AA]">{programDetails.description}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded bg-white/5">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-[#6441a5]" />
                  <p className="font-bold">{programDetails.duration_weeks}</p>
                  <p className="text-xs text-[#52525B]">semaines</p>
                </div>
                <div className="text-center p-3 rounded bg-white/5">
                  <Dumbbell className="w-5 h-5 mx-auto mb-1 text-[#B0E301]" />
                  <p className="font-bold">{programDetails.days_per_week}</p>
                  <p className="text-xs text-[#52525B]">jours/sem</p>
                </div>
                <div className="text-center p-3 rounded bg-white/5">
                  <Target className="w-5 h-5 mx-auto mb-1 text-[#FFD700]" />
                  <p className="font-bold capitalize">{programDetails.level}</p>
                  <p className="text-xs text-[#52525B]">niveau</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3">Planning hebdomadaire</h4>
                <div className="space-y-3">
                  {programDetails.schedule.map((day, idx) => (
                    <div key={idx} className="p-4 rounded bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Jour {day.day}: {day.name}</span>
                        <Badge className="bg-[#6441a5]/20 text-[#6441a5]">{day.workout_type}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {day.focus.map((cat, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/10 text-[#A1A1AA]">
                            {cat}
                          </span>
                        ))}
                      </div>
                      {day.suggested_exercises && day.suggested_exercises.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs text-[#52525B] mb-2">Exercices suggérés:</p>
                          <div className="flex flex-wrap gap-2">
                            {day.suggested_exercises.slice(0, 6).map((ex, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewExercise(ex.exercise_id);
                                }}
                                className="group flex items-center gap-1.5 text-xs px-2 py-1.5 rounded bg-[#B0E301]/10 text-[#B0E301] hover:bg-[#B0E301]/20 transition-colors"
                                data-testid={`exercise-btn-${ex.exercise_id}`}
                              >
                                <Video className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                {ex.name}
                              </button>
                            ))}
                            {day.suggested_exercises.length > 6 && (
                              <span className="text-xs px-2 py-1.5 text-[#52525B]">
                                +{day.suggested_exercises.length - 6} autres
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProgram(null)}>
              Fermer
            </Button>
            <Button
              variant="brand"
              onClick={handleStartProgram}
              disabled={activeProgram?.program_id === selectedProgram?.program_id}
            >
              {activeProgram?.program_id === selectedProgram?.program_id ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Programme actif
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Démarrer ce programme
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-[#B0E301]" />
              Importer un Programme JSON
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-[#A1A1AA]">
              Collez le JSON de votre programme ci-dessous. Le format doit inclure un nom, une description, et une liste d'entraînements.
            </p>
            <Textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder={`{
  "name": "Mon Programme",
  "description": "Description du programme",
  "duration_weeks": 4,
  "days_per_week": 4,
  "difficulty": "intermediate",
  "workouts": [
    {"day": 1, "name": "Push Day", "exercises": [...]}
  ]
}`}
              className="bg-white/5 border-white/10 font-mono text-sm min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="brand"
                onClick={handleImportProgram}
                disabled={importing}
              >
                {importing ? 'Import...' : 'Importer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#6441a5]" />
              Exporter le Programme
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              value={exportJson}
              readOnly
              className="bg-white/5 border-white/10 font-mono text-sm min-h-[300px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                Fermer
              </Button>
              <Button variant="brand" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copier
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exercise Video Modal */}
      <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#B0E301]/20 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-[#B0E301]" />
                  </div>
                  {selectedExercise.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Video Player */}
                {selectedExercise.video_url && (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedExercise.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] || ''}`}
                      title={selectedExercise.name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Exercise Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded bg-white/5 text-center">
                    <Target className="w-4 h-4 mx-auto mb-1 text-[#6441a5]" />
                    <p className="text-xs text-[#52525B]">Catégorie</p>
                    <p className="text-sm font-medium capitalize">{selectedExercise.category}</p>
                  </div>
                  <div className="p-3 rounded bg-white/5 text-center">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-[#FFD700]" />
                    <p className="text-xs text-[#52525B]">Difficulté</p>
                    <p className="text-sm font-medium capitalize">{selectedExercise.difficulty}</p>
                  </div>
                  <div className="p-3 rounded bg-white/5 text-center col-span-2">
                    <Dumbbell className="w-4 h-4 mx-auto mb-1 text-[#B0E301]" />
                    <p className="text-xs text-[#52525B]">Muscles</p>
                    <p className="text-sm font-medium">{selectedExercise.muscle_groups?.join(', ')}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Description</h4>
                  <p className="text-sm text-[#A1A1AA]">{selectedExercise.description}</p>
                </div>

                {/* Instructions */}
                {selectedExercise.instructions?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Instructions</h4>
                    <ol className="space-y-2">
                      {selectedExercise.instructions.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-[#A1A1AA]">
                          <span className="w-5 h-5 rounded-full bg-[#6441a5]/20 text-[#6441a5] flex items-center justify-center flex-shrink-0 text-xs">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Tips */}
                {selectedExercise.tips?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Conseils</h4>
                    <ul className="space-y-1">
                      {selectedExercise.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                          <Star className="w-3 h-3 text-[#FFD700] mt-1 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* External Link */}
                {selectedExercise.video_url && (
                  <div className="pt-2">
                    <a
                      href={selectedExercise.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#B0E301] hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Voir sur YouTube
                    </a>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setExerciseDialogOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
