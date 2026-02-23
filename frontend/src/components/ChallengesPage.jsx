import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Users, Target } from 'lucide-react';

const challenges = [
  { id: 1, title: 'Guerrier du Matin', description: 'Effectuez 5 séances avant 8h', reward: '500 XP', icon: Target, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 2, title: 'Hydratation Parfaite', description: 'Atteignez votre objectif eau pendant 7 jours', reward: '300 XP', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 3, title: 'Maître du Cardio', description: 'Courez 20km en une semaine', reward: '1000 XP', icon: Star, color: 'text-purple-500', bg: 'bg-purple-100' },
];

export default function ChallengesPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Défis & Objectifs</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className={`w-12 h-12 ${challenge.bg} ${challenge.color} rounded-2xl flex items-center justify-center mb-4`}>
              <challenge.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{challenge.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-bold text-blue-600">{challenge.reward}</span>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium">
                Participer
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}