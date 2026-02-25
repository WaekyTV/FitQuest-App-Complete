import { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Clock,
  Droplet,
  Dumbbell,
  Calendar,
  Edit2,
  X,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const REMINDER_TYPES = {
  workout: { label: 'Entraînement', icon: Dumbbell, color: '#B0E301' },
  water: { label: 'Hydratation', icon: Droplet, color: '#00BFFF' },
  custom: { label: 'Personnalisé', icon: Bell, color: '#6441a5' }
};

const DAYS = [
  { key: 'monday', label: 'Lun' },
  { key: 'tuesday', label: 'Mar' },
  { key: 'wednesday', label: 'Mer' },
  { key: 'thursday', label: 'Jeu' },
  { key: 'friday', label: 'Ven' },
  { key: 'saturday', label: 'Sam' },
  { key: 'sunday', label: 'Dim' }
];

export const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    type: 'workout',
    title: '',
    time: '09:00',
    days: [],
    enabled: true,
    interval_hours: null
  });

  useEffect(() => {
    fetchReminders();
    requestNotificationPermission();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${API}/reminders`, { withCredentials: true });
      setReminders(res.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Veuillez entrer un titre');
      return;
    }

    try {
      if (editingReminder) {
        await axios.put(`${API}/reminders/${editingReminder.reminder_id}`, formData, { withCredentials: true });
        toast.success('Rappel modifié');
      } else {
        await axios.post(`${API}/reminders`, formData, { withCredentials: true });
        toast.success('Rappel créé');
      }

      fetchReminders();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (reminderId) => {
    try {
      await axios.delete(`${API}/reminders/${reminderId}`, { withCredentials: true });
      toast.success('Rappel supprimé');
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggle = async (reminder) => {
    try {
      await axios.patch(`${API}/reminders/${reminder.reminder_id}/toggle`, {}, { withCredentials: true });
      fetchReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'workout',
      title: '',
      time: '09:00',
      days: [],
      enabled: true,
      interval_hours: null
    });
    setEditingReminder(null);
  };

  const openEditDialog = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      type: reminder.type,
      title: reminder.title,
      time: reminder.time,
      days: reminder.days || [],
      enabled: reminder.enabled,
      interval_hours: reminder.interval_hours
    });
    setDialogOpen(true);
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  // Set up notification scheduler (simplified - would need service worker for background)
  useEffect(() => {
    if (Notification.permission !== 'granted') return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1].key;

      reminders.forEach(reminder => {
        if (!reminder.enabled) return;

        const shouldNotify = reminder.time === currentTime &&
          (reminder.days.length === 0 || reminder.days.includes(currentDay));

        if (shouldNotify) {
          new Notification(`FitQuest - ${REMINDER_TYPES[reminder.type]?.label}`, {
            body: reminder.title,
            icon: '/favicon.ico',
            tag: reminder.reminder_id
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="reminders-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            MES <span className="text-[#6441a5]">RAPPELS</span>
          </h1>
          <p className="text-[#A1A1AA] mt-1 text-sm">
            Configurez vos notifications d'entraînement et d'hydratation
          </p>
        </div>
        <Button variant="brand"
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          data-testid="add-reminder-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rappel
        </Button>
      </div>

      {/* Notification Permission Banner */}
      {Notification.permission !== 'granted' && (
        <Card className="card-stat border-[#FFD600]/30 bg-[#FFD600]/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#FFD600]" />
              <p className="text-sm">Activez les notifications pour recevoir vos rappels</p>
            </div>
            <Button
              size="sm"
              onClick={requestNotificationPermission}
              className="bg-[#FFD600] text-black hover:bg-[#FFD600]/80"
            >
              Activer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Add Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className="card-stat cursor-pointer hover:border-[#B0E301]/30 transition-all"
          onClick={() => {
            setFormData({
              type: 'workout',
              title: 'C\'est l\'heure de l\'entraînement !',
              time: '18:00',
              days: ['monday', 'wednesday', 'friday'],
              enabled: true,
              interval_hours: null
            });
            setDialogOpen(true);
          }}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#B0E301]/20 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-[#B0E301]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Rappel Entraînement</p>
              <p className="text-xs text-[#52525B]">Lun, Mer, Ven - 18h</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="card-stat cursor-pointer hover:border-[#00BFFF]/30 transition-all"
          onClick={() => {
            setFormData({
              type: 'water',
              title: 'N\'oublie pas de boire !',
              time: '09:00',
              days: [],
              enabled: true,
              interval_hours: 1
            });
            setDialogOpen(true);
          }}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00BFFF]/20 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-[#00BFFF]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Rappel Hydratation</p>
              <p className="text-xs text-[#52525B]">Toutes les heures</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="card-stat cursor-pointer hover:border-[#6441a5]/30 transition-all"
          onClick={() => {
            setFormData({
              type: 'custom',
              title: '',
              time: '12:00',
              days: [],
              enabled: true,
              interval_hours: null
            });
            setDialogOpen(true);
          }}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#6441a5]/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#6441a5]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Personnalisé</p>
              <p className="text-xs text-[#52525B]">Créer votre rappel</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <Card className="card-stat">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B0E301]" />
            RAPPELS ACTIFS ({reminders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto mb-4 text-[#52525B]" />
              <p className="text-[#A1A1AA] mb-2">Aucun rappel configuré</p>
              <p className="text-xs text-[#52525B]">Créez votre premier rappel pour ne rien oublier</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => {
                const typeInfo = REMINDER_TYPES[reminder.type] || REMINDER_TYPES.custom;
                const Icon = typeInfo.icon;

                return (
                  <div
                    key={reminder.reminder_id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${reminder.enabled
                        ? 'border-white/10 bg-white/[0.02]'
                        : 'border-white/5 bg-white/[0.01] opacity-60'
                      }`}
                    data-testid={`reminder-${reminder.reminder_id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${typeInfo.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: typeInfo.color }} />
                      </div>
                      <div>
                        <p className="font-semibold">{reminder.title}</p>
                        <div className="flex items-center gap-2 text-xs text-[#52525B]">
                          <span className="font-mono text-[#B0E301]">{reminder.time}</span>
                          <span>•</span>
                          <span>
                            {reminder.days?.length > 0
                              ? reminder.days.map(d => DAYS.find(day => day.key === d)?.label).join(', ')
                              : 'Tous les jours'}
                          </span>
                          {reminder.interval_hours && (
                            <>
                              <span>•</span>
                              <span>Toutes les {reminder.interval_hours}h</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => handleToggle(reminder)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(reminder)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(reminder.reminder_id)}
                        className="h-8 w-8 p-0 text-[#FF3333]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10">
          <DialogHeader>
            <DialogTitle>
              {editingReminder ? 'Modifier le Rappel' : 'Nouveau Rappel'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Type */}
            <div>
              <Label>Type de rappel</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(REMINDER_TYPES).map(([key, { label, icon: Icon, color }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color }} />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label>Message</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: C'est l'heure de l'entraînement !"
                className="mt-2"
              />
            </div>

            {/* Time */}
            <div>
              <Label>Heure</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="mt-2"
              />
            </div>

            {/* Days */}
            <div>
              <Label>Jours (vide = tous les jours)</Label>
              <div className="flex gap-2 mt-2">
                {DAYS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleDay(key)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${formData.days.includes(key)
                        ? 'bg-[#B0E301] text-black'
                        : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interval for water type */}
            {formData.type === 'water' && (
              <div>
                <Label>Répéter toutes les X heures</Label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.interval_hours || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    interval_hours: e.target.value ? parseInt(e.target.value) : null
                  }))}
                  placeholder="1"
                  className="mt-2"
                />
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                variant="brand" className="flex-1"
              >
                {editingReminder ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
