import { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Plus,
  Trash2,
  TrendingUp,
  Clock,
  Star,
  Calendar,
  Bed,
  Coffee,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const SleepPage = () => {
  const { user } = useAuth();
  const [sleepData, setSleepData] = useState({ entries: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '23:00',
    wake_time: '07:00',
    quality: 3,
    notes: ''
  });

  useEffect(() => {
    fetchSleepData();
  }, []);

  const fetchSleepData = async () => {
    try {
      const response = await axios.get(`${API}/sleep?days=30`, { withCredentials: true });
      setSleepData(response.data);
    } catch (error) {
      console.error('Error fetching sleep data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/sleep`, newEntry, { withCredentials: true });
      toast.success('Sommeil enregistré ! +5 XP');
      setDialogOpen(false);
      setEditingEntry(null);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        bedtime: '23:00',
        wake_time: '07:00',
        quality: 3,
        notes: ''
      });
      fetchSleepData();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (date) => {
    if (!confirm('Supprimer cette entrée ?')) return;
    try {
      await axios.delete(`${API}/sleep/${date}`, { withCredentials: true });
      toast.success('Entrée supprimée');
      fetchSleepData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditDialog = (entry) => {
    setEditingEntry(entry);
    setNewEntry({
      date: entry.date,
      bedtime: entry.bedtime,
      wake_time: entry.wake_time,
      quality: entry.quality,
      notes: entry.notes || ''
    });
    setDialogOpen(true);
  };

  const getQualityColor = (quality) => {
    if (quality >= 4) return '#B0E301';
    if (quality >= 3) return '#FFD700';
    if (quality >= 2) return '#FF6B35';
    return '#EF4444';
  };

  const getQualityLabel = (quality) => {
    const labels = ['', 'Très mauvais', 'Mauvais', 'Moyen', 'Bon', 'Excellent'];
    return labels[quality] || 'Moyen';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="sleep-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <Moon className="w-7 h-7 text-[#6441a5]" />
            <span className="text-[#6441a5]">Suivi du</span> Sommeil
          </h1>
          <p className="text-[#52525B] mt-1 text-sm">Analysez vos habitudes de sommeil</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="brand" data-testid="add-sleep-btn">
              <Plus className="w-4 h-4 mr-2" />
              Enregistrer une nuit
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0A] border-white/10">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Modifier' : 'Nouvelle'} entrée de sommeil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-[#6441a5]" />
                    Coucher
                  </Label>
                  <Input
                    type="time"
                    value={newEntry.bedtime}
                    onChange={(e) => setNewEntry({ ...newEntry, bedtime: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#FFD700]" />
                    Réveil
                  </Label>
                  <Input
                    type="time"
                    value={newEntry.wake_time}
                    onChange={(e) => setNewEntry({ ...newEntry, wake_time: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-[#FFD700]" />
                  Qualité du sommeil
                </Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((q) => (
                    <button
                      key={q}
                      onClick={() => setNewEntry({ ...newEntry, quality: q })}
                      className={`flex-1 py-3 rounded-lg border transition-all ${newEntry.quality === q
                        ? 'border-[#B0E301] bg-[#B0E301]/10'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                      <Star className={`w-5 h-5 mx-auto ${newEntry.quality >= q ? 'text-[#FFD700] fill-current' : 'text-[#52525B]'}`} />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-[#A1A1AA] mt-2">{getQualityLabel(newEntry.quality)}</p>
              </div>

              <div>
                <Label>Notes (optionnel)</Label>
                <Textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="Comment vous sentez-vous ?"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <Button onClick={handleSubmit} variant="brand" className="w-full">
                {editingEntry ? 'Mettre à jour' : 'Enregistrer'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-stat">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#6441a5]/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#6441a5]" />
              </div>
              <div>
                <p className="text-xs text-[#52525B]">Durée moyenne</p>
                <p className="text-2xl font-bold font-mono">{sleepData.stats?.avg_duration || 0}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stat">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#FFD700]/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <p className="text-xs text-[#52525B]">Qualité moyenne</p>
                <p className="text-2xl font-bold font-mono">{sleepData.stats?.avg_quality || 0}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stat">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#B0E301]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#B0E301]" />
              </div>
              <div>
                <p className="text-xs text-[#52525B]">Objectif</p>
                <p className="text-2xl font-bold font-mono">{sleepData.stats?.target_hours || 8}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stat">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#00BFFF]/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#00BFFF]" />
              </div>
              <div>
                <p className="text-xs text-[#52525B]">Nuits suivies</p>
                <p className="text-2xl font-bold font-mono">{sleepData.stats?.total_entries || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Progress */}
      {sleepData.stats?.avg_duration > 0 && (
        <Card className="card-stat">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Objectif de sommeil</span>
              <span className="text-sm font-mono">
                {sleepData.stats.avg_duration}h / {sleepData.stats.target_hours}h
              </span>
            </div>
            <Progress
              value={Math.min((sleepData.stats.avg_duration / sleepData.stats.target_hours) * 100, 100)}
              className="h-3"
            />
          </CardContent>
        </Card>
      )}

      {/* Sleep Entries */}
      <Card className="card-stat">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bed className="w-4 h-4 text-[#6441a5]" />
            HISTORIQUE DES NUITS
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sleepData.entries?.length > 0 ? (
            <div className="space-y-3">
              {sleepData.entries.map((entry) => (
                <div
                  key={entry.date}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  data-testid={`sleep-entry-${entry.date}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-[#52525B]">
                        {new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </p>
                      <p className="font-bold">
                        {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Moon className="w-4 h-4 text-[#6441a5]" />
                        <span>{entry.bedtime}</span>
                      </div>
                      <span className="text-[#52525B]">→</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Sun className="w-4 h-4 text-[#FFD700]" />
                        <span>{entry.wake_time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#A1A1AA]" />
                      <span className="font-mono">{entry.duration_hours}h</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((q) => (
                        <Star
                          key={q}
                          className={`w-4 h-4 ${entry.quality >= q ? 'text-[#FFD700] fill-current' : 'text-[#52525B]'}`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(entry)}
                        className="text-[#A1A1AA] hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.date)}
                        className="text-[#EF4444] hover:text-[#EF4444]/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Moon className="w-12 h-12 text-[#52525B] mx-auto mb-4" />
              <p className="text-[#A1A1AA] mb-4">Aucune nuit enregistrée</p>
              <Button onClick={() => setDialogOpen(true)} variant="brand">
                <Plus className="w-4 h-4 mr-2" />
                Enregistrer votre première nuit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
