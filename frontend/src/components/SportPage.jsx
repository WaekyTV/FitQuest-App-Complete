import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Search, Filter, Play, Clock, Zap, ChevronRight, Trophy } from 'lucide-react';

export default function SportPage() {
  const [activeTab, setActiveTab] = useState('Tous');
  
  const categories = ['Tous', 'Force', 'Cardio', 'HIIT', 'Yoga', 'Mobilité'];
  
  const exercises = [
    { name: 'Full Body Explosif', duration: '45 min', xps: '350', level: 'Intermédiaire', category: 'Force' },
    { name: 'HIIT Cardio Pur', duration: '20 min', xps: '250', level: 'Avancé', category: 'HIIT' },
    { name: 'Core Master', duration: '15 min', xps: '150', level: 'Débutant', category: 'Force' },
    { name: 'Morning Flow', duration: '10 min', xps: '100', level: 'Débutant', category: 'Mobilité' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none italic uppercase mb-2">Entraînement</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Dépassez vos limites aujourd'hui</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input className="pl-12 pr-6 py-4 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm w-full md:w-64 outline-none focus:ring-2 ring-blue-500 font-bold" placeholder="Rechercher..." />
          </div>
          <button className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-gray-400 hover:text-blue-500 transition-colors">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-8 py-3 rounded-full font-black text-sm tracking-widest uppercase whitespace-nowrap transition-all ${
              activeTab === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105' : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {exercises.map((ex, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="group bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-8 items-center cursor-pointer relative overflow-hidden"
          >
            <div className="w-full md:w-48 aspect-square bg-gray-50 dark:bg-gray-700 rounded-[2rem] flex items-center justify-center relative overflow-hidden">
              <Dumbbell className="w-16 h-16 text-blue-500 relative z-10" />
              <div className="absolute inset-0 bg-blue-500/5 transition-transform group-hover:scale-150" />
            </div>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-widest rounded-lg flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> +{ex.xps} XP
                </span>
                <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-400 text-[10px] font-black tracking-widest rounded-lg">{ex.category}</span>
              </div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-tight italic">{ex.name}</h3>
              <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 font-bold text-sm">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {ex.duration}</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                <span className="flex items-center gap-1.5"><Zap className={`w-4 h-4 ${ex.level === 'Avancé' ? 'text-red-500' : 'text-green-500'}`} /> {ex.level}</span>
              </div>
            </div>

            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
                <Play className="w-6 h-6 text-white fill-current ml-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}