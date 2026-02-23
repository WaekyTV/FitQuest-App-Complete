import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Droplets, Utensils, Zap, ChevronRight, TrendingUp } from 'lucide-react';
import HydrationSystem from './HydrationSystem';

export default function Dashboard() {
  const [stats, setStats] = useState({
    calories: 1850,
    targetCalories: 2500,
    water: 1.5,
    targetWater: 2.5,
    workoutTime: 45,
    intensity: 85
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Bonjour, Lucas 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Prêt pour une nouvelle séance ?</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-bold flex items-center gap-2">
            <Zap className="w-4 h-4" /> 12 Jours d'affilée
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Utensils} 
          label="Calories" 
          value={stats.calories} 
          unit="kcal" 
          progress={(stats.calories / stats.targetCalories) * 100}
          color="bg-orange-500"
        />
        <StatCard 
          icon={Droplets} 
          label="Eau" 
          value={stats.water} 
          unit="L" 
          progress={(stats.water / stats.targetWater) * 100}
          color="bg-blue-500"
        />
        <StatCard 
          icon={Activity} 
          label="Activité" 
          value={stats.workoutTime} 
          unit="min" 
          progress={75}
          color="bg-green-500"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Intensité" 
          value={stats.intensity} 
          unit="%" 
          progress={stats.intensity}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Séances recommandées</h2>
              <button className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Voir tout <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WorkoutCard title="Full Body Explosif" duration="45 min" xps="350" level="Intermédiaire" />
              <WorkoutCard title="HIIT Brûle Graisse" duration="20 min" xps="200" level="Débutant" />
            </div>
          </section>
        </div>
        
        <div className="space-y-8">
          <HydrationSystem />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, unit, progress, color }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{value}<span className="text-base ml-1">{unit}</span></p>
        </div>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </motion.div>
  );
}

function WorkoutCard({ title, duration, xps, level }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-all cursor-pointer group">
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{title}</h4>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium">{duration}</span>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-lg text-sm font-bold">+{xps} XP</span>
        <span className="px-3 py-1 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-200 rounded-lg text-sm font-medium">{level}</span>
      </div>
    </div>
  );
}