import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, Zap, Flame, Target, Shield, Heart } from 'lucide-react';

export default function TrophiesPage() {
  const trophies = [
    { title: 'Lève-tôt', desc: '5 séances avant 8h', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100', unlocked: true },
    { title: 'Guerrier', desc: '100 séances au total', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100', unlocked: true },
    { title: 'Persévérant', desc: '30 jours consécutifs', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100', unlocked: false },
    { title: 'Maître Nutrition', desc: 'Objectif calories sur 7j', icon: Heart, color: 'text-red-500', bg: 'bg-red-100', unlocked: true },
    { title: 'Collectionneur', desc: 'Débloquez 50 exercices', icon: Star, color: 'text-purple-500', bg: 'bg-purple-100', unlocked: false },
    { title: 'Champion', desc: 'Gagnez 3 concours', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-200', unlocked: false },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none italic uppercase mb-2">Salle des Trophées</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Vos exploits et récompenses</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-sm font-black text-yellow-600 uppercase tracking-widest">Trophées débloqués</div>
            <div className="text-4xl font-black italic tracking-tighter">3/6</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trophies.map((tr, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: tr.unlocked ? 1.05 : 1 }}
            className={`p-8 rounded-[3rem] shadow-xl border-2 transition-all relative overflow-hidden ${
              tr.unlocked ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent opacity-50 grayscale'
            }`}
          >
            <div className={`w-16 h-16 ${tr.bg} ${tr.color} rounded-[1.5rem] flex items-center justify-center mb-6 shadow-sm`}>
              <tr.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight italic mb-2">{tr.title}</h3>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">{tr.desc}</p>
            
            {!tr.unlocked && (
              <div className="absolute top-8 right-8 text-gray-400">
                <Target className="w-6 h-6" />
              </div>
            )}
            
            {tr.unlocked && (
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-yellow-500 opacity-5 rounded-full" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}