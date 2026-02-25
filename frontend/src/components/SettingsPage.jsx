import { useState, useEffect, useCallback } from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Play,
  Zap,
  Trophy,
  ArrowUp,
  Star,
  Sparkles,
  Moon,
  Sun,
  Globe,
  User,
  Shield,
  Download,
  Trash2,
  ChevronRight,
  Check,
  Dumbbell,
  Droplet,
  Footprints,
  Apple,
  AlertTriangle,
  Flame,
  Clock,
  FileText,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// 8-bit Notification Sound Generator
const createNotificationSound = (volume = 0.3) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
  masterGain.gain.value = volume;

  // Notification sound - ascending cheerful melody
  const notes = [
    { freq: 523.25, duration: 0.1, delay: 0 },      // C5
    { freq: 659.25, duration: 0.1, delay: 0.1 },    // E5
    { freq: 783.99, duration: 0.15, delay: 0.2 },   // G5
    { freq: 1046.50, duration: 0.2, delay: 0.35 },  // C6
  ];

  notes.forEach(note => {
    const oscillator = audioContext.createOscillator();
    const noteGain = audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.value = note.freq;

    noteGain.gain.setValueAtTime(0, audioContext.currentTime + note.delay);
    noteGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + note.delay + 0.02);
    noteGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + note.delay + note.duration);

    oscillator.connect(noteGain);
    noteGain.connect(masterGain);

    oscillator.start(audioContext.currentTime + note.delay);
    oscillator.stop(audioContext.currentTime + note.delay + note.duration);
  });
};

// Sound system
class SoundSystem {
  constructor() {
    this.volume = 0.3;
    this.enabled = true;
  }

  setVolume(vol) {
    this.volume = vol;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  playXPGain() {
    if (!this.enabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  }

  playLevelUp() {
    if (!this.enabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = this.volume;

    const notes = [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.1 },
      { freq: 783.99, time: 0.2 },
      { freq: 1046.50, time: 0.3 },
    ];

    notes.forEach(note => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'square';
      osc.frequency.value = note.freq;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + 0.15);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(audioContext.currentTime + note.time);
      osc.stop(audioContext.currentTime + note.time + 0.2);
    });
  }

  playMegaLevelUp() {
    if (!this.enabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = this.volume;

    const notes = [
      { freq: 261.63, time: 0, duration: 0.15 },
      { freq: 329.63, time: 0.15, duration: 0.15 },
      { freq: 392.00, time: 0.3, duration: 0.15 },
      { freq: 523.25, time: 0.45, duration: 0.2 },
      { freq: 659.25, time: 0.65, duration: 0.2 },
      { freq: 783.99, time: 0.85, duration: 0.3 },
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
  }

  playTrophyUnlock() {
    if (!this.enabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = this.volume;

    // Magical sparkle sound
    for (let i = 0; i < 5; i++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.value = 800 + Math.random() * 1200;
      gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.08 + 0.15);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(audioContext.currentTime + i * 0.08);
      osc.stop(audioContext.currentTime + i * 0.08 + 0.2);
    }
  }

  playNotification() {
    if (!this.enabled) return;
    createNotificationSound(this.volume);
  }

  playChallengeComplete() {
    if (!this.enabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = this.volume;

    // Victory fanfare
    const notes = [
      { freq: 392.00, time: 0, duration: 0.15 },     // G4
      { freq: 392.00, time: 0.15, duration: 0.15 },  // G4
      { freq: 392.00, time: 0.3, duration: 0.15 },   // G4
      { freq: 311.13, time: 0.45, duration: 0.3 },   // Eb4
      { freq: 349.23, time: 0.75, duration: 0.1 },   // F4
      { freq: 392.00, time: 0.85, duration: 0.15 },  // G4
      { freq: 349.23, time: 1.0, duration: 0.1 },    // F4
      { freq: 392.00, time: 1.1, duration: 0.4 },    // G4
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
  }

  playBirthday() {
    if (!this.enabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = this.volume;

    const notes = [
      { freq: 261.63, time: 0, duration: 0.2 },    // Happy
      { freq: 261.63, time: 0.25, duration: 0.2 }, // Happy
      { freq: 293.66, time: 0.5, duration: 0.4 },  // Birth
      { freq: 261.63, time: 1.0, duration: 0.4 },  // day
      { freq: 349.23, time: 1.5, duration: 0.4 },  // to
      { freq: 329.63, time: 2.0, duration: 0.8 },  // You
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
  }
}

const soundSystem = new SoundSystem();

export const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const [volume, setVolume] = useState(0.3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [lastPlayed, setLastPlayed] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteHistoryDialogOpen, setDeleteHistoryDialogOpen] = useState(false);
  const [historyTypeToDelete, setHistoryTypeToDelete] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteHistoryLoading, setDeleteHistoryLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Streak reminder settings
  const [streakReminderEnabled, setStreakReminderEnabled] = useState(false);
  const [streakReminderTime, setStreakReminderTime] = useState('20:00');

  // Appearance settings

  // Appearance settings
  const { darkMode, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    // Load saved settings from localStorage
    const savedVolume = localStorage.getItem('fitquest_volume');
    const savedSoundEnabled = localStorage.getItem('fitquest_sound_enabled');
    const savedNotifications = localStorage.getItem('fitquest_notifications');

    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      soundSystem.setVolume(vol);
    }
    if (savedSoundEnabled !== null) {
      const enabled = savedSoundEnabled === 'true';
      setSoundEnabled(enabled);
      soundSystem.setEnabled(enabled);
    }
    if (savedNotifications) {
      setNotificationsEnabled(savedNotifications === 'true');
    }

    // Load streak local storage values first
    const savedStreakReminder = localStorage.getItem('fitquest_streak_reminder');
    const savedStreakReminderTime = localStorage.getItem('fitquest_streak_reminder_time');

    // Load streak reminder settings from User profile (DB sync)
    if (user) {
      if (user.streak_reminder_enabled !== undefined) {
        setStreakReminderEnabled(user.streak_reminder_enabled);
        localStorage.setItem('fitquest_streak_reminder', user.streak_reminder_enabled.toString());
      } else if (savedStreakReminder !== null) {
        setStreakReminderEnabled(savedStreakReminder === 'true');
      }

      if (user.streak_reminder_time) {
        setStreakReminderTime(user.streak_reminder_time);
        localStorage.setItem('fitquest_streak_reminder_time', user.streak_reminder_time);
      } else if (savedStreakReminderTime) {
        setStreakReminderTime(savedStreakReminderTime);
      }
    } else {
      // Fallback for when user isn't loaded (auth loading issue edge case)
      if (savedStreakReminder !== null) {
        setStreakReminderEnabled(savedStreakReminder === 'true');
      }
      if (savedStreakReminderTime) {
        setStreakReminderTime(savedStreakReminderTime);
      }
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    soundSystem.setVolume(newVolume);
    localStorage.setItem('fitquest_volume', newVolume.toString());
  };

  const handleSoundToggle = (enabled) => {
    setSoundEnabled(enabled);
    soundSystem.setEnabled(enabled);
    localStorage.setItem('fitquest_sound_enabled', enabled.toString());
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Les notifications ne sont pas supportées');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      setNotificationsEnabled(true);
      localStorage.setItem('fitquest_notifications', 'true');
      toast.success('Notifications activées !');

      // Test notification
      soundSystem.playNotification();
      new Notification('FitQuest', {
        body: 'Les notifications sont activées !',
        icon: '/favicon.ico'
      });
    } else {
      toast.error('Permission refusée');
    }
  };

  const handleNotificationToggle = (enabled) => {
    if (enabled && notificationPermission !== 'granted') {
      requestNotificationPermission();
    } else {
      setNotificationsEnabled(enabled);
      localStorage.setItem('fitquest_notifications', enabled.toString());
    }
  };

  const handleStreakReminderToggle = async (enabled) => {
    setStreakReminderEnabled(enabled);
    localStorage.setItem('fitquest_streak_reminder', enabled.toString());

    // Sync to backend DB
    try {
      await updateUser({ streak_reminder_enabled: enabled });
    } catch (error) {
      console.error('Error syncing streak reminder toggle:', error);
    }

    if (enabled) {
      scheduleStreakReminder();
      toast.success(`Rappel de streak programmé à ${streakReminderTime}`);
    } else {
      toast.info('Rappel de streak désactivé');
    }
  };

  const handleStreakReminderTimeChange = async (time) => {
    setStreakReminderTime(time);
    localStorage.setItem('fitquest_streak_reminder_time', time);

    // Sync to backend DB
    try {
      await updateUser({ streak_reminder_time: time });
    } catch (error) {
      console.error('Error syncing streak reminder time:', error);
    }

    if (streakReminderEnabled) {
      scheduleStreakReminder();
      toast.success(`Rappel reprogrammé à ${time}`);
    }
  };

  const scheduleStreakReminder = () => {
    // Store the reminder time - actual notification will be triggered by a service worker or backend
    // For now, we'll use a simple approach with checking every minute
    const checkAndNotify = async () => {
      if (!streakReminderEnabled) return;

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (currentTime === streakReminderTime) {
        // Check if user has worked out today
        try {
          const response = await axios.get(`${API}/performance/workout-days?month=${now.getMonth() + 1}&year=${now.getFullYear()}`, { withCredentials: true });
          const todayStr = now.toISOString().split('T')[0];
          const hasWorkedOutToday = response.data.workout_dates?.includes(todayStr);

          if (!hasWorkedOutToday && notificationPermission === 'granted') {
            soundSystem.playNotification();
            new Notification('🔥 Protège ton streak !', {
              body: 'Tu n\'as pas encore fait d\'entraînement aujourd\'hui. Ne brise pas ta série !',
              icon: '/favicon.ico',
              tag: 'streak-reminder'
            });
          }
        } catch (error) {
          console.error('Error checking workout status:', error);
        }
      }
    };

    // Check every minute
    const intervalId = setInterval(checkAndNotify, 60000);

    // Store interval ID for cleanup
    localStorage.setItem('fitquest_streak_interval', intervalId.toString());
  };

  const playSound = (soundName, playFn) => {
    setLastPlayed(soundName);
    playFn();
    setTimeout(() => setLastPlayed(null), 1000);
  };

  const handleDarkModeToggle = async (enabled) => {
    setDarkMode(enabled);
    localStorage.setItem('fitquest_dark_mode', enabled.toString());
    try {
      await updateUser({ dark_mode: enabled });
    } catch (error) {
      console.error('Error updating dark mode:', error);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await axios.get(`${API}/users/me/export`, { withCredentials: true });
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitquest_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export réussi !');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      const response = await axios.get(`${API}/users/me/export`, { withCredentials: true });
      const data = response.data;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Title
      doc.setFontSize(24);
      doc.setTextColor(176, 227, 1); // #B0E301
      doc.text('FITQUEST', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text(`Rapport exporté le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, y, { align: 'center' });
      y += 15;

      // User Info Section
      doc.setFontSize(16);
      doc.setTextColor(100, 65, 165); // #6441a5
      doc.text('Profil Utilisateur', 20, y);
      y += 8;

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      if (data.user) {
        doc.text(`Nom: ${data.user.name || 'Non défini'}`, 25, y); y += 6;
        doc.text(`Email: ${data.user.email || 'Non défini'}`, 25, y); y += 6;
        doc.text(`Objectif: ${data.user.goal || 'Non défini'}`, 25, y); y += 6;
        doc.text(`Niveau: ${data.user.level || 'Non défini'}`, 25, y); y += 6;
        if (data.user.weight) doc.text(`Poids: ${data.user.weight} kg`, 25, y); y += 6;
        if (data.user.height) doc.text(`Taille: ${data.user.height} cm`, 25, y); y += 6;
      }
      y += 8;

      // Stats Section
      doc.setFontSize(16);
      doc.setTextColor(100, 65, 165);
      doc.text('Statistiques', 20, y);
      y += 8;

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Entraînements: ${data.workouts?.length || 0}`, 25, y); y += 6;
      doc.text(`Repas enregistrés: ${data.meals?.length || 0}`, 25, y); y += 6;
      doc.text(`Calories objectif: ${data.user?.daily_calories || 2000} kcal/jour`, 25, y); y += 6;
      doc.text(`Protéines objectif: ${data.user?.target_protein || 120} g/jour`, 25, y); y += 6;
      y += 10;

      // Workouts Section
      if (data.workouts?.length > 0) {
        if (y > 250) { doc.addPage(); y = 20; }

        doc.setFontSize(16);
        doc.setTextColor(100, 65, 165);
        doc.text('Derniers Entraînements', 20, y);
        y += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        data.workouts.slice(0, 10).forEach((workout) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(`• ${workout.name} - ${workout.workout_type} (${workout.duration_minutes || 0} min)`, 25, y);
          y += 5;
        });
        y += 8;
      }

      // Meals Section
      if (data.meals?.length > 0) {
        if (y > 250) { doc.addPage(); y = 20; }

        doc.setFontSize(16);
        doc.setTextColor(100, 65, 165);
        doc.text('Derniers Repas', 20, y);
        y += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        data.meals.slice(0, 10).forEach((meal) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(`• ${meal.name} - ${meal.calories} kcal, ${meal.protein}g prot (${meal.date})`, 25, y);
          y += 5;
        });
      }

      // Footer
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} / ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
        doc.text('FitQuest - Level Up Your Life', pageWidth / 2, 295, { align: 'center' });
      }

      doc.save(`fitquest_rapport_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Rapport PDF généré !');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    if (deleteConfirmation !== 'SUPPRIMER') {
      toast.error('Veuillez écrire SUPPRIMER pour confirmer');
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(`${API}/users/me`, { withCredentials: true });
      // Clear ALL local storage to ensure a completely fresh start
      // This removes onboarding flags, chrono sequences, theme prefs, etc.
      localStorage.clear();

      toast.success('Compte supprimé');
      setDeleteDialogOpen(false);
      logout();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API}/users/me`, { withCredentials: true });
      // Clear ALL local storage
      localStorage.clear();

      toast.success('Compte supprimé');
      logout();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteHistory = async (type) => {
    setDeleteHistoryLoading(true);
    try {
      console.log('Deleting history type:', type);
      const response = await axios.delete(`${API}/history/all?type=${type}`, { withCredentials: true });
      console.log('Delete response:', response.data);
      toast.success(`Historique ${type === 'all' ? 'complet' : type} supprimé avec succès !`);
      setDeleteHistoryDialogOpen(false);
      setHistoryTypeToDelete(null);
    } catch (error) {
      console.error('Delete history error:', error);
      const errorMsg = error.response?.data?.detail || 'Erreur lors de la suppression';
      toast.error(errorMsg);
    } finally {
      setDeleteHistoryLoading(false);
    }
  };

  const historyTypes = [
    { id: 'workouts', label: 'Entraînements', description: 'Séances et logs d\'entraînement', icon: Dumbbell, color: '#B0E301' },
    { id: 'meals', label: 'Repas', description: 'Historique des repas enregistrés', icon: Apple, color: '#FF6B35' },
    { id: 'steps', label: 'Pas', description: 'Compteur de pas quotidien', icon: Footprints, color: '#00BFFF' },
    { id: 'hydration', label: 'Hydratation', description: 'Suivi d\'eau quotidien', icon: Droplet, color: '#00BFFF' },
    { id: 'all', label: 'Tout l\'historique', description: 'Supprime toutes les données', icon: Trash2, color: '#FF3333' },
  ];

  const sounds = [
    { id: 'xp_gain', name: 'Gain d\'XP', icon: Zap, color: '#B0E301', play: () => soundSystem.playXPGain() },
    { id: 'level_up', name: 'Level Up', icon: ArrowUp, color: '#6441a5', play: () => soundSystem.playLevelUp() },
    { id: 'mega_level', name: 'Mega Level Up', icon: Star, color: '#FFD700', play: () => soundSystem.playMegaLevelUp() },
    { id: 'trophy', name: 'Trophée', icon: Trophy, color: '#FF6B35', play: () => soundSystem.playTrophyUnlock() },
    { id: 'notification', name: 'Notification', icon: Bell, color: '#00BFFF', play: () => soundSystem.playNotification() },
    { id: 'challenge', name: 'Défi Complété', icon: Sparkles, color: '#FF69B4', play: () => soundSystem.playChallengeComplete() },
    { id: 'birthday', name: 'Anniversaire', icon: Sparkles, color: '#FFD700', play: () => soundSystem.playBirthday() },
  ];

  return (
    <div className="space-y-6 animate-fade-in" data-testid="settings-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          <span className="text-[#6441a5]">PARAMÈTRES</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Personnalisez votre expérience FitQuest</p>
      </div>

      {/* Audio Settings */}
      <Card className="card-stat" data-testid="audio-settings">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#B0E301]" />
            AUDIO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#B0E301]" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Sons activés</p>
                <p className="text-xs text-muted-foreground">Sons 8-bit rétro pour XP et trophées</p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={handleSoundToggle}
              data-testid="sound-toggle"
            />
          </div>

          {/* Volume Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Volume</p>
              <span className="text-sm font-mono text-[#B0E301]">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              value={[volume * 100]}
              onValueChange={([v]) => handleVolumeChange(v / 100)}
              max={100}
              step={5}
              disabled={!soundEnabled}
            />
          </div>

          {/* Sound Test Buttons */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Tester les sons</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sounds.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => playSound(sound.id, sound.play)}
                  disabled={!soundEnabled}
                  className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${lastPlayed === sound.id
                    ? 'border-[#B0E301] bg-[#B0E301]/10'
                    : 'border-white/10 hover:border-white/30'
                    } ${!soundEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  data-testid={`sound-${sound.id}`}
                >
                  <sound.icon className="w-4 h-4" style={{ color: sound.color }} />
                  <span className="text-xs">{sound.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Play All */}
          <Button
            variant="outline"
            onClick={() => {
              soundSystem.playXPGain();
              setTimeout(() => soundSystem.playLevelUp(), 500);
              setTimeout(() => soundSystem.playMegaLevelUp(), 1500);
              setTimeout(() => soundSystem.playTrophyUnlock(), 3000);
              setTimeout(() => soundSystem.playNotification(), 4000);
              setTimeout(() => soundSystem.playChallengeComplete(), 4500);
              setTimeout(() => soundSystem.playBirthday(), 5500);
            }}
            disabled={!soundEnabled}
            className="w-full"
            data-testid="play-all-sounds"
          >
            <Play className="w-4 h-4 mr-2" />
            Jouer tous les sons
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="card-stat" data-testid="notification-settings">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00BFFF]" />
            NOTIFICATIONS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notificationsEnabled && notificationPermission === 'granted' ? (
                <Bell className="w-5 h-5 text-[#00BFFF]" />
              ) : (
                <BellOff className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Notifications push</p>
                <p className="text-xs text-muted-foreground">
                  {notificationPermission === 'granted'
                    ? 'Recevez des alertes même en arrière-plan'
                    : notificationPermission === 'denied'
                      ? 'Permission refusée - activez dans les paramètres du navigateur'
                      : 'Cliquez pour activer'}
                </p>
              </div>
            </div>
            {notificationPermission === 'granted' ? (
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
              />
            ) : notificationPermission !== 'denied' ? (
              <Button size="sm" onClick={requestNotificationPermission} variant="brand">
                Activer
              </Button>
            ) : null}
          </div>

          {notificationsEnabled && notificationPermission === 'granted' && (
            <Button
              variant="outline"
              onClick={() => {
                soundSystem.playNotification();
                new Notification('Test FitQuest', {
                  body: 'Les notifications fonctionnent !',
                  icon: '/favicon.ico'
                });
              }}
              className="w-full"
              data-testid="test-notification"
            >
              <Bell className="w-4 h-4 mr-2" />
              Envoyer une notification test
            </Button>
          )}

          {/* Streak Reminder */}
          {notificationsEnabled && notificationPermission === 'granted' && (
            <div className="pt-4 mt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-[#FF6B35]" />
                  <div>
                    <p className="font-medium">Rappel de streak</p>
                    <p className="text-xs text-muted-foreground">
                      Notification si tu n'as pas fait ton entraînement
                    </p>
                  </div>
                </div>
                <Switch
                  checked={streakReminderEnabled}
                  onCheckedChange={handleStreakReminderToggle}
                  data-testid="streak-reminder-toggle"
                />
              </div>

              {streakReminderEnabled && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-border">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Heure du rappel</p>
                  </div>
                  <input
                    type="time"
                    value={streakReminderTime}
                    onChange={(e) => handleStreakReminderTimeChange(e.target.value)}
                    className="bg-transparent border border-input rounded px-3 py-1 text-foreground text-sm focus:outline-none focus:border-accent"
                    data-testid="streak-reminder-time"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>



      {/* Account */}
      <Card className="card-stat" data-testid="account-settings">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-[#6441a5]" />
            COMPTE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {user && (
            <div className="p-3 rounded-lg bg-accent/5 border border-border">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportLoading}
            className="w-full justify-start"
            data-testid="export-data"
          >
            <Download className="w-4 h-4 mr-2" />
            {exportLoading ? 'Export en cours...' : 'Exporter mes données (JSON)'}
          </Button>

          <Button
            onClick={handleExportPDF}
            disabled={pdfLoading}
            variant="brand"
            data-testid="export-pdf-btn"
          >
            <FileText className="w-4 h-4 mr-2" />
            {pdfLoading ? 'Génération en cours...' : 'Exporter en PDF'}
          </Button>

          <Button
            variant="outline"
            onClick={logout}
            className="w-full justify-start text-[#FF3333] border-[#FF3333]/30 hover:bg-[#FF3333]/10 hover:text-[#FF3333]"
            data-testid="logout-btn-settings"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </CardContent>
      </Card>

      {/* History Management */}
      <Card className="card-stat" data-testid="history-settings">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-[#FF6B35]" />
            GESTION DE L'HISTORIQUE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[#52525B] mb-4">
            Supprimez tout ou une partie de votre historique. Cette action est irréversible.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {historyTypes.map(type => (
              <Button
                key={type.id}
                variant="outline"
                onClick={() => {
                  setHistoryTypeToDelete(type);
                  setDeleteHistoryDialogOpen(true);
                }}
                className={`h-auto p-4 justify-start hover:border-white/40 ${type.id === 'all'
                  ? 'border-[#FF3333]/50 hover:bg-[#FF3333]/10 hover:border-[#FF3333]'
                  : 'border-border hover:bg-accent/5'
                  }`}
                data-testid={`delete-history-${type.id}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${type.color}20` }}
                  >
                    <type.icon className="w-5 h-5" style={{ color: type.color }} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-white">{type.label}</p>
                    <p className="text-xs text-[#52525B]">{type.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="card-stat border-[#FF3333]/30" data-testid="danger-zone">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#FF3333]">
            <AlertTriangle className="w-4 h-4" />
            ZONE DANGER
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#A1A1AA] mb-4">
            Actions sensibles et irréversibles sur votre compte
          </p>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full justify-start border-[#FF3333]/30 text-[#FF3333] hover:bg-[#FF3333]/10"
            data-testid="delete-account"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer mon compte définitivement
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#18181B] border-[#FF3333]/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#FF3333] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Supprimer définitivement le compte
            </DialogTitle>
            <DialogDescription className="text-[#A1A1AA] pt-2">
              Cette action est <strong className="text-white">irréversible</strong>. Toutes vos données seront supprimées :
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Profil et objectifs</li>
                <li>Séances d'entraînement</li>
                <li>Historique de performance</li>
                <li>Plans de repas</li>
                <li>Historique de poids</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-sm text-[#A1A1AA]">
              Écrivez <span className="font-mono bg-[#FF3333]/10 px-2 py-1 rounded text-[#FF3333]">SUPPRIMER</span> pour confirmer
            </Label>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="SUPPRIMER"
              className="mt-2 border-[#FF3333]/30 focus:border-[#FF3333]"
              data-testid="delete-confirmation-input"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteConfirmation('');
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDeleteAccountConfirm}
              disabled={deleting || deleteConfirmation !== 'SUPPRIMER'}
              className="bg-[#FF3333] hover:bg-[#FF3333]/80"
            >
              {deleting ? 'Suppression...' : 'Supprimer définitivement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete History Confirmation Dialog */}
      <Dialog open={deleteHistoryDialogOpen} onOpenChange={setDeleteHistoryDialogOpen}>
        <DialogContent className="bg-[#18181B] border-[#FF6B35]/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-[#FF6B35]" />
              Supprimer l'historique
            </DialogTitle>
            <DialogDescription className="text-[#A1A1AA] pt-2">
              {historyTypeToDelete && (
                <>
                  Vous êtes sur le point de supprimer :
                  <span className="text-white font-semibold"> {historyTypeToDelete.label}</span>
                  <br /><br />
                  <span className="text-[#FF6B35]">⚠️ Cette action est irréversible.</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteHistoryDialogOpen(false);
                setHistoryTypeToDelete(null);
              }}
              className="flex-1 border-border"
              disabled={deleteHistoryLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={() => historyTypeToDelete && handleDeleteHistory(historyTypeToDelete.id)}
              disabled={deleteHistoryLoading}
              className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/80 text-white font-semibold"
            >
              {deleteHistoryLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Suppression...
                </span>
              ) : (
                'Confirmer la suppression'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
