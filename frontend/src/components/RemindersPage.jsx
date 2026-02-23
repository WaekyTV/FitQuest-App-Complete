import React, { useState } from 'react';
import { Bell, Plus, Trash2, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Séance Jambes', time: '18:00', days: ['LUN', 'MER', 'VEN'], active: true },
    { id: 2, title: 'Yoga Matinal', time: '07:30', days: ['MAR', 'JEU'], active: false },
  ]);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl"><Bell className="w-6 h-6" /></div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Rappels</h1>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform">
          <Plus className="w-5 h-5" /> NOUVEAU
        </button>
      </div>

      <div className="space-y-4">
        {reminders.map((rem) => (
          <div 
            key={rem.id}
            className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${
              rem.active ? 'bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900 shadow-xl' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent opacity-60'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                rem.active ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {rem.time}
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{rem.title}</h3>
                <div className="flex gap-2 mt-1">
                  {rem.days.map(d => (
                    <span key={d} className="text-[10px] font-black tracking-widest text-gray-400">{d}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setReminders(reminders.map(r => r.id === rem.id ? { ...r, active: !r.active } : r))}
                className={`w-14 h-8 rounded-full relative transition-colors ${rem.active ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${rem.active ? 'left-7' : 'left-1'}`} />
              </button>
              <button className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}