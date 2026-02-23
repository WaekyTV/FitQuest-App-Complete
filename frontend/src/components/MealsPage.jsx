import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Plus, ChevronRight, Apple, Flame, Clock } from 'lucide-react';

export default function MealsPage() {
  const meals = [
    { type: 'Petit Déjeuner', calories: 450, icon: Apple, color: 'text-orange-500', items: 'Avoine, Banane, Beurre d\'amande' },
    { type: 'Déjeuner', calories: 750, icon: Utensils, color: 'text-blue-500', items: 'Poulet, Quinoa, Brocoli' },
    { type: 'Dîner', calories: 650, icon: Clock, color: 'text-purple-500', items: 'Saumon, Riz, Asperges' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Nutrition</h1>
          <p className="text-gray-500 dark:text-gray-400">Suivi de vos macros d'aujourd'hui</p>
        </div>
        <button className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 flex items-center gap-2 hover:bg-blue-700 transition-colors active:scale-95">
          <Plus className="w-6 h-6" /> <span className="font-bold hidden md:inline">Ajouter un repas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-xl space-y-4">
          <div className="flex items-center gap-3"><Flame className="text-orange-500" /> <span className="font-bold">Calories</span></div>
          <div className="text-3xl font-black">1,850 <span className="text-sm text-gray-400">/ 2,500</span></div>
          <div className="w-full h-3 bg-gray-100 rounded-full"><div className="w-3/4 h-full bg-orange-500 rounded-full" /></div>
        </div>
        {/* Simplified macros for layout */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-xl space-y-4">
          <div className="flex items-center gap-3"><div className="w-3 h-3 bg-blue-500 rounded-full" /> <span className="font-bold">Protéines</span></div>
          <div className="text-3xl font-black">120g <span className="text-sm text-gray-400">/ 180g</span></div>
          <div className="w-full h-3 bg-gray-100 rounded-full"><div className="w-2/3 h-full bg-blue-500 rounded-full" /></div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-xl space-y-4">
          <div className="flex items-center gap-3"><div className="w-3 h-3 bg-green-500 rounded-full" /> <span className="font-bold">Glucides</span></div>
          <div className="text-3xl font-black">210g <span className="text-sm text-gray-400">/ 300g</span></div>
          <div className="w-full h-3 bg-gray-100 rounded-full"><div className="w-3/4 h-full bg-green-500 rounded-full" /></div>
        </div>
      </div>

      <div className="space-y-4">
        {meals.map((meal, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-[1.5rem] shadow-md border border-gray-100 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center ${meal.color}`}>
                <meal.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{meal.type}</h3>
                <p className="text-gray-400 font-medium">{meal.items}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-6">
              <div>
                <span className="text-2xl font-black">{meal.calories}</span>
                <span className="text-gray-400 text-sm ml-1 font-bold">KCAL</span>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}