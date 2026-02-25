import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Utensils,
  Moon,
  Footprints,
  Droplet,
  TrendingUp,
  Flame,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ProgressionPage = () => {
  const { user } = useAuth();
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/progression/calendar?month=${month}&year=${year}`, { 
        withCredentials: true 
      });
      setCalendarData(response.data);
    } catch (error) {
      console.error('Error fetching calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (direction) => {
    let newMonth = month + direction;
    let newYear = year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDay(null);
  };

  const getDayData = (dateStr) => {
    return calendarData?.days?.find(d => d.date === dateStr);
  };

  const getDayColor = (dayData) => {
    if (!dayData) return 'bg-white/5';
    
    let score = 0;
    if (dayData.has_workout) score += 2;
    if (dayData.meals_count >= 2) score += 1;
    if (dayData.sleep_quality >= 3) score += 1;
    if (dayData.steps >= 5000) score += 1;
    
    if (score >= 4) return 'bg-[#B0E301]';
    if (score >= 3) return 'bg-[#B0E301]/70';
    if (score >= 2) return 'bg-[#FFD700]/70';
    if (score >= 1) return 'bg-[#FF6B35]/50';
    return 'bg-white/10';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="progression-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-[#B0E301]" />
            <span className="text-[#B0E301]">Calendrier de</span> Progression
          </h1>
          <p className="text-[#52525B] mt-1 text-sm">Visualisez votre parcours fitness</p>
        </div>
      </div>

      {/* Monthly Summary */}
      {calendarData?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Dumbbell className="w-6 h-6 text-[#B0E301] mx-auto mb-2" />
              <p className="text-2xl font-bold">{calendarData.summary.total_workouts}</p>
              <p className="text-xs text-[#52525B]">Entraînements</p>
            </CardContent>
          </Card>
          
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
              <p className="text-2xl font-bold">{calendarData.summary.total_calories?.toLocaleString()}</p>
              <p className="text-xs text-[#52525B]">Calories totales</p>
            </CardContent>
          </Card>
          
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Moon className="w-6 h-6 text-[#6441a5] mx-auto mb-2" />
              <p className="text-2xl font-bold">{calendarData.summary.avg_sleep_quality}/5</p>
              <p className="text-xs text-[#52525B]">Qualité sommeil</p>
            </CardContent>
          </Card>
          
          <Card className="card-stat">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-[#00BFFF] mx-auto mb-2" />
              <p className="text-2xl font-bold">{calendarData.summary.days_tracked}</p>
              <p className="text-xs text-[#52525B]">Jours actifs</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calendar */}
      <Card className="card-stat">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => changeMonth(-1)}
              className="text-[#A1A1AA] hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-lg font-semibold">
              {new Date(year, month - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => changeMonth(1)}
              className="text-[#A1A1AA] hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="text-center text-xs text-[#52525B] py-2 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const firstDay = new Date(year, month - 1, 1);
              const lastDay = new Date(year, month, 0);
              const daysInMonth = lastDay.getDate();
              
              let startDay = firstDay.getDay();
              startDay = startDay === 0 ? 6 : startDay - 1;
              
              const days = [];
              const today = new Date();
              const todayStr = today.toISOString().split('T')[0];
              
              // Empty cells
              for (let i = 0; i < startDay; i++) {
                days.push(<div key={`empty-${i}`} className="h-14" />);
              }
              
              // Days
              for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayData = getDayData(dateStr);
                const isToday = dateStr === todayStr;
                const isSelected = selectedDay === dateStr;
                const isFuture = new Date(dateStr) > today;
                
                days.push(
                  <button
                    key={day}
                    onClick={() => !isFuture && setSelectedDay(dateStr === selectedDay ? null : dateStr)}
                    disabled={isFuture}
                    className={`h-14 rounded-lg flex flex-col items-center justify-center transition-all relative ${
                      isSelected 
                        ? 'ring-2 ring-[#B0E301]' 
                        : isToday 
                          ? 'ring-2 ring-white/50' 
                          : ''
                    } ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-105'} ${getDayColor(dayData)}`}
                    data-testid={`calendar-day-${day}`}
                  >
                    <span className={`text-sm font-medium ${dayData?.has_workout ? 'text-black' : ''}`}>
                      {day}
                    </span>
                    {dayData && (
                      <div className="flex gap-0.5 mt-1">
                        {dayData.has_workout && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        {dayData.meals_count > 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#6441a5]" />}
                        {dayData.sleep_quality && <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF]" />}
                      </div>
                    )}
                  </button>
                );
              }
              
              return days;
            })()}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <div className="w-4 h-4 rounded bg-[#B0E301]" />
              <span>Jour complet</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <div className="w-4 h-4 rounded bg-[#FFD700]/70" />
              <span>Partiel</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>Workout</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6441a5]" />
              <span>Repas</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF]" />
              <span>Sommeil</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDay && (
        <Card className="card-stat" data-testid="day-details">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {new Date(selectedDay).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const dayData = getDayData(selectedDay);
              if (!dayData) {
                return <p className="text-[#52525B] text-center py-4">Aucune donnée pour ce jour</p>;
              }
              
              return (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="p-3 rounded bg-white/5 text-center">
                    <Dumbbell className={`w-5 h-5 mx-auto mb-1 ${dayData.has_workout ? 'text-[#B0E301]' : 'text-[#52525B]'}`} />
                    <p className="text-lg font-bold">{dayData.workout_count}</p>
                    <p className="text-xs text-[#52525B]">Séances</p>
                  </div>
                  
                  <div className="p-3 rounded bg-white/5 text-center">
                    <Utensils className={`w-5 h-5 mx-auto mb-1 ${dayData.meals_count > 0 ? 'text-[#6441a5]' : 'text-[#52525B]'}`} />
                    <p className="text-lg font-bold">{dayData.total_calories}</p>
                    <p className="text-xs text-[#52525B]">Calories</p>
                  </div>
                  
                  <div className="p-3 rounded bg-white/5 text-center">
                    <Target className={`w-5 h-5 mx-auto mb-1 ${dayData.total_protein > 0 ? 'text-[#FFD700]' : 'text-[#52525B]'}`} />
                    <p className="text-lg font-bold">{dayData.total_protein}g</p>
                    <p className="text-xs text-[#52525B]">Protéines</p>
                  </div>
                  
                  <div className="p-3 rounded bg-white/5 text-center">
                    <Moon className={`w-5 h-5 mx-auto mb-1 ${dayData.sleep_quality ? 'text-[#6441a5]' : 'text-[#52525B]'}`} />
                    <p className="text-lg font-bold">{dayData.sleep_quality || '-'}/5</p>
                    <p className="text-xs text-[#52525B]">Sommeil</p>
                  </div>
                  
                  <div className="p-3 rounded bg-white/5 text-center">
                    <Footprints className={`w-5 h-5 mx-auto mb-1 ${dayData.steps > 0 ? 'text-[#FF6B35]' : 'text-[#52525B]'}`} />
                    <p className="text-lg font-bold">{dayData.steps?.toLocaleString() || 0}</p>
                    <p className="text-xs text-[#52525B]">Pas</p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
