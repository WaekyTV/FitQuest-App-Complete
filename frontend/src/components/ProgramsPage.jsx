import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Zap, ChevronRight, Play } from 'lucide-react';

export default function ProgramsPage() {
  const programs = [
    { title: 'Prise de Masse', duration: '12 sem.', sessions: 48, intensity: 'Haute' },
    { title: 'Perte de Poids', duration: '8 sem.', sessions: 32, intensity: 'Moyenne' },
    { title: 'Remise en Forme', duration: '4 sem.', sessions: 12, intensity: 'Douce' }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Programmes</h1>
        <div className="p-2 bg-blue-100 rounded-full text-blue-600"><Dumbbell className="w-6 h-6" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {programs.map((p, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border-b-8 border-blue-500 hover:-translate-y-2 transition-transform cursor-pointer group">
            <h3 className="text-2xl font-black mb-6">{p.title}</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold text-gray-400">
                <span>DURÉE</span> <span className="text-gray-900 dark:text-white uppercase tracking-wider">{p.duration}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-400">
                <span>SÉANCES</span> <span className="text-gray-900 dark:text-white uppercase tracking-wider">{p.sessions}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-400">
                <span>INTENSITÉ</span> <span className="text-blue-600 uppercase tracking-widest">{p.intensity}</span>
              </div>
            </div>
            <button className="w-full py-4 bg-gray-900 dark:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors">
              <Play className="w-4 h-4 fill-current" /> DÉMARRER
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}