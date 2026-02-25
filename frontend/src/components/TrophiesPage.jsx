import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Flame, 
  Star, 
  Zap, 
  Target,
  Utensils,
  Scale,
  Sparkles,
  BadgeCheck,
  Gem,
  Sunrise,
  Moon,
  Layers,
  Lock,
  ChefHat,
  Search,
  TrendingUp,
  Heart,
  Dumbbell,
  Calendar,
  Shield,
  Footprints,
  Clock,
  Infinity,
  Compass,
  Gift,
  Cake,
  Share2,
  Download,
  MessageCircle,
  Plane,
  Globe,
  MapPin,
  GraduationCap,
  Timer,
  Repeat,
  CheckCircle,
  HeartPulse,
  ArrowDown,
  ArrowUp,
  Activity,
  User,
  PieChart,
  Droplet,
  Carrot,
  Brain,
  Cpu,
  Book,
  Swords,
  Mountain,
  Cog,
  ShieldCheck,
  CalendarCheck,
  AlarmClock,
  SunDim,
  MoonStar,
  PartyPopper,
  CloudRain,
  CheckCheck,
  RotateCcw,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { useXPSounds } from '../utils/xpSounds';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ICON_MAP = {
  trophy: Trophy,
  medal: Medal,
  award: Award,
  crown: Crown,
  flame: Flame,
  fire: Flame,
  'fire-extinguisher': Flame,
  star: Star,
  zap: Zap,
  target: Target,
  utensils: Utensils,
  'chef-hat': ChefHat,
  scale: Scale,
  sparkles: Sparkles,
  badge: BadgeCheck,
  gem: Gem,
  sunrise: Sunrise,
  'sun-dim': SunDim,
  moon: Moon,
  'moon-star': MoonStar,
  layers: Layers,
  footprints: Footprints,
  shield: Shield,
  'shield-check': ShieldCheck,
  sword: Swords,
  mountain: Mountain,
  bolt: Zap,
  infinity: Infinity,
  calendar: Calendar,
  'calendar-check': CalendarCheck,
  'calendar-plus': Calendar,
  cog: Cog,
  clock: Clock,
  'alarm-clock': AlarmClock,
  'heart-pulse': HeartPulse,
  heart: Heart,
  dumbbell: Dumbbell,
  'person-simple': User,
  repeat: Repeat,
  'rotate-ccw': RotateCcw,
  'check-circle': CheckCircle,
  'trending-up': TrendingUp,
  'line-chart': TrendingUp,
  'arrow-down': ArrowDown,
  'arrow-up': ArrowUp,
  activity: Activity,
  'pie-chart': PieChart,
  droplet: Droplet,
  carrot: Carrot,
  brain: Brain,
  cpu: Cpu,
  book: Book,
  compass: Compass,
  map: MapPin,
  globe: Globe,
  share: Share2,
  'user-check': User,
  download: Download,
  'message-circle': MessageCircle,
  'party-popper': PartyPopper,
  cake: Cake,
  gift: Gift,
  'cloud-rain': CloudRain,
  plane: Plane,
  timer: Timer,
  'check-check': CheckCheck,
  'graduation-cap': GraduationCap
};

const CATEGORY_LABELS = {
  workout: { name: 'Entraînement', color: '#B0E301', emoji: '💪' },
  streak: { name: 'Régularité', color: '#FF6B35', emoji: '🔥' },
  nutrition: { name: 'Nutrition', color: '#00BFFF', emoji: '🍎' },
  progress: { name: 'Progression', color: '#FFD700', emoji: '📈' },
  level: { name: 'Niveau', color: '#6441a5', emoji: '⭐' },
  special: { name: 'Spécial', color: '#FF69B4', emoji: '✨' }
};

export const TrophiesPage = () => {
  const { user } = useAuth();
  const { playTrophyUnlock, playLevelUp } = useXPSounds();
  const [trophiesData, setTrophiesData] = useState(null);
  const [xpData, setXpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Streak badges state
  const [currentStreak, setCurrentStreak] = useState(0);
  const [streakBadges, setStreakBadges] = useState([]);
  const [claimingBadge, setClaimingBadge] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trophiesRes, xpRes, streakRes] = await Promise.all([
        axios.get(`${API}/trophies`, { withCredentials: true }),
        axios.get(`${API}/xp/status`, { withCredentials: true }),
        axios.get(`${API}/performance/streak-badges`, { withCredentials: true })
      ]);
      setTrophiesData(trophiesRes.data);
      setXpData(xpRes.data);
      setCurrentStreak(streakRes.data.current_streak || 0);
      setStreakBadges(streakRes.data.badges || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimBadge = async (days) => {
    setClaimingBadge(days);
    try {
      const response = await axios.post(`${API}/performance/claim-streak-badge/${days}`, {}, { withCredentials: true });
      toast.success(response.data.message);
      if (playLevelUp) playLevelUp();
      
      // Refresh data
      const [streakRes, xpRes] = await Promise.all([
        axios.get(`${API}/performance/streak-badges`, { withCredentials: true }),
        axios.get(`${API}/xp/status`, { withCredentials: true })
      ]);
      setStreakBadges(streakRes.data.badges || []);
      setXpData(xpRes.data);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Erreur lors de la réclamation';
      toast.error(errorMsg);
    } finally {
      setClaimingBadge(null);
    }
  };

  // Filter trophies by category and search
  const filteredTrophies = trophiesData?.trophies?.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  const unlockedTrophies = filteredTrophies.filter(t => t.unlocked);
  const lockedTrophies = filteredTrophies.filter(t => !t.unlocked);

  // Count by category
  const getCategoryCount = (category) => {
    if (!trophiesData?.trophies) return { total: 0, unlocked: 0 };
    const catTrophies = category === 'all' 
      ? trophiesData.trophies 
      : trophiesData.trophies.filter(t => t.category === category);
    return {
      total: catTrophies.length,
      unlocked: catTrophies.filter(t => t.unlocked).length
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="trophies-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            SALLE DES <span className="text-[#FFD700]">TROPHÉES</span>
          </h1>
          <p className="text-[#A1A1AA] mt-1 text-sm">
            {trophiesData?.stats?.unlocked || 0} / {trophiesData?.stats?.total || 0} trophées débloqués
          </p>
        </div>
      </div>

      {/* XP & Level Card */}
      {xpData && (
        <Card className="card-stat overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6441a5]/20 to-[#B0E301]/20" />
          <CardContent className="p-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level Display */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6441a5] to-[#B0E301] flex items-center justify-center text-2xl font-bold text-black">
                    {xpData.level}
                  </div>
                  <div>
                    <p className="text-xs text-[#A1A1AA]">NIVEAU</p>
                    <h3 className="text-xl font-bold">{xpData.title}</h3>
                  </div>
                </div>
              </div>

              {/* XP Progress */}
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#A1A1AA]">Progression vers niveau {xpData.level + 1}</span>
                  <span className="text-sm font-bold text-[#B0E301]">{xpData.total_xp?.toLocaleString()} XP</span>
                </div>
                <Progress value={xpData.progress} className="h-3" />
                <div className="flex justify-between text-xs text-[#52525B] mt-1">
                  <span>{xpData.xp_current_level?.toLocaleString()} XP</span>
                  <span>{xpData.xp_for_next?.toLocaleString()} XP</span>
                </div>
                
                {/* Multiplier & BMI */}
                <div className="flex gap-4 mt-4">
                  <Badge className="bg-[#6441a5]/20 text-[#6441a5]">
                    Multiplicateur: x{xpData.xp_multiplier}
                  </Badge>
                  {xpData.bmi?.bmi && (
                    <Badge className="bg-[#B0E301]/20 text-[#B0E301]">
                      IMC: {xpData.bmi.bmi}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      {trophiesData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-[#FFD700]" />
              <p className="text-2xl font-bold">{trophiesData.stats.unlocked}/{trophiesData.stats.total}</p>
              <p className="text-xs text-[#A1A1AA]">Trophées débloqués</p>
            </CardContent>
          </Card>
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-[#FF6B35]" />
              <p className="text-2xl font-bold">{trophiesData.user_stats?.streak || 0}</p>
              <p className="text-xs text-[#A1A1AA]">Jours de série</p>
            </CardContent>
          </Card>
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-[#B0E301]" />
              <p className="text-2xl font-bold">{trophiesData.user_stats?.workouts || 0}</p>
              <p className="text-xs text-[#A1A1AA]">Entraînements</p>
            </CardContent>
          </Card>
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Utensils className="w-8 h-8 mx-auto mb-2 text-[#00BFFF]" />
              <p className="text-2xl font-bold">{trophiesData.user_stats?.meals || 0}</p>
              <p className="text-xs text-[#A1A1AA]">Repas enregistrés</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Streak Badges Section */}
      <Card className="card-stat" data-testid="streak-badges">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FFD700]" />
            BADGES DE STREAK
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-[#FF6B35]" />
            <span className="text-lg font-bold">{currentStreak} jours</span>
            <span className="text-sm text-[#52525B]">de streak actuel</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { days: 7, label: 'Semaine', xp: 100, icon: '🔥', color: '#FF6B35' },
              { days: 30, label: 'Mois', xp: 500, icon: '💪', color: '#B0E301' },
              { days: 100, label: 'Champion', xp: 2000, icon: '🏆', color: '#FFD700' },
              { days: 365, label: 'Légende', xp: 10000, icon: '👑', color: '#6441a5' }
            ].map(badge => {
              const badgeData = streakBadges.find(b => b.days === badge.days);
              const isUnlocked = badgeData?.is_unlocked || currentStreak >= badge.days;
              const isClaimed = badgeData?.is_claimed || false;
              const canClaim = badgeData?.can_claim || (isUnlocked && !isClaimed);
              const progress = Math.min(100, (currentStreak / badge.days) * 100);
              
              return (
                <div 
                  key={badge.days}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    isUnlocked 
                      ? isClaimed 
                        ? 'bg-gradient-to-b from-white/10 to-transparent border-white/30' 
                        : 'bg-gradient-to-b from-white/5 to-transparent border-white/20 ring-2 ring-[#B0E301]/50'
                      : 'border-white/5 opacity-60'
                  }`}
                  data-testid={`streak-badge-${badge.days}`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="font-bold text-sm" style={{ color: isUnlocked ? badge.color : '#52525B' }}>
                    {badge.days} jours
                  </p>
                  <p className="text-xs text-[#52525B]">{badge.label}</p>
                  
                  {!isUnlocked && (
                    <div className="mt-2">
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: badge.color 
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-[#52525B] mt-1">
                        {currentStreak}/{badge.days}
                      </p>
                    </div>
                  )}
                  
                  {isUnlocked && !isClaimed && canClaim && (
                    <Button
                      size="sm"
                      onClick={() => handleClaimBadge(badge.days)}
                      disabled={claimingBadge === badge.days}
                      className="mt-2 h-7 text-xs bg-[#B0E301] hover:bg-[#B0E301]/80 text-black"
                      data-testid={`claim-badge-${badge.days}`}
                    >
                      {claimingBadge === badge.days ? '...' : `Réclamer +${badge.xp} XP`}
                    </Button>
                  )}
                  
                  {isUnlocked && isClaimed && (
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <Check className="w-3 h-3 text-[#B0E301]" />
                      <span className="text-xs text-[#B0E301]">Réclamé</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#52525B]" />
        <Input
          type="text"
          placeholder="Rechercher un trophée..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 focus:border-[#B0E301]"
          data-testid="trophy-search"
        />
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#6441a5] text-white'
              : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10'
          }`}
          data-testid="filter-all"
        >
          Tous ({getCategoryCount('all').unlocked}/{getCategoryCount('all').total})
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, { name, color, emoji }]) => {
          const counts = getCategoryCount(key);
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === key
                  ? 'text-white'
                  : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10'
              }`}
              style={selectedCategory === key ? { backgroundColor: color } : {}}
              data-testid={`filter-${key}`}
            >
              <span>{emoji}</span>
              <span>{name}</span>
              <span className="text-xs opacity-70">({counts.unlocked}/{counts.total})</span>
            </button>
          );
        })}
      </div>

      {/* Unlocked Trophies */}
      {unlockedTrophies.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFD700]" />
            Débloqués ({unlockedTrophies.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unlockedTrophies.map(trophy => {
              const IconComponent = ICON_MAP[trophy.icon] || Trophy;
              const categoryInfo = CATEGORY_LABELS[trophy.category];
              return (
                <Card 
                  key={trophy.id} 
                  className="card-stat border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/10 to-transparent hover:scale-[1.02] transition-transform cursor-pointer"
                  data-testid={`trophy-${trophy.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${categoryInfo.color}20` }}
                      >
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: categoryInfo.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{trophy.name}</h4>
                        <p className="text-xs text-[#A1A1AA] mt-0.5 line-clamp-2">{trophy.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            className="text-[10px] px-2 py-0"
                            style={{ 
                              backgroundColor: `${categoryInfo.color}20`, 
                              color: categoryInfo.color 
                            }}
                          >
                            {categoryInfo.name}
                          </Badge>
                          {trophy.xp_reward && (
                            <span className="text-[10px] text-[#B0E301]">+{trophy.xp_reward} XP</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Trophies */}
      {lockedTrophies.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#52525B]">
            <Lock className="w-5 h-5" />
            À débloquer ({lockedTrophies.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {lockedTrophies.map(trophy => {
              const IconComponent = ICON_MAP[trophy.icon] || Trophy;
              const categoryInfo = CATEGORY_LABELS[trophy.category];
              return (
                <Card 
                  key={trophy.id} 
                  className="card-stat opacity-60 grayscale hover:opacity-80 hover:grayscale-[50%] transition-all cursor-pointer"
                  data-testid={`trophy-locked-${trophy.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-[#52525B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#A1A1AA] text-sm truncate">{trophy.name}</h4>
                        <p className="text-xs text-[#52525B] mt-0.5 line-clamp-2">{trophy.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="text-[10px] px-2 py-0 bg-white/5 text-[#52525B]">
                            {categoryInfo.name}
                          </Badge>
                          {trophy.xp_reward && (
                            <span className="text-[10px] text-[#52525B]">+{trophy.xp_reward} XP</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {filteredTrophies.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-[#52525B]" />
          <p className="text-[#A1A1AA]">
            {searchQuery ? 'Aucun trophée ne correspond à ta recherche' : 'Aucun trophée dans cette catégorie'}
          </p>
        </div>
      )}
    </div>
  );
};
