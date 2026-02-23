import React from 'react';
import { Calendar, Brain, Clock, Plus, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SmartPlanningPage() {
  const weekDays = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-xs font-black tracking-[0.2em] mb-4 uppercase">
            <Brain className="w-3.5 h-3.5" /> IA Suggestion
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Planning Intelligent</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl flex items-center gap-2 hover:bg-blue-600 transition-all">
            MODIFIER <Zap className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
        {weekDays.map((day, i) => (
          <div key={i} className={`min-w-[120px] p-6 rounded-[2rem] border-2 text-center transition-all cursor-pointer ${
            day === 'MER' ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 scale-110 mx-4' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-blue-500/30'
          }`}>
            <div className={`text-xs font-black tracking-widest ${day === 'MER' ? 'text-blue-100' : 'text-gray-400'}`}>{day}</div>
            <div className="text-2xl font-black mt-1">{12 + i}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-black uppercase italic tracking-tight">Programme du jour</h3>
          {[
            { time: '07:00', task: 'Hydratation Matinale', type: 'Santé', color: 'text-blue-500' },
            { time: '11:30', task: 'Lunch Protéiné', type: 'Nutrition', color: 'text-green-500' },
            { time: '18:15', task: 'Full Body Explosif', type: 'Sport', color: 'text-orange-500' },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 group">
              <div className="w-16 text-xs font-black text-gray-400 pt-1 uppercase tracking-widest">{item.time}</div>
              <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:border-blue-500/50 transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.color}`}>{item.type}</span>
                    <h4 className="text-xl font-black uppercase tracking-tight mt-1">{item.task}</h4>
                  </div>
                  <ChevronRight className="text-gray-200 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
          <div className="relative z-10">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Recommandation du Coach</h3>
            <p className="text-gray-400 font-bold leading-relaxed mb-8">D'après vos séances précédentes, vos muscles du dos ont besoin de récupération supplémentaire. Concentrez-vous sur le bas du corps aujourd'hui.</p>
            <div className="inline-flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div>
              <div>
                <div className="text-xs font-black text-blue-400 uppercase tracking-widest">SÉANCE OPTIMALE</div>
                <div className="text-lg font-black uppercase tracking-tight italic">Jambes & Mobilité</div>
              </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="w-full py-5 bg-white text-gray-900 rounded-2xl font-black tracking-[0.2em] uppercase mt-12 shadow-xl"
          >
            ADOPTER LE PLANNING
          </motion.button>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
      </div>
    </div>
  );
}