// XP Sound System - Retro 8-bit Level Up Sounds
// Uses Web Audio API to generate authentic retro game sounds

class XPSoundSystem {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  // Play a retro beep note
  playNote(frequency, startTime, duration, type = 'square', volume = 0.3) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  // Standard XP gain sound - Quick retro bling
  playXPGain() {
    this.init();
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    
    // Quick ascending arpeggio - classic coin/XP sound
    this.playNote(523.25, now, 0.08, 'square', 0.2);        // C5
    this.playNote(659.25, now + 0.06, 0.08, 'square', 0.2); // E5
    this.playNote(783.99, now + 0.12, 0.12, 'square', 0.25); // G5
  }

  // Level up sound - More elaborate retro fanfare
  playLevelUp() {
    this.init();
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    
    // Ascending fanfare with harmony
    const notes = [
      { freq: 261.63, time: 0, dur: 0.15 },     // C4
      { freq: 329.63, time: 0.1, dur: 0.15 },   // E4
      { freq: 392.00, time: 0.2, dur: 0.15 },   // G4
      { freq: 523.25, time: 0.3, dur: 0.2 },    // C5
      { freq: 659.25, time: 0.35, dur: 0.2 },   // E5 (harmony)
      { freq: 783.99, time: 0.5, dur: 0.25 },   // G5
      { freq: 1046.50, time: 0.65, dur: 0.35 }, // C6 (final high note)
    ];

    notes.forEach(note => {
      this.playNote(note.freq, now + note.time, note.dur, 'square', 0.2);
    });

    // Add a bass undertone
    this.playNote(130.81, now, 0.8, 'triangle', 0.15); // C3 bass
  }

  // Mega level up sound (every 10 levels) - Epic retro victory fanfare
  playMegaLevelUp() {
    this.init();
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    
    // Epic victory fanfare with multiple layers
    const melody = [
      // First phrase - ascending
      { freq: 261.63, time: 0, dur: 0.12 },      // C4
      { freq: 293.66, time: 0.1, dur: 0.12 },    // D4
      { freq: 329.63, time: 0.2, dur: 0.12 },    // E4
      { freq: 392.00, time: 0.3, dur: 0.15 },    // G4
      // Pause and dramatic rise
      { freq: 523.25, time: 0.5, dur: 0.15 },    // C5
      { freq: 587.33, time: 0.6, dur: 0.15 },    // D5
      { freq: 659.25, time: 0.7, dur: 0.15 },    // E5
      { freq: 783.99, time: 0.8, dur: 0.2 },     // G5
      // Grand finale
      { freq: 1046.50, time: 1.0, dur: 0.15 },   // C6
      { freq: 1174.66, time: 1.1, dur: 0.15 },   // D6
      { freq: 1318.51, time: 1.2, dur: 0.4 },    // E6 (hold)
      { freq: 1567.98, time: 1.35, dur: 0.5 },   // G6 (final triumphant)
    ];

    // Play melody
    melody.forEach(note => {
      this.playNote(note.freq, now + note.time, note.dur, 'square', 0.18);
    });

    // Harmony layer
    const harmony = [
      { freq: 196.00, time: 0, dur: 0.5 },       // G3
      { freq: 261.63, time: 0.5, dur: 0.5 },     // C4
      { freq: 392.00, time: 1.0, dur: 0.8 },     // G4
    ];

    harmony.forEach(note => {
      this.playNote(note.freq, now + note.time, note.dur, 'triangle', 0.12);
    });

    // Add shimmer effect
    for (let i = 0; i < 6; i++) {
      this.playNote(2093 + (i * 200), now + 1.4 + (i * 0.05), 0.1, 'sine', 0.08);
    }

    // Bass drum effect
    this.playNote(65.41, now + 1.0, 0.3, 'sine', 0.25);
    this.playNote(65.41, now + 1.35, 0.4, 'sine', 0.3);
  }

  // Trophy unlock sound - Magical achievement
  playTrophyUnlock() {
    this.init();
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    
    // Magical sparkle sound
    const sparkle = [
      { freq: 880, time: 0, dur: 0.1 },
      { freq: 1100, time: 0.08, dur: 0.1 },
      { freq: 1320, time: 0.16, dur: 0.1 },
      { freq: 1760, time: 0.24, dur: 0.15 },
      { freq: 2200, time: 0.35, dur: 0.2 },
    ];

    sparkle.forEach(note => {
      this.playNote(note.freq, now + note.time, note.dur, 'sine', 0.15);
    });

    // Add a warm undertone
    this.playNote(440, now, 0.5, 'triangle', 0.1);
    this.playNote(554.37, now + 0.2, 0.4, 'triangle', 0.1);
  }
}

// Singleton instance
const xpSoundSystem = new XPSoundSystem();

// React hook for using XP sounds
import { useState, useCallback } from 'react';

export const useXPSounds = () => {
  const [volume, setVolumeState] = useState(0.3);
  
  const setVolume = useCallback((newVolume) => {
    setVolumeState(newVolume);
    // Update the sound system's default volume
    xpSoundSystem.defaultVolume = newVolume;
  }, []);

  const playXPGain = () => xpSoundSystem.playXPGain();
  const playLevelUp = () => xpSoundSystem.playLevelUp();
  const playMegaLevelUp = () => xpSoundSystem.playMegaLevelUp();
  const playTrophyUnlock = () => xpSoundSystem.playTrophyUnlock();

  return { playXPGain, playLevelUp, playMegaLevelUp, playTrophyUnlock, volume, setVolume };
};

export default xpSoundSystem;
