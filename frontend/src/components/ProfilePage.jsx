import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Camera, Award, Shield, LogOut } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="relative mb-12">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] shadow-lg"></div>
        <div className="absolute -bottom-10 left-10 flex items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2.5rem] border-8 border-white dark:border-gray-900 bg-gray-200 overflow-hidden shadow-xl">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" alt="Profile" />
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Lucas Bernard</h1>
            <p className="text-blue-600 dark:text-blue-400 font-bold">Niveau 24 • Explorateur</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-12">
        {[
          { label: 'SÉANCES', val: '142', icon: Shield, color: 'text-blue-500' },
          { label: 'POINTS XP', val: '12.4k', icon: Award, color: 'text-yellow-500' },
          { label: 'DÉFIS', val: '28', icon: User, color: 'text-purple-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg text-center border border-gray-100 dark:border-gray-700">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-black">{stat.val}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <button className="w-full p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-md flex items-center justify-between group hover:bg-gray-50 transition-colors border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-left font-bold text-lg">Paramètres du compte</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            →
          </div>
        </button>

        <button className="w-full p-6 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center gap-3 font-bold hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5" /> Déconnexion
        </button>
      </div>
    </div>
  );
}