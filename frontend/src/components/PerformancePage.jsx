import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Calendar, Award } from 'lucide-react';

export default function PerformancePage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Performance</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Analyse de vos progrès sur le long terme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="text-blue-500" /> Force Globale
            </h3>
            <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-bold px-4 py-2">
              <option>Dernier mois</option>
              <option>6 mois</option>
              <option>Année</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[45, 60, 55, 75, 85, 90, 80].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-xl hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </motion.div>
                <span className="text-xs font-bold text-gray-400">LUN</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Volume Total</div>
                <div className="text-2xl font-black">12.5 <span className="text-base text-gray-400">Tonnes</span></div>
              </div>
            </div>
            <TrendingUp className="text-green-500" />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Record du jour</div>
                <div className="text-2xl font-black">100 <span className="text-base text-gray-400">kg DC</span></div>
              </div>
            </div>
            <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-black rounded-full">+15%</span>
          </div>
        </div>
      </div>
    </div>
  );
}