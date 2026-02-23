import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Dumbbell, MoreVertical } from 'lucide-react';

export default function SavedSequenceCard({ sequence }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-gray-700 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-[0.03] rounded-bl-full pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600">
          <Dumbbell className="w-6 h-6" />
        </div>
        <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <h3 className="text-xl font-black mb-2 uppercase tracking-tight line-clamp-1">{sequence.name}</h3>
      
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-1.5 font-bold text-gray-500 text-sm">
          <Clock className="w-4 h-4 text-gray-300" /> {sequence.totalTime}min
        </div>
        <div className="flex items-center gap-1.5 font-bold text-gray-500 text-sm">
          <Dumbbell className="w-4 h-4 text-gray-300" /> {sequence.exercises?.length || 0} ex.
        </div>
      </div>

      <button className="w-full py-4 bg-gray-900 dark:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-all shadow-lg active:scale-95">
        <Play className="w-4 h-4 fill-current ml-1" /> DÉMARRER
      </button>
    </motion.div>
  );
}