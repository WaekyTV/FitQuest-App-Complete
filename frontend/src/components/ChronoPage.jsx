import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';

export default function ChronoPage() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-7xl md:text-9xl font-mono font-bold text-gray-900 dark:text-white mb-12 tracking-tighter">
        {formatTime(time)}
      </div>

      <div className="flex gap-4 mb-12">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`w-20 h-20 rounded-full flex items-center justify-center ${isActive ? 'bg-red-500' : 'bg-green-500'} text-white shadow-lg transition-transform active:scale-95`}
        >
          {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <button
          onClick={() => { setTime(0); setIsActive(false); setLaps([]); }}
          className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-lg active:scale-95"
        >
          <RotateCcw className="w-8 h-8" />
        </button>
        <button
          onClick={() => setLaps([time, ...laps])}
          className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg active:scale-95"
          disabled={!isActive}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      <div className="w-full space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {laps.map((lap, index) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={index}
            className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <span className="text-gray-500 font-medium">Tour ${laps.length - index}</span>
            <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">
              {formatTime(lap)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}