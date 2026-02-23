import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, Trophy, AlertCircle, History, Settings2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HydrationSystem() {
  const [glasses, setGlasses] = useState(0);
  const [goal, setGoal] = useState(8);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, time: '08:30', amount: 1 },
    { id: 2, time: '10:15', amount: 1 },
    { id: 3, time: '12:45', amount: 1 },
  ]);

  const percentage = Math.min((glasses / goal) * 100, 100);

  const addGlass = () => {
    if (glasses < 20) {
      setGlasses(prev => prev + 1);
      const now = new Date();
      setHistory(prev => [{
        id: Date.now(),
        time: now.toLocaleTimeString([], { hour: '2d', minute: '2d' }),
        amount: 1
      }, ...prev]);
    }
  };

  const removeGlass = (index) => {
    if (glasses > 0) {
      setGlasses(index); // This was corrected in the prompt logic
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border border-blue-50 dark:border-gray-700 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <Droplets className="w-32 h-32 text-blue-500" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              Hydratation
              <Sparkles className="w-6 h-6 text-blue-400" />
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Objectif : {goal} verres de 250ml</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-blue-50 transition-colors"
            >
              <History className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-blue-50 transition-colors"
            >
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96" cy="96" r="88"
                className="stroke-gray-100 dark:stroke-gray-700 fill-none"
                strokeWidth="12"
              />
              <motion.circle
                cx="96" cy="96" r="88"
                className="stroke-blue-500 fill-none"
                strokeWidth="12"
                strokeDasharray="553"
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * percentage) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-gray-900 dark:text-white">{glasses}</span>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Verres</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-3">
              {[...Array(Math.max(goal, glasses))].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeGlass(i)}
                  className={`h-12 rounded-xl flex items-center justify-center transition-all ${
                    i < glasses 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-300'
                  }`}
                >
                  <Droplets className={`w-5 h-5 ${i < glasses ? 'fill-current' : ''}`} />
                </motion.button>
              ))}
            </div>

            <button
              onClick={addGlass}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <Plus className="w-6 h-6" /> Ajouter un verre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}