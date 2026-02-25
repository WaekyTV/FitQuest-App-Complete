import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus,
  Settings,
  FolderOpen,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Pen,
  Save,
  Vibrate
} from 'lucide-react';
import { Button } from './ui/button';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Import extracted components
import { FocusTimer } from './FocusTimer';
import { SequenceEditor } from './SequenceEditor';
import { SavedSequenceCard } from './SavedSequenceCard';
import { SequenceManager } from './SequenceManager';

// Storage key for saved sequences
const STORAGE_KEY = 'fitquest_chrono_sequences';
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ChronoPage = () => {
  const { user, lastSync, updateUser } = useAuth();
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
  const [isPreCount, setIsPreCount] = useState(false);
  const [preCountTime, setPreCountTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Intervals state
  const [intervals, setIntervals] = useState([]);

  const [settings, setSettings] = useState({
    preCountSeconds: 5,
    soundEnabled: true,
    vibrationEnabled: false,
    voiceEnabled: true,
    volume: 0.7,
    beepOnLastTen: true,
    beepOnLastThree: true,
    notificationsEnabled: false
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Saved sequences
  const [savedSequences, setSavedSequences] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [sequenceToEdit, setSequenceToEdit] = useState(null);

  // Audio refs
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchSequences = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API}/sequences`);
      setSavedSequences(response.data);
      // Sync to localStorage as backup/offline cache just in case
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
    } catch (e) {
      console.error('Error loading sequences from API:', e);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSavedSequences(JSON.parse(saved));
    }
  }, [user]);

  // Load saved sequences and settings on mount and when sync signal changes
  useEffect(() => {
    if (user) {
      fetchSequences();

      // Initialize settings from user profile if available
      setSettings(prev => ({
        ...prev,
        preCountSeconds: user.chrono_pre_count !== undefined ? user.chrono_pre_count : prev.preCountSeconds,
        soundEnabled: user.chrono_sound_enabled !== undefined ? user.chrono_sound_enabled : prev.soundEnabled,
        beepOnLastTen: user.chrono_beep_last_ten !== undefined ? user.chrono_beep_last_ten : prev.beepOnLastTen,
        beepOnLastThree: user.chrono_beep_last_three !== undefined ? user.chrono_beep_last_three : prev.beepOnLastThree,
        volume: user.chrono_volume !== undefined ? user.chrono_volume : prev.volume,
        notificationsEnabled: user.notifications_enabled !== undefined ? user.notifications_enabled : prev.notificationsEnabled
      }));
    }

    // Check notification permission on mount
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [user, lastSync, fetchSequences]);

  const handleSaveSettings = async () => {
    if (!user) {
      toast.error("Connectez-vous pour sauvegarder vos paramètres");
      return;
    }

    try {
      await updateUser({
        chrono_pre_count: settings.preCountSeconds,
        chrono_sound_enabled: settings.soundEnabled,
        chrono_beep_last_ten: settings.beepOnLastTen,
        chrono_beep_last_three: settings.beepOnLastThree,
        chrono_volume: settings.volume,
        notifications_enabled: settings.notificationsEnabled
      });
      toast.success("Paramètres synchronisés ! ☁️");
      setSettingsOpen(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erreur lors de la synchronisation");
    }
  };

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Les notifications ne sont pas supportées par ce navigateur');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
        toast.success('Notifications activées !');
        return true;
      } else {
        toast.error('Permission refusée pour les notifications');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Send notification (works in background)
  const sendNotification = useCallback((title, body, tag = 'fitquest-chrono') => {
    if (!settings.notificationsEnabled || notificationPermission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag,
        requireInteraction: false,
        silent: false
      });

      setTimeout(() => notification.close(), 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [settings.notificationsEnabled, notificationPermission]);

  // Calculate total duration whenever intervals change
  useEffect(() => {
    const total = intervals.reduce((acc, int) => acc + (int.duration_seconds || 0), 0);
    setTotalTime(total);
  }, [intervals]);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Play beep sound
  const playBeep = useCallback((frequency = 800, duration = 150, type = 'sine', pattern = null) => {
    // 1. Handle Vibration if enabled (Mobile only)
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (settings.vibrationEnabled && isMobileDevice && 'vibrate' in navigator) {
      // Use custom pattern if provided, otherwise default to duration
      navigator.vibrate(pattern || duration || 150);
    }

    if (!settings.soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(settings.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  }, [settings.soundEnabled, settings.vibrationEnabled, settings.volume, initAudio]);

  // Play sounds
  const playSuccessSound = useCallback(() => {
    playBeep(523, 100); // C5
    setTimeout(() => playBeep(659, 100), 100); // E5
    setTimeout(() => playBeep(784, 200, 'sine', [150, 50, 150, 50, 800]), 200); // G5 + EXTREME pattern
  }, [playBeep]);

  const playWarningBeep = useCallback(() => {
    playBeep(600, 100, 'sine', 250); // Strong pulse
  }, [playBeep]);

  const playFinalBeep = useCallback(() => {
    playBeep(1000, 200, 'sine', 500); // Very strong pulse
  }, [playBeep]);

  // Speak text
  const speak = useCallback((text) => {
    if (!settings.voiceEnabled || !settings.soundEnabled) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.1;
      utterance.volume = settings.volume;
      window.speechSynthesis.speak(utterance);
    }
  }, [settings.voiceEnabled, settings.soundEnabled, settings.volume]);

  // Timer loop
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      if (isPreCount) {
        setPreCountTime(prev => {
          const newTime = prev - 1;

          if (settings.beepOnLastThree && newTime <= 3 && newTime > 0) {
            playFinalBeep();
          }

          if (newTime <= 0) {
            setIsPreCount(false);
            playSuccessSound();

            if (intervals[0]) {
              speak(intervals[0].instruction || intervals[0].name || 'C\'est parti !');
              sendNotification(
                '🏃 Chrono Démarré !',
                `${intervals[0].name}`,
                'fitquest-start'
              );
            }
            return 0;
          }
          return newTime;
        });
        // Important: Stop execution here so we don't start the main timer loop in the same tick?
        // Actually, returning closes the setPreCountTime callback. The interval keeps running.
        // We need to manage state transition carefully.
        // Once isPreCount becomes false (via setState), the Next Render will see it false.
        // But inside this closure, it might be tricky.
        // React state updates are batched/async.
        // The effect depends on `isPreCount`. When `setIsPreCount(false)` happens, effect re-runs.
        // So the interval is cleared and recreated.
      } else {
        setCurrentTime(prev => {
          const currentInterval = intervals[currentIntervalIndex];
          if (!currentInterval) return prev;

          const newTime = prev + 1;
          const remaining = currentInterval.duration_seconds - newTime;

          if (settings.beepOnLastTen && remaining <= 10 && remaining > 3) {
            playWarningBeep();
          }

          if (settings.beepOnLastThree && remaining <= 3 && remaining > 0) {
            playFinalBeep();
          }

          if (newTime >= currentInterval.duration_seconds) {
            const nextIndex = currentIntervalIndex + 1;

            if (nextIndex >= intervals.length) {
              setIsFinished(true);
              setIsRunning(false);
              playSuccessSound();
              speak('Programme terminé ! Excellent travail !');
              toast.success('Programme terminé !');
              sendNotification(
                '🏆 Programme Terminé !',
                'Excellent travail !',
                'fitquest-complete'
              );
              return 0;
            } else {
              setCurrentIntervalIndex(nextIndex);
              playSuccessSound();

              const nextInterval = intervals[nextIndex];
              speak(nextInterval.instruction || nextInterval.name || `Intervalle ${nextIndex + 1}`);
              sendNotification(
                `⏱️ Intervalle ${nextIndex + 1}/${intervals.length}`,
                `${nextInterval.name}`,
                'fitquest-interval'
              );

              return 0;
            }
          }

          return newTime;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, isPreCount, currentIntervalIndex, intervals, settings, playBeep, playWarningBeep, playFinalBeep, playSuccessSound, speak, sendNotification]);

  // Actions
  const handleStart = () => {
    if (intervals.length === 0) {
      toast.error('Ajoutez au moins un intervalle');
      return;
    }

    initAudio();

    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
    } else {
      // Start fresh
      setCurrentIntervalIndex(0);
      setPreCountTime(0);
      setIsFinished(false);
      // Precount logic
      if (settings.preCountSeconds > 0) {
        setIsPreCount(true);
        setPreCountTime(settings.preCountSeconds);
        speak('Préparez-vous !');
      } else {
        setIsPreCount(false);
        speak(intervals[0]?.instruction || intervals[0]?.name || 'C\'est parti !');
      }
      setIsRunning(true);
    }
  };

  const handleUpdateSequencesOrder = async (newOrder) => {
    try {
      // Find deleted sequences
      const deletedIds = savedSequences
        .filter(oldSeq => !newOrder.find(newSeq => newSeq.id === oldSeq.id))
        .map(s => s.id);

      // Handle deletions first
      for (const id of deletedIds) {
        await axios.delete(`${API}/sequences/${id}`);
      }

      // Bulk update order on backend
      const reorderPayload = newOrder.map((seq, index) => ({
        id: seq.id,
        position: index
      }));

      await axios.post(`${API}/sequences/reorder`, reorderPayload);

      setSavedSequences(newOrder);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
      toast.success("Ordre mis à jour et sauvegardé");
      setManagerOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    speak('Pause');
    sendNotification('⏸️ Chrono en Pause', 'Appuyez pour reprendre', 'fitquest-pause');
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsPreCount(false);
    setIsFinished(false);
    setCurrentTime(0);
    setCurrentIntervalIndex(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleRestartInterval = () => {
    setCurrentTime(0);
    setIsPaused(false);
    setIsRunning(true);
  };

  // Instant Start Logic
  const handleLoadAndStart = (sequence) => {
    const newIntervals = sequence.intervals;
    if (!newIntervals || newIntervals.length === 0) {
      toast.error("Programme vide");
      return;
    }

    setIntervals(newIntervals);
    if (sequence.settings) {
      setSettings(prev => ({ ...prev, ...sequence.settings }));
    }

    // Initialize state for immediate start
    setCurrentIntervalIndex(0);
    setCurrentTime(0);
    setIsPaused(false);

    // We need to use local variable for preCount calculation because settings state might not update immediately if we just set it
    // Actually we are merging settings, but let's safely use the incoming sequence settings or fallback to current 'settings' var
    const preCount = sequence.settings?.preCountSeconds ?? settings.preCountSeconds;

    setPreCountTime(preCount);
    setIsPreCount(preCount > 0);

    // Start!
    setIsRunning(true);
    setIsFinished(false);
    toast.success(`Programme "${sequence.name}" démarré !`);

    // Trigger audio init
    initAudio();

    // Speak start
    if (preCount > 0) {
      speak('Préparez-vous !');
    } else {
      speak(newIntervals[0]?.instruction || newIntervals[0]?.name || 'C\'est parti !');
    }
  };

  // Delete saved sequence
  const handleDeleteSequence = async (id) => {
    try {
      await axios.delete(`${API}/sequences/${id}`);
      const updated = savedSequences.filter(s => s.id !== id);
      setSavedSequences(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      toast.success('Séquence supprimée');
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Duplicate saved sequence
  const handleDuplicateSequence = async (sequence) => {
    const newSequence = {
      ...sequence,
      id: Date.now(),
      name: `${sequence.name} (copie)`,
      createdAt: new Date().toISOString(),
      position: savedSequences.length // Add to end
    };

    try {
      const response = await axios.post(`${API}/sequences`, newSequence);
      const savedDoc = response.data;
      const updated = [...savedSequences, savedDoc];
      setSavedSequences(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      toast.success('Séquence dupliquée');
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de la duplication');
    }
  };

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentInterval = intervals[currentIntervalIndex];

  // Memoized handlers for FocusTimer
  const handleTimerPause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
    } else {
      handlePause();
    }
  }, [isPaused, handlePause]);

  const handleTimerNext = useCallback(() => {
    if (currentIntervalIndex < intervals.length - 1) {
      setCurrentIntervalIndex(prev => prev + 1);
      setCurrentTime(0);
    } else {
      setIsFinished(true);
      setIsRunning(false);
    }
  }, [currentIntervalIndex, intervals.length]);

  const handleTimerPrev = useCallback(() => {
    if (currentIntervalIndex > 0) {
      setCurrentIntervalIndex(prev => prev - 1);
      setCurrentTime(0);
    }
  }, [currentIntervalIndex]);

  const handleToggleSound = useCallback(() => {
    const s = settings;
    let nextSound = false;
    let nextVibrate = false;
    let message = "";

    // Device detection: Check if we are on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    /**
     * 4-State Cycle (Mobile):
     * 1. Sound ON / Vibrate OFF -> message: "Mode Son 🔊"
     * 2. Sound OFF / Vibrate OFF -> message: "Mode Muet 🔇"
     * 3. Sound OFF / Vibrate ON  -> message: "Mode Vibration 📳"
     * 4. Sound ON / Vibrate ON   -> message: "Mode Son + Vibration 🔊📳"
     */

    if (isMobile) {
      if (s.soundEnabled && !s.vibrationEnabled) {
        // From Sound to Mute
        nextSound = false; nextVibrate = false; message = "Mode Muet 🔇";
      } else if (!s.soundEnabled && !s.vibrationEnabled) {
        // From Mute to Vibrate Only
        nextSound = false; nextVibrate = true; message = "Mode Vibration 📳";
      } else if (!s.soundEnabled && s.vibrationEnabled) {
        // From Vibrate Only to Sound + Vibrate
        nextSound = true; nextVibrate = true; message = "Mode Son + Vibration 🔊📳";
      } else {
        // From Sound + Vibrate to Sound Only
        nextSound = true; nextVibrate = false; message = "Mode Son 🔊";
      }
    } else {
      // PC: Simple 2-state toggle (Vibration disabled on PC)
      nextSound = !s.soundEnabled;
      nextVibrate = false;
      message = nextSound ? "Mode Son 🔊" : "Mode Muet 🔇";
    }

    setSettings(prev => ({ ...prev, soundEnabled: nextSound, vibrationEnabled: nextVibrate }));

    // Side effects (Toasts & Vibration feedback)
    console.log("Toggle Switch:", { message, nextSound, nextVibrate });
    toast.info(message);
    if (nextVibrate) {
      if ('vibrate' in navigator) {
        console.log("Vibrating...");
        navigator.vibrate(nextSound ? [200, 100, 200] : 300); // Distinct pattern
      } else {
        if (!window.isSecureContext) {
          toast.error("Vibration bloquée: Lien non sécurisé (HTTP)");
        } else {
          toast.error("Vibration non supportée ❌");
        }
      }
    }
  }, [settings]);
  const handleToggleVoice = useCallback(() => setSettings(s => ({ ...s, voiceEnabled: !s.voiceEnabled })), []);
  const handleToggleNotifications = useCallback(() => {
    if (notificationPermission !== 'granted') {
      requestNotificationPermission();
    } else {
      setSettings(s => ({ ...s, notificationsEnabled: !s.notificationsEnabled }));
    }
  }, [notificationPermission, requestNotificationPermission]);

  const handleVolumeChange = useCallback((val) => setSettings(prev => ({ ...prev, volume: val })), []);

  const handleSkipPreCount = useCallback(() => {
    setIsPreCount(false);
    setPreCountTime(0);
    playSuccessSound();
    if (intervals[0]) {
      speak(intervals[0].instruction || intervals[0].name || 'C\'est parti !');
    }
  }, [playSuccessSound, speak, intervals]);

  const handleFinish = useCallback(() => {
    setIsFinished(true);
    setIsRunning(false);
  }, []);

  const handleRestartProgram = useCallback(() => {
    setCurrentIntervalIndex(0);
    setCurrentTime(0);
    setIsFinished(false);
    if (settings.preCountSeconds > 0) {
      setIsPreCount(true);
      setPreCountTime(settings.preCountSeconds);
      speak('Préparez-vous !');
    } else {
      setIsPreCount(false);
      speak(intervals[0]?.instruction || intervals[0]?.name || 'C\'est parti !');
    }
    setIsRunning(true);
  }, [settings.preCountSeconds, speak, intervals]);

  return (
    <div className={`flex flex-col min-h-[calc(100vh-80px)] ${!(editorOpen || managerOpen) ? 'space-y-6 animate-fade-in' : ''}`} data-testid="chrono-page">
      {/* If Editor is open, show ONLY the editor */}
      {editorOpen ? (
        <div className="fixed inset-0 z-[200] bg-[#151515] md:relative md:inset-auto md:z-auto md:bg-transparent md:flex-1 flex flex-col">
          <SequenceEditor
            initialSequence={sequenceToEdit}
            onClose={() => setEditorOpen(false)}
            savedSequences={savedSequences}
            setSavedSequences={setSavedSequences}
            formatTime={formatTime}
          />
        </div>
      ) : managerOpen ? (
        <div className="fixed inset-0 z-[200] bg-[#0D161F] md:relative md:inset-auto md:z-auto md:bg-transparent md:flex-1 md:min-h-[500px] flex flex-col">
          <SequenceManager
            sequences={savedSequences}
            onSave={handleUpdateSequencesOrder}
            onCancel={() => setManagerOpen(false)}
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 px-4 sm:px-0">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                CHRONO <span className="text-[#B0E301]">INTERVALLE</span>
              </h1>
              <p className="text-[#A1A1AA] mt-1 text-sm">Timer professionnel pour vos entraînements</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                className="border-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSequenceToEdit(null); // New sequence
                  setEditorOpen(true);
                }}
                className="border-[#B0E301] text-[#B0E301]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer
              </Button>
            </div>
          </div>

          {/* Focus Timer Overlay */}
          {(isRunning || isPreCount || isFinished) && (
            <FocusTimer
              interval={intervals[currentIntervalIndex]}
              remainingTime={currentInterval ? currentInterval.duration_seconds - currentTime : 0}
              totalRemaining={totalTime - intervals.slice(0, currentIntervalIndex).reduce((acc, int) => acc + int.duration_seconds, 0) - currentTime}
              currentIntervalIndex={currentIntervalIndex}
              totalIntervals={intervals.length}
              onPause={handleTimerPause}
              onNext={handleTimerNext}
              onPrev={handleTimerPrev}
              onExit={handleReset}
              isPreCount={isPreCount}
              preCountTime={preCountTime}
              formatTime={formatTime}
              isPaused={isPaused}
              settings={settings} // Pass settings down
              onRestartInterval={handleRestartInterval}
              onToggleSound={handleToggleSound}
              onToggleVoice={handleToggleVoice}
              onToggleNotifications={handleToggleNotifications}
              onVolumeChange={handleVolumeChange}
              isFinished={isFinished}
              onSkipPreCount={handleSkipPreCount}
              onFinish={handleFinish}
              onRestartProgram={handleRestartProgram}
            />
          )}

          {/* Saved Sequences Section: Forced full width on mobile to touch edges */}
          <div className="space-y-4 mb-8 -mx-4 sm:mx-0 w-auto">
            <h2 className="text-xl font-bold text-white/80 flex items-center justify-between mt-8 mb-4 px-4 sm:px-0">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" /> MES PROGRAMMES
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setManagerOpen(true)}
                className="text-white/40 hover:text-white hover:bg-white/10"
              >
                <Pen className="w-4 h-4" />
              </Button>
            </h2>
            {savedSequences.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-lg mx-4">
                <p className="text-[#A1A1AA] mb-4">Aucun programme enregistré</p>
                <Button onClick={() => setEditorOpen(true)} variant="outline" className="border-[#B0E301] text-[#B0E301]">
                  Créer un programme
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px md:gap-4">
                {savedSequences.map(seq => (
                  <SavedSequenceCard
                    key={seq.id}
                    sequence={seq}
                    onLoad={handleLoadAndStart} // Use new "Load and Start" handler
                    onDelete={handleDeleteSequence}
                    onEdit={(s) => {
                      setSequenceToEdit(s);
                      setEditorOpen(true);
                    }}
                    onDuplicate={handleDuplicateSequence}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 z-[400]">
          <DialogHeader>
            <DialogTitle>Paramètres du Chronomètre</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div>
              <Label>Pré-compte (secondes)</Label>
              <Input
                type="number"
                min="0"
                max="30"
                value={settings.preCountSeconds}
                onChange={(e) => setSettings(prev => ({ ...prev, preCountSeconds: parseInt(e.target.value) || 0 }))}
                className="mt-2"
              />
              <p className="text-xs text-[#52525B] mt-1">Compte à rebours avant le début</p>
            </div>

            <div className="space-y-4">
              {/* Notifications setting */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#B0E301]/10 border border-[#B0E301]/20">
                <div className="flex items-center gap-3">
                  {settings.notificationsEnabled && notificationPermission === 'granted' ? (
                    <Bell className="w-5 h-5 text-[#B0E301]" />
                  ) : (
                    <BellOff className="w-5 h-5 text-[#52525B]" />
                  )}
                  <div>
                    <p className="font-medium">Notifications en arrière-plan</p>
                    <p className="text-xs text-[#52525B]">
                      {notificationPermission === 'granted'
                        ? 'Activées'
                        : notificationPermission === 'denied'
                          ? 'Permission refusée'
                          : 'Cliquez pour activer'}
                    </p>
                  </div>
                </div>
                {notificationPermission === 'granted' ? (
                  <Switch
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(v) => setSettings(prev => ({ ...prev, notificationsEnabled: v }))}
                  />
                ) : notificationPermission !== 'denied' ? (
                  <Button
                    size="sm"
                    onClick={requestNotificationPermission}
                    variant="brand"
                  >
                    Activer
                  </Button>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sons</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, soundEnabled: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Vibrations</p>
                </div>
                <Switch
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, vibrationEnabled: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Voix</p>
                </div>
                <Switch
                  checked={settings.voiceEnabled}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, voiceEnabled: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bips 10 dernières secondes</p>
                </div>
                <Switch
                  checked={settings.beepOnLastTen}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, beepOnLastTen: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bips 3 dernières secondes</p>
                </div>
                <Switch
                  checked={settings.beepOnLastThree}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, beepOnLastThree: v }))}
                />
              </div>
            </div>

            <div>
              <Label>Volume: {Math.round(settings.volume * 100)}%</Label>
              <Slider
                value={[settings.volume * 100]}
                onValueChange={(v) => setSettings(prev => ({ ...prev, volume: v[0] / 100 }))}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handleSaveSettings}
              className="w-full bg-[#B0E301] hover:bg-[#B0E301]/90 text-black font-bold flex items-center justify-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" />
              SAUVEGARDER
            </Button>
          </div>
        </DialogContent>
      </Dialog >
    </div >
  );
};
