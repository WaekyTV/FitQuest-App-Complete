import { useState, useEffect, useCallback } from 'react';
import {
  Target,
  Trophy,
  Flame,
  Droplet,
  Footprints,
  Dumbbell,
  Calendar,
  Clock,
  Star,
  Gift,
  ChevronRight,
  Check,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Predefined challenges
const CHALLENGE_TEMPLATES = [
  // Hydration challenges
  { id: 'water_7days', type: 'hydration', name: 'Hydra Master', description: 'Bois 8 verres d\'eau pendant 7 jours', target: 7, xp_reward: 500, icon: Droplet, color: '#00BFFF', metric: 'days_completed' },
  { id: 'water_streak_3', type: 'hydration', name: 'Bien Hydraté', description: 'Atteins ton objectif d\'eau 3 jours de suite', target: 3, xp_reward: 150, icon: Droplet, color: '#00BFFF', metric: 'streak' },

  // Steps challenges
  { id: 'steps_10k_5days', type: 'steps', name: 'Marcheur Pro', description: 'Fais 10 000 pas 5 jours cette semaine', target: 5, xp_reward: 400, icon: Footprints, color: '#FF6B35', metric: 'days_completed' },
  { id: 'steps_50k_week', type: 'steps', name: 'Marathon Hebdo', description: 'Accumule 50 000 pas cette semaine', target: 50000, xp_reward: 350, icon: Footprints, color: '#FF6B35', metric: 'total' },

  // Workout challenges
  { id: 'workout_3_week', type: 'workout', name: 'Régulier', description: 'Complete 3 séances cette semaine', target: 3, xp_reward: 300, icon: Dumbbell, color: '#B0E301', metric: 'count' },
  { id: 'workout_5_week', type: 'workout', name: 'Athlète', description: 'Complete 5 séances cette semaine', target: 5, xp_reward: 600, icon: Dumbbell, color: '#B0E301', metric: 'count' },

  // Streak challenges
  { id: 'streak_7', type: 'streak', name: 'Semaine Parfaite', description: 'Connecte-toi 7 jours de suite', target: 7, xp_reward: 250, icon: Flame, color: '#FFD700', metric: 'days' },
  { id: 'streak_14', type: 'streak', name: 'Deux Semaines', description: 'Connecte-toi 14 jours de suite', target: 14, xp_reward: 700, icon: Flame, color: '#FFD700', metric: 'days' },

  // Nutrition challenges
  { id: 'meals_logged_7', type: 'nutrition', name: 'Suivi Nutrition', description: 'Enregistre tes repas 7 jours de suite', target: 7, xp_reward: 350, icon: Target, color: '#6441a5', metric: 'days' },
  { id: 'calories_goal_5', type: 'nutrition', name: 'Objectif Atteint', description: 'Respecte ton objectif calorique 5 jours', target: 5, xp_reward: 400, icon: Target, color: '#6441a5', metric: 'days' },
];

// Sound for challenge completion
const playChallengeCompleteSound = (volume = 0.3) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
  masterGain.gain.value = volume;

  const notes = [
    { freq: 392.00, time: 0, duration: 0.15 },
    { freq: 392.00, time: 0.15, duration: 0.15 },
    { freq: 392.00, time: 0.3, duration: 0.15 },
    { freq: 311.13, time: 0.45, duration: 0.3 },
    { freq: 349.23, time: 0.75, duration: 0.1 },
    { freq: 392.00, time: 0.85, duration: 0.15 },
    { freq: 349.23, time: 1.0, duration: 0.1 },
    { freq: 392.00, time: 1.1, duration: 0.4 },
  ];

  notes.forEach(note => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'square';
    osc.frequency.value = note.freq;
    gain.gain.setValueAtTime(0.25, audioContext.currentTime + note.time);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + note.duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(audioContext.currentTime + note.time);
    osc.stop(audioContext.currentTime + note.time + note.duration + 0.05);
  });
};

export const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      // Fetch user challenges from backend
      const [challengesRes, statsRes] = await Promise.all([
        axios.get(`${API}/challenges`, { withCredentials: true }),
        axios.get(`${API}/challenges/stats`, { withCredentials: true })
      ]);

      setActiveChallenges(challengesRes.data.active || []);
      setCompletedChallenges(challengesRes.data.completed || []);
      setStats(statsRes.data);

      // Set available challenges (templates not yet active)
      const activeIds = (challengesRes.data.active || []).map(c => c.template_id);
      const availableTemplates = CHALLENGE_TEMPLATES.filter(t => !activeIds.includes(t.id));
      setChallenges(availableTemplates);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      // Fallback: show all templates as available
      setChallenges(CHALLENGE_TEMPLATES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startChallenge = async (template) => {
    try {
      await axios.post(`${API}/challenges/start`, {
        template_id: template.id,
        type: template.type,
        name: template.name,
        description: template.description,
        target: template.target,
        xp_reward: template.xp_reward,
        metric: template.metric
      }, { withCredentials: true });

      toast.success(`Défi "${template.name}" commencé !`);

      // Send notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nouveau Défi !', {
          body: `Tu as commencé: ${template.name}`,
          icon: '/favicon.ico'
        });
      }

      fetchData();
    } catch (error) {
      console.error('Error starting challenge:', error);
      toast.error('Erreur lors du démarrage du défi');
    }
  };

  const claimReward = async (challenge) => {
    try {
      await axios.post(`${API}/challenges/${challenge.challenge_id}/claim`, {}, { withCredentials: true });

      // Play sound
      playChallengeCompleteSound();

      toast.success(`+${challenge.xp_reward} XP réclamés !`);

      // Send notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Défi Complété !', {
          body: `Tu as gagné ${challenge.xp_reward} XP !`,
          icon: '/favicon.ico'
        });
      }

      fetchData();
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Erreur lors de la réclamation');
    }
  };

  // Calculate week info
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const daysRemaining = Math.ceil((endOfWeek - now) / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="challenges-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-[#FFD700]">DÉFIS</span> HEBDO
          </h1>
          <p className="text-[#A1A1AA] mt-1 text-sm">
            Semaine du {startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            {' '}- {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchData}
          className="border-white/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-[#FFD700]" />
              <p className="text-2xl font-bold">{stats.total_completed || 0}</p>
              <p className="text-xs text-[#52525B]">Défis complétés</p>
            </CardContent>
          </Card>
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-[#B0E301]" />
              <p className="text-2xl font-bold">{stats.total_xp_earned || 0}</p>
              <p className="text-xs text-[#52525B]">XP gagnés</p>
            </CardContent>
          </Card>
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-[#FF6B35]" />
              <p className="text-2xl font-bold">{stats.current_streak || 0}</p>
              <p className="text-xs text-[#52525B]">Jours d'affilée</p>
            </CardContent>
          </Card>
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-[#6441a5]" />
              <p className="text-2xl font-bold">{activeChallenges.length}</p>
              <p className="text-xs text-[#52525B]">Défis actifs</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <Card className="card-stat" data-testid="active-challenges">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-[#B0E301]" />
              DÉFIS EN COURS ({activeChallenges.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeChallenges.map(challenge => {
              const template = CHALLENGE_TEMPLATES.find(t => t.id === challenge.template_id);
              const Icon = template?.icon || Target;
              const color = template?.color || '#B0E301';
              const progress = Math.min((challenge.progress / challenge.target) * 100, 100);
              const isComplete = challenge.progress >= challenge.target;

              return (
                <div
                  key={challenge.challenge_id}
                  className={`p-4 rounded-lg border transition-all ${isComplete
                      ? 'border-[#B0E301] bg-[#B0E301]/10'
                      : 'border-white/10 bg-white/[0.02]'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold">{challenge.name}</h3>
                        <span className="text-sm text-[#B0E301] font-mono">+{challenge.xp_reward} XP</span>
                      </div>
                      <p className="text-sm text-[#52525B] mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-3">
                        <Progress value={progress} className="flex-1 h-2" />
                        <span className="text-sm font-mono text-[#A1A1AA]">
                          {challenge.progress}/{challenge.target}
                        </span>
                      </div>
                    </div>
                    {isComplete && !challenge.claimed && (
                      <Button
                        onClick={() => claimReward(challenge)}
                        variant="brand" className="flex-shrink-0"
                        data-testid={`claim-${challenge.challenge_id}`}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Réclamer
                      </Button>
                    )}
                    {isComplete && challenge.claimed && (
                      <div className="flex items-center gap-1 text-[#B0E301]">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">Réclamé</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available Challenges */}
      <Card className="card-stat" data-testid="available-challenges">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Star className="w-4 h-4 text-[#FFD700]" />
            DÉFIS DISPONIBLES
          </CardTitle>
        </CardHeader>
        <CardContent>
          {challenges.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-[#52525B]" />
              <p className="text-[#A1A1AA]">Tu as accepté tous les défis !</p>
              <p className="text-xs text-[#52525B]">Reviens la semaine prochaine pour de nouveaux défis.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {challenges.map(template => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${template.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: template.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm">{template.name}</h3>
                          <span className="text-xs text-[#B0E301] font-mono">+{template.xp_reward} XP</span>
                        </div>
                        <p className="text-xs text-[#52525B] mt-1">{template.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => startChallenge(template)}
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-white/10"
                      data-testid={`start-${template.id}`}
                    >
                      Commencer le défi
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed This Week */}
      {completedChallenges.length > 0 && (
        <Card className="card-stat" data-testid="completed-challenges">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#B0E301]" />
              COMPLÉTÉS CETTE SEMAINE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedChallenges.map(challenge => {
                const template = CHALLENGE_TEMPLATES.find(t => t.id === challenge.template_id);
                const Icon = template?.icon || Trophy;
                const color = template?.color || '#B0E301';

                return (
                  <div
                    key={challenge.challenge_id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#B0E301]/5"
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                    <span className="flex-1 text-sm">{challenge.name}</span>
                    <span className="text-sm text-[#B0E301] font-mono">+{challenge.xp_reward} XP</span>
                    <Check className="w-4 h-4 text-[#B0E301]" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
