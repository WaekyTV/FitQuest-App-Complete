import { useState } from 'react';
import {
  User,
  Target,
  Scale,
  Ruler,
  Calendar,
  Edit2,
  Sparkles,
  Clock,
  TrendingDown,
  Flag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  const openEditDialog = () => {
    setEditData({
      name: user?.name || '',
      weight: user?.weight || '',
      height: user?.height || '',
      age: user?.age || '',
      gender: user?.gender || 'male',
      activity_level: user?.activity_level || 'moderate',
      goal: user?.goal || 'maintenance',
      level: user?.level || 'débutant',
      target_weight: user?.target_weight || '',
      sessions_per_week: user?.sessions_per_week || 4,
      birthdate: user?.birthdate || '',
      wants_intermittent_fasting: user?.wants_intermittent_fasting || false,
      is_cutting: user?.is_cutting || false
    });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {};
      Object.keys(editData).forEach(key => {
        if (editData[key] !== '' && editData[key] !== null) {
          updates[key] = editData[key];
        }
      });

      // Calculate age from birthdate if available
      if (editData.birthdate) {
        updates.age = calculateAge(editData.birthdate);
      }

      await updateUser(updates);
      setEditDialogOpen(false);
      toast.success('Profil mis à jour !');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const levelLabels = {
    'débutant': 'Débutant',
    'intermédiaire': 'Intermédiaire',
    'avancé': 'Avancé',
    'pro': 'Pro'
  };

  const secondaryGoalLabels = {
    'health_focus': 'Santé & Bien-être',
    'stress_reduction': 'Réduction du stress',
    'sleep_quality': 'Sommeil',
    'flexibility': 'Souplesse',
    'posture': 'Posture',
    'muscle_tone': 'Tonus musculaire',
    'stamina': 'Endurance',
    'strength': 'Force',
    'mobility': 'Mobilité',
    'healthy_relationship': 'Relation saine nourriture',
    'wellbeing': 'Bien-être général',
    'energy': 'Énergie au quotidien',
    'gut_health': 'Santé intestinale',
    'body_confidence': 'Confiance en soi',
    'sports_performance': 'Performances sportives',
    'reduce_stress': 'Réduire le stress',
    'learn_nutrition': 'Apprendre la nutrition'
  };

  const dietLabels = {
    'omnivore': 'Omnivore',
    'vegetarian': 'Végétarien',
    'vegan': 'Végan',
    'pescatarian': 'Pescatarien',
    'keto': 'Cétogène',
    'sans_viande': 'Sans viande',
    'balanced': 'Équilibré',
    'paleo': 'Paléo',
    'high_protein': 'Riche en protéines',
    'low_carb': 'Pauvre en glucides'
  };

  const habitLabels = {
    'grignotage': 'Grignotage',
    'sedentarite': 'Sédentarité',
    'manque_sommeil': 'Sommeil',
    'stress': 'Stress',
    'hydratation': 'Hydratation',
    'sucreries': 'Sucre',
    'alcool': 'Alcool',
    'reduce_sugar': 'Moins de sucre',
    'less_junk': 'Moins de malbouffe',
    'stop_cravings': 'Stopper grignotage',
    'more_vegetables': 'Plus de légumes',
    'stop_stress_eating': 'Mois de stress',
    'cook_more': 'Cuisiner plus',
    'reduce_salt': 'Moins de sel'
  };

  const calculateIMC = () => {
    if (!user?.weight || !user?.height) return null;
    const heightInMeters = user.height / 100;
    const imc = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    let category = '';
    if (imc < 18.5) category = 'Insuffisance';
    else if (imc < 25) category = 'Normal';
    else if (imc < 30) category = 'Surpoids';
    else category = 'Obésité';
    return { value: imc, category };
  };

  const imcData = calculateIMC();

  const genderLabels = {
    male: 'Homme',
    female: 'Femme'
  };

  const activityLabels = {
    sedentary: 'Sédentaire',
    light: 'Légèrement actif',
    moderate: 'Modérément actif',
    active: 'Très actif',
    very_active: 'Extrêmement actif'
  };

  const goalLabels = {
    maintenance: 'Maintien',
    muscle_gain: 'Prise de muscle',
    weight_loss: 'Perte de poids',
    endurance: 'Endurance'
  };

  return (
    <div className="space-y-6 animate-fade-in" data-testid="profile-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          MON <span className="text-[#6441a5]">PROFIL</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Gérez vos informations et préférences</p>
      </div>

      {/* Profile Card */}
      <Card className="ai-card" data-testid="profile-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-[#B0E301]/30">
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback className="bg-[#6441a5] text-white text-xl">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-[#A1A1AA] text-sm">{user?.email}</p>
              <p className="text-[#52525B] text-xs mt-1">
                Membre depuis {new Date(user?.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                <span className="tag tag-green">{goalLabels[user?.goal] || 'Maintenance'}</span>
                <span className="tag tag-purple">{levelLabels[user?.level] || 'Débutant'}</span>
                {user?.is_cutting && <span className="tag bg-red-500/20 text-red-400 border-red-500/30">🔥 Sèche</span>}
                {((user?.goal === 'weight_loss' && user?.weight <= user?.target_weight) ||
                  (user?.goal === 'muscle_gain' && user?.weight >= user?.target_weight)) && (
                    <span className="tag bg-[#B0E301]/20 text-[#B0E301] border-[#B0E301]/30">🏆 Objectif Atteint !</span>
                  )}
              </div>
            </div>

            <Button
              variant="outline"
              className="border-white/10 hover:border-[#B0E301]/30"
              onClick={openEditDialog}
              data-testid="edit-profile-btn"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats & Objectives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Physical Stats */}
        <Card className="card-stat" data-testid="physical-stats">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-[#B0E301]" />
              INFORMATIONS PHYSIQUES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-[#A1A1AA]" />
                  <span className="text-xs text-[#52525B]">Poids actuel</span>
                </div>
                <p className="text-xl font-bold font-mono">{user?.weight || '--'} kg</p>
              </div>

              <div className="p-4 rounded bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-4 h-4 text-[#A1A1AA]" />
                  <span className="text-xs text-[#52525B]">Taille</span>
                </div>
                <p className="text-xl font-bold font-mono">{user?.height || '--'} cm</p>
              </div>

              <div className="p-4 rounded bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#A1A1AA]" />
                  <span className="text-xs text-[#52525B]">Âge / Date</span>
                </div>
                <p className="text-xl font-bold font-mono">{user?.age || '--'} ans</p>
                {user?.birthdate && <p className="text-xs text-[#52525B]">{new Date(user.birthdate).toLocaleDateString()}</p>}
              </div>

              <div className="p-4 rounded bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#A1A1AA]" />
                  <span className="text-xs text-[#52525B]">Genre</span>
                </div>
                <p className="text-lg font-bold">{genderLabels[user?.gender] || '--'}</p>
              </div>

              {imcData && (
                <div className="p-4 rounded bg-white/[0.02] border border-white/5 col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#A1A1AA]" />
                      <span className="text-xs text-[#52525B]">Indice de Masse Corporelle (IMC)</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${imcData.category === 'Normal' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                      {imcData.category}
                    </span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-[#B0E301]">{imcData.value}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Objectives & Nutrition */}
        <Card className="card-stat" data-testid="objectives">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-[#6441a5]" />
              MES OBJECTIFS
              <span className="tag tag-green text-xs ml-2">Apprentissage IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A1A1AA]">Objectif poids</span>
                <span className="font-mono text-sm font-medium">{user?.target_weight || '--'} kg</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill-green"
                  style={{
                    width: user?.weight && user?.target_weight
                      ? `${Math.min(100, (user.weight / user.target_weight) * 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#A1A1AA]">Calories /j</span>
                  <span className="text-xs text-[#B0E301]">✨ IA</span>
                </div>
                <span className="font-mono text-sm font-medium">{user?.daily_calories || '--'} kcal</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill-purple" style={{ width: '100%' }} />
              </div>
            </div>

            {/* AI Weight Loss Details */}
            {user?.goal === 'weight_loss' && (
              <div className="pt-4 mt-2 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#B0E301]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B0E301]">Détails de l'objectif IA</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-[#A1A1AA]" />
                      <span className="text-[10px] text-[#52525B] uppercase">Durée</span>
                    </div>
                    <p className="text-sm font-bold text-white">{user?.target_weeks || '--'} semaines</p>
                  </div>

                  <div className="p-3 rounded bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="w-3 h-3 text-[#A1A1AA]" />
                      <span className="text-[10px] text-[#52525B] uppercase">Perte Totale</span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {user?.weight && user?.target_weight ? (user.weight - user.target_weight).toFixed(1) : '--'} kg
                      <span className="text-[10px] text-[#52525B] ml-1 font-normal">
                        ({user?.weekly_weight_loss || 0.5}kg/sem)
                      </span>
                    </p>
                  </div>

                  <div className="p-3 rounded bg-white/[0.03] border border-white/5 col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Flag className="w-3 h-3 text-[#B0E301]" />
                      <span className="text-[10px] text-[#52525B] uppercase">Objectif Atteint le</span>
                    </div>
                    <p className="text-sm font-bold text-[#B0E301]">
                      {(() => {
                        const startDate = user?.onboarding_date ? new Date(user.onboarding_date) : new Date(user?.created_at);
                        const targetDate = new Date(startDate);
                        targetDate.setDate(targetDate.getDate() + (user?.target_weeks || 12) * 7);
                        return targetDate.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        });
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* IF Context */}
            {user?.wants_intermittent_fasting && (
              <div className="p-3 rounded bg-[#B0E301]/10 border border-[#B0E301]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B0E301]" />
                  <span className="text-xs font-bold text-[#B0E301]">JEÛNE INTERMITTENT ACTIF</span>
                </div>
                <span className="text-[10px] text-[#A1A1AA]">L'IA adapte vos repas</span>
              </div>
            )}

            {user?.caloric_deficit_kcal && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#A1A1AA]">Déficit choisi</span>
                  <span className="text-xs font-bold text-red-400">-{user.caloric_deficit_kcal} kcal</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div>
                <span className="text-[10px] uppercase text-[#52525B] block mb-1">Activité</span>
                <p className="text-xs font-medium truncate">{activityLabels[user?.activity_level] || '--'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#52525B] block mb-1">Entraînements</span>
                <p className="text-xs font-medium">{user?.sessions_per_week || 4} séances/sem</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LifeStyles & Habits (New Section) */}
        <Card className="card-stat lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B0E301]" />
              MODE DE VIE & PRÉFÉRENCES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Secondary Goals */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-2">
                  <Edit2 className="w-3 h-3" /> Focus Additionnels
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(user?.secondary_goals || []).length > 0 ? (
                    user.secondary_goals.map(g => (
                      <span key={g} className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white">
                        {secondaryGoalLabels[g] || g.replace('_', ' ')}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#52525B]">Aucun spécifié</span>
                  )}
                </div>
              </div>

              {/* Diet Pref */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-3 h-3" /> Alimentation
                </h4>
                <div>
                  <p className="text-sm font-bold text-[#B0E301] capitalize">
                    {dietLabels[user?.diet_preference] || user?.diet_preference || 'Omnivore'}
                  </p>
                  <p className="text-[10px] text-[#52525B] mt-1 italic">
                    {user?.eating_location === 'bureau' ? 'Mange souvent au bureau' : 'Mange principalement à domicile'}
                  </p>
                </div>
              </div>

              {/* Restrictions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-2">
                  <Ruler className="w-3 h-3" /> Exclusions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(user?.dietary_restrictions || []).length > 0 ? (
                    user.dietary_restrictions.map(r => (
                      <span key={r} className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold uppercase">
                        SANS {r.replace('sans_', '').toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#52525B]">Aucune restriction</span>
                  )}
                </div>
              </div>

              {/* Habits */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-3 h-3" /> Habitudes à améliorer
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(user?.habits_to_change || []).length > 0 ? (
                    user.habits_to_change.map(h => (
                      <span key={h} className="px-2 py-1 rounded-full bg-[#6441a5]/10 border border-[#6441a5]/30 text-[10px] text-[#b49fdb]">
                        {habitLabels[h] || h.replace('_', ' ')}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#52525B]">Aucun challenge</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le Profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Nom</Label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Genre</Label>
                <Select
                  value={editData.gender}
                  onValueChange={(v) => setEditData(prev => ({ ...prev, gender: v }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date de naissance</Label>
                <Input
                  type="date"
                  value={editData.birthdate}
                  onChange={(e) => setEditData(prev => ({ ...prev, birthdate: e.target.value }))}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Poids (kg)</Label>
                <Input
                  type="number"
                  value={editData.weight}
                  onChange={(e) => setEditData(prev => ({ ...prev, weight: parseFloat(e.target.value) || '' }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Taille (cm)</Label>
                <Input
                  type="number"
                  value={editData.height}
                  onChange={(e) => setEditData(prev => ({ ...prev, height: parseFloat(e.target.value) || '' }))}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Niveau d'activité</Label>
              <Select
                value={editData.activity_level}
                onValueChange={(v) => setEditData(prev => ({ ...prev, activity_level: v }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sédentaire (peu ou pas d'exercice)</SelectItem>
                  <SelectItem value="light">Légèrement actif (1-3 jours/sem)</SelectItem>
                  <SelectItem value="moderate">Modérément actif (3-5 jours/sem)</SelectItem>
                  <SelectItem value="active">Très actif (6-7 jours/sem)</SelectItem>
                  <SelectItem value="very_active">Extrêmement actif (athlète)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Objectif</Label>
                <Select
                  value={editData.goal}
                  onValueChange={(v) => setEditData(prev => ({ ...prev, goal: v }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintien</SelectItem>
                    <SelectItem value="muscle_gain">Prise de muscle</SelectItem>
                    <SelectItem value="weight_loss">Perte de poids</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Niveau</Label>
                <Select
                  value={editData.level}
                  onValueChange={(v) => setEditData(prev => ({ ...prev, level: v }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="débutant">Débutant</SelectItem>
                    <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="avancé">Avancé</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Poids cible (kg)</Label>
                <Input
                  type="number"
                  value={editData.target_weight}
                  onChange={(e) => setEditData(prev => ({ ...prev, target_weight: parseFloat(e.target.value) || '' }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Séances/semaine: <span className="text-[#B0E301] font-bold">{editData.sessions_per_week}</span></Label>
                <Slider
                  value={[editData.sessions_per_week]}
                  onValueChange={([v]) => setEditData(prev => ({ ...prev, sessions_per_week: v }))}
                  min={1}
                  max={7}
                  step={1}
                  className="mt-4"
                />
                <div className="flex justify-between text-xs text-[#52525B] mt-1">
                  <span>1</span>
                  <span>7+</span>
                </div>
              </div>
            </div>


            <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="space-y-0.5">
                <Label className="text-base">Jeûne Intermittent</Label>
                <p className="text-xs text-[#A1A1AA]">
                  Intégrer le jeûne à votre plan (l'IA ajustera vos repas)
                </p>
              </div>
              <Switch
                checked={editData.wants_intermittent_fasting}
                onCheckedChange={(c) => setEditData(prev => ({ ...prev, wants_intermittent_fasting: c }))}
              />
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${((user?.goal === 'weight_loss' && user?.weight <= user?.target_weight) ||
              (user?.goal === 'muscle_gain' && user?.weight >= user?.target_weight))
              ? 'border-[#B0E301]/40 bg-[#B0E301]/5'
              : 'border-white/10 bg-white/[0.02]'
              }`}>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label className="text-base">Mode Sèche (Cutting)</Label>
                  {((user?.goal === 'weight_loss' && user?.weight <= user?.target_weight) ||
                    (user?.goal === 'muscle_gain' && user?.weight >= user?.target_weight)) && (
                      <span className="text-[10px] font-bold text-[#B0E301] uppercase">Recommandé ✨</span>
                    )}
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  Priorité à la définition musculaire et volume alimentaire
                </p>
              </div>
              <Switch
                checked={editData.is_cutting}
                onCheckedChange={(c) => setEditData(prev => ({ ...prev, is_cutting: c }))}
              />
            </div>

            <div className="p-3 rounded bg-[#B0E301]/10 border border-[#B0E301]/30">
              <p className="text-sm text-[#B0E301] font-medium mb-1">✨ Calcul automatique</p>
              <p className="text-xs text-[#A1A1AA]">
                Les calories et protéines seront calculées automatiquement selon votre âge, poids, taille, objectif et niveau d'activité.
              </p>
            </div>

            <Button onClick={handleSave} disabled={saving} variant="brand" className="w-full">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
};
