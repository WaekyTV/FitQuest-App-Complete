import React from 'react';
import { Moon, Clock, Zap, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SleepPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Moon className="w-6 h-6" /></div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Sommeil</h1>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-gray-400 uppercase tracking-widest">Score du jour</div>
          <div className="text-4xl font-black text-indigo-600">85/100</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Clock className="text-indigo-400" /> Analyse de la nuit
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Durée totale</div>
                  <div className="text-4xl font-black italic">7h 45<span className="text-lg ml-1">min</span></div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-indigo-400 uppercase tracking-widest font-bold">Objectif atteint</div>
                  <div className="text-sm font-black uppercase tracking-tight">8h demandées</div>
                </div>
              </div>
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full flex overflow-hidden">
                <div className="w-[15%] h-full bg-indigo-200" />
                <div className="w-[50%] h-full bg-indigo-500" />
                <div className="w-[20%] h-full bg-indigo-700" />
                <div className="w-[15%] h-full bg-indigo-900" />
              </div>
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Éveil</span> <span>Léger</span> <span>Profond</span> <span>Paradoxal</span>
              </div>
            </div>
          </div>
          <Moon className="absolute -right-10 -bottom-10 w-48 h-48 text-indigo-500 opacity-5" />
        </div>

        <div className="space-y-6">
          {[
            { label: 'Endormissement', val: '22:45', icon: Star, color: 'text-indigo-400' },
            { label: 'Réveil', val: '06:30', icon: Zap, color: 'text-orange-400' },
            { label: 'Repos réparateur', val: '+12%', icon: TrendingUp, color: 'text-green-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg flex items-center justify-between group hover:-translate-x-2 transition-transform">
              <div className="flex items-center gap-4">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="font-bold text-gray-400 uppercase tracking-widest text-xs">{stat.label}</span>
              </div>
              <span className="text-2xl font-black italic">{stat.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}