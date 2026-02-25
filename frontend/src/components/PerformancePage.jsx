import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Dumbbell,
  Flame,
  Calendar,
  Plus,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E1E1E] border border-white/10 rounded p-3">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}{entry.name === 'poids' ? 'kg' : entry.name === 'calories' ? ' kcal' : ' min'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PerformancePage = () => {
  const [stats, setStats] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    exercise_name: '',
    value: '',
    unit: 'kg',
    date: new Date().toISOString().split('T')[0]
  });
  const [newWeight, setNewWeight] = useState({
    weight: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, weightRes, logsRes, recordsRes] = await Promise.all([
        axios.get(`${API}/performance/stats`, { withCredentials: true }),
        axios.get(`${API}/performance/weight`, { withCredentials: true }),
        axios.get(`${API}/workout-logs`, { withCredentials: true }),
        axios.get(`${API}/performance/records`, { withCredentials: true })
      ]);
      setStats(statsRes.data);
      setWeightHistory(weightRes.data);
      setWorkoutLogs(logsRes.data);
      setRecords(recordsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!newRecord.exercise_name || !newRecord.value) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    try {
      const response = await axios.post(`${API}/performance/records`, newRecord, { withCredentials: true });
      setRecords(prev => [response.data, ...prev]);
      setRecordDialogOpen(false);
      setNewRecord({
        exercise_name: '',
        value: '',
        unit: 'kg',
        date: new Date().toISOString().split('T')[0]
      });
      toast.success('Record ajouté !');
    } catch (error) {
      console.error('Error adding record:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight.weight) {
      toast.error('Veuillez entrer votre poids');
      return;
    }
    try {
      const response = await axios.post(
        `${API}/performance/weight?weight=${newWeight.weight}&date=${newWeight.date}`,
        {},
        { withCredentials: true }
      );
      setWeightHistory(prev => [response.data, ...prev]);
      setWeightDialogOpen(false);
      setNewWeight({
        weight: '',
        date: new Date().toISOString().split('T')[0]
      });
      toast.success('Poids enregistré !');
    } catch (error) {
      console.error('Error adding weight:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  // Prepare chart data
  const weightChartData = weightHistory
    .slice(0, 8)
    .reverse()
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      poids: entry.weight
    }));

  const weeklyActivityData = [];
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLogs = workoutLogs.filter(l => l.date === dateStr);
    weeklyActivityData.push({
      day: days[d.getDay() === 0 ? 6 : d.getDay() - 1],
      calories: dayLogs.reduce((sum, l) => sum + (l.calories_burned || 0), 0),
      duration: dayLogs.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="performance-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            MES <span className="text-[#B0E301]">PERFORMANCES</span>
          </h1>
          <p className="text-[#A1A1AA] mt-1 text-sm">Suivez votre progression et atteignez vos objectifs</p>
        </div>
        <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="brand" className="px-6 py-3" data-testid="add-record-btn">
              <Trophy className="w-4 h-4 mr-2" />
              Nouveau Record
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0A] border-white/10">
            <DialogHeader>
              <DialogTitle>Ajouter un Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Exercice</Label>
                <Input
                  value={newRecord.exercise_name}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, exercise_name: e.target.value }))}
                  placeholder="Ex: Développé Couché"
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valeur</Label>
                  <Input
                    value={newRecord.value}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Ex: 100"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Unité</Label>
                  <Input
                    value={newRecord.unit}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="kg, reps, etc."
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <Button onClick={handleAddRecord} variant="brand" className="w-full">
                Ajouter le record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="card-stat" data-testid="stat-weight-loss">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-5 h-5 text-[#B0E301]" />
              {weightHistory.length >= 2 && (
                <span className="text-xs text-[#B0E301] font-medium">
                  {((weightHistory[0]?.weight - weightHistory[weightHistory.length - 1]?.weight) / weightHistory[weightHistory.length - 1]?.weight * 100).toFixed(1)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold font-mono">
              {weightHistory.length >= 2
                ? `${(weightHistory[weightHistory.length - 1]?.weight - weightHistory[0]?.weight).toFixed(1)}kg`
                : '0kg'
              }
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">Évolution poids</p>
          </CardContent>
        </Card>

        <Card className="card-stat" data-testid="stat-sessions">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Dumbbell className="w-5 h-5 text-[#6441a5]" />
              <span className="text-xs text-[#6441a5] font-medium">{stats?.workouts_this_month || 0}</span>
            </div>
            <p className="text-2xl font-bold font-mono">{stats?.workouts_this_month || 0}</p>
            <p className="text-xs text-[#A1A1AA] mt-1">Séances ce mois</p>
          </CardContent>
        </Card>

        <Card className="card-stat" data-testid="stat-streak">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-[#FFD600]" />
              <span className="text-xs text-[#FFD600] font-medium">{stats?.streak || 0}j</span>
            </div>
            <p className="text-2xl font-bold font-mono">{stats?.streak || 0}</p>
            <p className="text-xs text-[#A1A1AA] mt-1">Streak actuel</p>
          </CardContent>
        </Card>

        <Card className="card-stat" data-testid="stat-calories">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-[#FF3333]" />
            </div>
            <p className="text-2xl font-bold font-mono">{stats?.calories_burned_this_week || 0}</p>
            <p className="text-xs text-[#A1A1AA] mt-1">Calories brûlées</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progress */}
        <Card className="card-stat" data-testid="weight-chart">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#B0E301]" />
                ÉVOLUTION DU POIDS
              </CardTitle>
              <Dialog open={weightDialogOpen} onOpenChange={setWeightDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0A0A0A] border-white/10">
                  <DialogHeader>
                    <DialogTitle>Enregistrer le Poids</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Poids (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newWeight.weight}
                        onChange={(e) => setNewWeight(prev => ({ ...prev, weight: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newWeight.date}
                        onChange={(e) => setNewWeight(prev => ({ ...prev, date: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                    <Button onClick={handleAddWeight} variant="brand" className="w-full">
                      Enregistrer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {weightChartData.length > 0 ? (
              <div className="h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightChartData}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B0E301" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#B0E301" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#52525B" fontSize={12} />
                    <YAxis stroke="#52525B" fontSize={12} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="poids"
                      stroke="#B0E301"
                      strokeWidth={2}
                      fill="url(#weightGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-[#52525B]">Aucune donnée de poids</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="card-stat" data-testid="weekly-activity">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#6441a5]" />
              ACTIVITÉ HEBDOMADAIRE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#52525B" fontSize={12} />
                  <YAxis stroke="#52525B" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="calories" fill="#6441a5" radius={[4, 4, 0, 0]} name="calories" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Records */}
      <Card className="card-stat" data-testid="personal-records">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#FFD600]" />
            RECORDS PERSONNELS
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {records.slice(0, 8).map((record, index) => (
                <div
                  key={record.record_id}
                  className="flex items-center justify-between p-4 rounded bg-white/[0.02] hover:bg-white/[0.04] transition-colors border-l-2 border-[#B0E301]"
                  data-testid={`record-${index}`}
                >
                  <div>
                    <p className="font-medium text-sm">{record.exercise_name}</p>
                    <p className="text-xs text-[#52525B]">{record.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#B0E301]">
                      {record.value}{record.unit}
                    </span>
                    <TrendingUp className="w-4 h-4 text-[#B0E301]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-10 h-10 text-[#52525B] mx-auto mb-3" />
              <p className="text-[#A1A1AA] mb-4">Aucun record enregistré</p>
              <Button onClick={() => setRecordDialogOpen(true)} variant="brand">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un record
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
