import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
      audio.play();
      setIsActive(false);
      setMode(mode === 'focus' ? 'break' : 'focus');
      setTimeLeft(mode === 'focus' ? 5 * 60 : 25 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((mode === 'focus' ? 25 * 60 : 5 * 60) - timeLeft) / (mode === 'focus' ? 25 * 60 : 5 * 60) * 100;

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }}
          className={`px-6 py-2 rounded-full font-bold transition-all ${mode === 'focus' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}
        >
          Focus
        </button>
        <button
          onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
          className={`px-6 py-2 rounded-full font-bold transition-all ${mode === 'break' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}
        >
          Pause
        </button>
      </div>

      <div className="relative w-64 h-64 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-gray-100 dark:stroke-gray-700 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            className={`fill-none ${mode === 'focus' ? 'stroke-blue-600' : 'stroke-green-600'}`}
            strokeWidth="8"
            strokeDasharray="754"
            initial={{ strokeDashoffset: 754 }}
            animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-gray-900 dark:text-white tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm font-bold text-gray-400 uppercase mt-2">
            {mode === 'focus' ? 'Travail' : 'Récupération'}
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`w-16 h-16 rounded-3xl flex items-center justify-center ${isActive ? 'bg-red-500 shadow-red-200' : 'bg-blue-600 shadow-blue-200'} text-white shadow-xl transition-transform active:scale-95`}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button
          onClick={() => { setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60); setIsActive(false); }}
          className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-xl active:scale-95"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}