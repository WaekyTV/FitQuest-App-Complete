import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';

export default function ProgressionPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase">Progression</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Votre voyage vers l'excellence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'SÉANCES TOTALES', val: '142', icon: Calendar, color: 'text-blue-500' },
          { label: 'CALORIES BRÛLÉES', val: '85k', icon: Target, color: 'text-red-500' },
          { label: 'RECORD XP/JOUR', val: '1,250', icon: Award, color: 'text-yellow-500' },
          { label: 'NB JOURS CONSÉCUTIFS', val: '12', icon: TrendingUp, color: 'text-green-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-5` } />
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 dark:bg-black p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-5xl font-black tracking-tighter leading-none italic uppercase">Niveau actuel</h2>
            <div className="text-8xl font-black text-blue-500 leading-none">24</div>
            <p className="text-gray-400 font-bold max-w-md">Continuez comme ça ! Vous êtes dans le top 5% des utilisateurs ce mois-ci.</p>
            <div className="space-y-2">
              <div className="flex justify-between font-black text-sm tracking-widest">
                <span>XP ACTUEL : 12,450</span>
                <span className="text-blue-500">PROCHAIN NIVEAU : 15,000</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[82%]" />
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 aspect-square bg-blue-600/20 rounded-[3rem] border-4 border-blue-500/30 flex items-center justify-center p-8">
            <Award className="w-full h-full text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}