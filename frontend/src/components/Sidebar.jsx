import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Activity, Target, Utensils, 
  Settings, Award, Clock, Droplets, 
  Dumbbell, User, Zap
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Tableau de bord', path: '/' },
  { icon: Activity, label: 'Performance', path: '/performance' },
  { icon: Dumbbell, label: 'Exercices', path: '/sport' },
  { icon: Utensils, label: 'Nutrition', path: '/meals' },
  { icon: Clock, label: 'Chrono', path: '/chrono' },
  { icon: Target, label: 'Défis', path: '/challenges' },
  { icon: Award, label: 'Progression', path: '/progression' },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center">
            <Zap className="w-7 h-7 text-white fill-current" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">
            FitQuest
          </span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 active-nav-shadow' 
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              <item.icon className="w-6 h-6" />
              <span className="tracking-tight uppercase text-sm tracking-widest">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-2">
        <NavLink
          to="/profile"
          className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <User className="w-6 h-6" />
          <span className="tracking-tight uppercase text-sm tracking-widest">Profil</span>
        </NavLink>
        <NavLink
          to="/settings"
          className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <Settings className="w-6 h-6" />
          <span className="tracking-tight uppercase text-sm tracking-widest">Réglages</span>
        </NavLink>
        
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10 text-sm font-black text-blue-600 dark:text-blue-300">GO PREMIUM</div>
          <p className="relative z-10 text-xs text-blue-400 font-bold mt-1">Débloquez tous les exercices exclusifs</p>
          <Zap className="absolute -right-4 -bottom-4 w-20 h-20 text-blue-500 opacity-10 group-hover:scale-125 transition-transform" />
        </div>
      </div>
    </aside>
  );
}