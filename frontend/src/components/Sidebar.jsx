import { NavLink } from 'react-router-dom';
import { useState, useEffect, memo } from 'react';
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  TrendingUp,
  User,
  X,
  Zap,
  LogOut,
  Timer,
  Trophy,
  Calendar,
  Settings,
  Bell,
  Target,
  Moon,
  Brain,
  CalendarDays
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/XPContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
  { path: '/repas', icon: Utensils, label: 'Repas' },
  { path: '/sport', icon: Dumbbell, label: 'Sport' },
  { path: '/programmes', icon: Calendar, label: 'Programmes' },
  { path: '/planning', icon: Brain, label: 'Planning' },
  { path: '/chrono', icon: Timer, label: 'Chronomètre' },
  { path: '/defis', icon: Target, label: 'Défis' },
  { path: '/trophees', icon: Trophy, label: 'Trophées' },
  { path: '/performances', icon: TrendingUp, label: 'Performance' },
  { path: '/progression', icon: CalendarDays, label: 'Progression' },
  { path: '/sommeil', icon: Moon, label: 'Sommeil' },
  { path: '/rappels', icon: Bell, label: 'Rappels' },
  // { path: '/profil', icon: User, label: 'Profil' }, // Moved to Avatar click
  { path: '/parametres', icon: Settings, label: 'Paramètres' },
];

export const Sidebar = memo(({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { xpData, fetchXPStatus } = useXP();

  useEffect(() => {
    if (user && !xpData) {
      fetchXPStatus();
    }
  }, [user, xpData, fetchXPStatus]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
    window.location.href = '/login';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          sidebar
          ${isOpen ? '' : 'sidebar-hidden lg:translate-x-0'}
        `}
        data-testid="sidebar"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-[#6441a5] to-[#B0E301] flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <h1 className="logo-pixel">
                <span className="logo-fit">FIT</span>
                <span className="logo-quest">QUEST</span>
              </h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-accent/10 rounded transition-colors"
              data-testid="close-sidebar-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <NavLink to="/profil" className="block p-4 border-b border-border hover:bg-accent/10 transition-colors cursor-pointer group" onClick={onClose}>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-accent/30 group-hover:border-accent transition-colors">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate group-hover:text-accent transition-colors">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            {/* XP Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">
                  Niv. {xpData?.level || 1} - {xpData?.title || 'Débutant'}
                </span>
                <span className="text-accent">{xpData?.total_xp?.toLocaleString() || 0} XP</span>
              </div>
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: `${xpData?.progress || 0}%` }} />
              </div>
            </div>
          </NavLink>
        )}

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto no-scrollbar pb-24">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  ${isActive
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                  }
                `}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="nav-item w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
});
