import { useState, useEffect, useCallback, useRef } from 'react';
import { Save, Bell, BellOff, ChevronLeft, ChevronRight, CheckCircle, X, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WEEK_STORAGE_KEY = 'fitquest_planning_v3';
const REMINDER_STORAGE_KEY = 'fitquest_planning_reminder';

// ─── Data ────────────────────────────────────────────────────────────────────

const SHIFT_OPTIONS = [
  { value: '6h-18h', label: 'Poste Jour 6H-18H', icon: '☀️', short: 'J6' },
  { value: '7h-18h', label: 'Poste Jour 7H-18H', icon: '🌤️', short: 'J7' },
  { value: '18h-6h', label: 'Poste Nuit 18H-6H', icon: '🌙', short: 'NUIT' },
  { value: 'repos', label: 'Repos', icon: '💤', short: 'REPOS' },
  { value: 'repos_sport', label: 'Repos + Sport', icon: '🏃', short: 'R+S' },
];

const WORKOUT_OPTIONS = [
  { value: 'aucun', label: 'Aucune séance', icon: '' },
  { value: 'renforcement', label: 'Renforcement', icon: '💪' },
  { value: 'cardio', label: 'Cardio', icon: '🏃' },
  { value: 'hiit', label: 'HIIT', icon: '⚡' },
  { value: 'repos_actif', label: 'Récup. Active', icon: '🧘' },
];

const SHIFT_COLORS = {
  '6h-18h': '#B0E301',
  '7h-18h': '#B0E301',
  '18h-6h': '#8B5CF6',
  'repos': '#52525B',
  'repos_sport': '#FF6B35',
};

const WORKOUT_COLORS = {
  aucun: '#3F3F46',
  renforcement: '#B0E301',
  cardio: '#38bdf8',
  hiit: '#FF6B35',
  repos_actif: '#a78bfa',
};

const SLEEP_TIPS = {
  '6h-18h': {
    icon: '☀️',
    coucher: '20H30 – 21H30',
    reveil: '05H00 – 06H00',
    duree: '8h de sommeil',
    color: '#B0E301',
    tips: [
      '💤 Couche-toi impérativement avant 21H30 pour avoir 7-8h avant 5H.',
      '📵 Coupe les écrans (téléphone, TV) 1h avant le coucher — la lumière bleue retarde l\'endormissement.',
      '🌙 Si tu te couches à 22H pour te lever à 5H = seulement 7h. Si tu te couches à 23H = 6h seulement !',
      '☕ Pas de caféine après 14H pour ne pas perturber l\'endormissement.',
      '🧘 Ritual : douche tidiède + lecture 20min pour signaler au corps que c\'est l\'heure.',
    ],
  },
  '7h-18h': {
    icon: '🌤️',
    coucher: '21H30 – 22H00',
    reveil: '06H00 – 06H15',
    duree: '8h de sommeil',
    color: '#B0E301',
    tips: [
      '💤 Pour 8h de sommeil avec réveil à 6H : coucher idéal à 22H pile.',
      '📵 Pas d\'écrans après 21H pour faciliter l\'endormissement.',
      '☕ Pas de caféine après 14H-15H.',
      '🌙 Chambre fraiche (16-19°C) = endormissement plus rapide.',
    ],
  },
  '18h-6h': {
    icon: '🌙',
    coucher: '07H00 – 08H00 (après poste)',
    reveil: '14H00 – 15H00',
    duree: '7-8h de sommeil diurne',
    color: '#8B5CF6',
    tips: [
      '🌙 Dors le matin après ton poste : 6H30/7H → 14H/15H = 7-8h idéal.',
      '🙅 Installe des RIDEAUX OCCULTANTS dans ta chambre — indispensable pour le sommeil diurne.',
      '🙏 Sièste optionnelle 45min vers 17H avant de partir au poste pour booster la vigilance.',
      '📵 Masque de sommeil + bouchons d\'oreilles si nuisances sonores en journée.',
      '❌ Pas de caféine après 3H du matin pour pouvoir t\'endormir à l\'arrivée du matin.',
    ],
  },
  'repos': {
    icon: '💤',
    coucher: '22H30 – 23H00',
    reveil: '07H00 – 08H30',
    duree: '8-8h30 de sommeil',
    color: '#71717A',
    tips: [
      '📵 Jour de repos parfait pour rattraper un déficit de sommeil.',
      '🔄 Maintiens l\'horaire proche des jours de travail pour ne pas dérégler ton rythme circadien.',
      '📊 Expose-toi à la lumière naturelle le matin pour réguler ton horloge biologique.',
    ],
  },
  'repos_sport': {
    icon: '🏃',
    coucher: '21H30 – 22H30',
    reveil: '06H30 – 07H30',
    duree: '8h+ de sommeil (récupération)',
    color: '#FF6B35',
    tips: [
      '💤 Après une séance intense, le sommeil est TA VRAIE récupération.',
      '👁️ Pas d\'entraînement intense après 20H : l\'adrénaline retarde l\'endormissement.',
      '🥑 Mange suffisamment en post-training pour ne pas être en déficit calorique la nuit.',
      '🌙 8h+ de sommeil = +20% de performance lors de la prochaine séance.',
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pad = n => String(n).padStart(2, '0');
const toDateStr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function getMonthDays(year, month) {
  // Returns array of week-rows, each row has 7 date strings (or null for padding)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday-first: 0=Mon … 6=Sun
  let startDow = (firstDay.getDay() + 6) % 7; // shift Sunday from 0 to 6
  const days = [];
  // Pad start with previous month days
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ dateStr: toDateStr(d), currentMonth: false });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dt = new Date(year, month, d);
    days.push({ dateStr: toDateStr(dt), currentMonth: true });
  }
  // Pad end to complete last row
  while (days.length % 7 !== 0) {
    const dt = new Date(year, month + 1, days.length - lastDay.getDate() - startDow + 1);
    days.push({ dateStr: toDateStr(dt), currentMonth: false });
  }
  // Group into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function getMondayOfWeek(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const dow = (d.getDay() + 6) % 7; // Mon=0
  d.setDate(d.getDate() - dow);
  return toDateStr(d);
}

function getWeekDays(mondayStr) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayStr + 'T12:00:00');
    d.setDate(d.getDate() + i);
    days.push(toDateStr(d));
  }
  return days;
}

const FR_MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const FR_DAYS_SHORT = ['LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.', 'DIM.'];
const FR_DAYS_LONG = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function formatFull(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ─── Day Editor Panel (shown when creating/editing from calendar click) ────────

function DayEditor({ dateStr, data, onChange, onDelete, onClose, onReset, onSave }) {
  const today = new Date().toISOString().split('T')[0];
  const sleep = data?.shift_type ? SLEEP_TIPS[data.shift_type] : null;
  const [openSection, setOpenSection] = useState('shift'); // start shift open
  const toggleSection = (s) => setOpenSection(prev => prev === s ? null : s);

  const handleShiftSelect = (val) => { onChange('shift_type', val); };
  const handleWorkoutSelect = (val) => { onChange('workout_type', val); };

  const shiftOpt = data?.shift_type ? SHIFT_OPTIONS.find(o => o.value === data.shift_type) : null;
  const workoutOpt = data?.workout_type ? WORKOUT_OPTIONS.find(o => o.value === data.workout_type) : null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#0d0d14', border: `1px solid ${data?.shift_type ? SHIFT_COLORS[data.shift_type] + '55' : '#313138'}` }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#313138' }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold capitalize truncate" style={{ color: '#E4E4E7' }}>{formatFull(dateStr)}</span>
          {dateStr === today && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ backgroundColor: '#B0E30120', color: '#B0E301', border: '1px solid #B0E30150' }}>
              Aujourd'hui
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {data?.shift_type && (
            <>
              <button onClick={onReset} className="text-[11px] text-zinc-500 hover:text-amber-400 transition-colors">
                ↺ Réinitialiser
              </button>
              <span className="text-zinc-700">|</span>
            </>
          )}
          {/* Save — always visible, saves and closes */}
          <button
            onClick={() => { onSave(); onClose(); }}
            className="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            style={{ backgroundColor: '#B0E301', color: '#0A0A0A' }}
          >
            <Save className="w-3.5 h-3.5" /> Sauvegarder
          </button>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">

        {/* ── SHIFT ACCORDION ─────────────────────────────────────────────────── */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a2a36' }}>
          <button
            className="w-full flex items-center justify-between px-3 py-2.5"
            onClick={() => toggleSection('shift')}
            style={{ backgroundColor: shiftOpt ? `${SHIFT_COLORS[shiftOpt.value]}15` : '#131320' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type de poste</span>
              {shiftOpt && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${SHIFT_COLORS[shiftOpt.value]}25`, color: SHIFT_COLORS[shiftOpt.value] }}>
                  {shiftOpt.icon} {shiftOpt.label}
                </span>
              )}
            </div>
            <span className="text-zinc-500 text-sm">{openSection === 'shift' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'shift' && (
            <div className="p-2 space-y-1.5" style={{ backgroundColor: '#0d0d14' }}>
              {SHIFT_OPTIONS.map(opt => {
                const active = data?.shift_type === opt.value;
                const color = SHIFT_COLORS[opt.value];
                return (
                  <button key={opt.value} onClick={() => handleShiftSelect(opt.value)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all"
                    style={{ backgroundColor: active ? `${color}18` : 'transparent', border: `1px solid ${active ? color + '55' : '#2a2a36'}`, color: active ? color : '#6b6b7a' }}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span>{opt.label}</span>
                    {active && <CheckCircle className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── WORKOUT ACCORDION ───────────────────────────────────────────────── */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a2a36' }}>
          <button
            className="w-full flex items-center justify-between px-3 py-2.5"
            onClick={() => toggleSection('workout')}
            style={{ backgroundColor: workoutOpt && workoutOpt.value !== 'aucun' ? `${WORKOUT_COLORS[workoutOpt.value]}15` : '#131320' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Séance sport</span>
              {workoutOpt && workoutOpt.value !== 'aucun' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${WORKOUT_COLORS[workoutOpt.value]}25`, color: WORKOUT_COLORS[workoutOpt.value] }}>
                  {workoutOpt.icon} {workoutOpt.label}
                </span>
              )}
            </div>
            <span className="text-zinc-500 text-sm">{openSection === 'workout' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'workout' && (
            <div className="p-2 space-y-1.5" style={{ backgroundColor: '#0d0d14' }}>
              {WORKOUT_OPTIONS.map(opt => {
                const active = (data?.workout_type || 'aucun') === opt.value;
                const color = WORKOUT_COLORS[opt.value];
                return (
                  <button key={opt.value} onClick={() => handleWorkoutSelect(opt.value)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all"
                    style={{ backgroundColor: active ? `${color}18` : 'transparent', border: `1px solid ${active ? color + '55' : '#2a2a36'}`, color: active ? color : '#6b6b7a' }}
                  >
                    <span className="text-base">{opt.icon || '—'}</span>
                    <span>{opt.label}</span>
                    {active && <CheckCircle className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sleep advice */}
        {sleep && (
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${sleep.color}35` }}>
            <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: `${sleep.color}15` }}>
              <span className="text-base">{sleep.icon}</span>
              <p className="text-[11px] font-bold" style={{ color: sleep.color }}>ROUTINE SOMMEIL – {sleep.duree}</p>
            </div>
            <div className="px-3 py-2.5 space-y-1.5" style={{ backgroundColor: '#0d0d14' }}>
              <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold mb-1">
                <span className="text-zinc-300">🛌 <span style={{ color: sleep.color }}>{sleep.coucher}</span></span>
                <span className="text-zinc-500">→</span>
                <span className="text-zinc-300">⏰ <span style={{ color: sleep.color }}>{sleep.reveil}</span></span>
              </div>
              {sleep.tips.map((tip, i) => (
                <p key={i} className="text-[11px] text-zinc-400 leading-relaxed">{tip}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Month View (Mobile) ──────────────────────────────────────────────────────

function MonthView({ year, month, planning, today, selectedDay, onSelectDay, onGoMonth }) {
  const weeks = getMonthDays(year, month);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#0d0d14', border: '1px solid #1f1f2e' }}
    >
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: '#1f1f2e' }}>
        {FR_DAYS_SHORT.map(d => (
          <div key={d} className="py-2 text-center text-[10px] font-semibold tracking-widest" style={{ color: '#52525B' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Week rows */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7" style={{ borderBottom: wi < weeks.length - 1 ? '1px solid #1a1a28' : 'none' }}>
          {week.map(({ dateStr, currentMonth }) => {
            const d = planning[dateStr];
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDay;
            const shiftOpt = d?.shift_type ? SHIFT_OPTIONS.find(o => o.value === d.shift_type) : null;
            const wrkOpt = d?.workout_type && d.workout_type !== 'aucun' ? WORKOUT_OPTIONS.find(o => o.value === d.workout_type) : null;
            const shiftColor = shiftOpt ? SHIFT_COLORS[shiftOpt.value] : null;

            return (
              <div
                key={dateStr}
                onClick={() => onSelectDay(isSelected ? null : dateStr)}
                className="relative flex flex-col cursor-pointer select-none transition-colors"
                style={{
                  minHeight: 72,
                  borderRight: '1px solid #1a1a28',
                  backgroundColor: isSelected ? '#1a1a2e' : 'transparent',
                  padding: '6px 4px 4px',
                }}
              >
                {/* Date number */}
                <div className="flex justify-center mb-1">
                  <span
                    className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: isToday ? '#B0E301' : isSelected ? '#B0E30130' : 'transparent',
                      color: isToday ? '#0A0A0A' : currentMonth ? (isSelected ? '#B0E301' : '#D4D4D8') : '#3F3F46',
                      fontWeight: isToday || isSelected ? 700 : 400,
                    }}
                  >
                    {new Date(dateStr + 'T12:00:00').getDate()}
                  </span>
                </div>

                {/* Shift chip */}
                {shiftOpt && (
                  <div
                    className="mx-0.5 rounded px-1 py-0.5 text-center mb-0.5"
                    style={{ backgroundColor: `${shiftColor}22`, border: `1px solid ${shiftColor}40` }}
                  >
                    <span className="text-[9px] font-bold leading-none" style={{ color: shiftColor }}>
                      {shiftOpt.icon} {shiftOpt.short}
                    </span>
                  </div>
                )}

                {/* Workout dot */}
                {wrkOpt && (
                  <div className="flex justify-center">
                    <span className="text-[11px]">{wrkOpt.icon}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Week View (Desktop) ──────────────────────────────────────────────────────

function WeekView({ weekDays, planning, today, selectedDay, onSelectDay }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#0d0d14', border: '1px solid #1f1f2e' }}>
      {/* Column headers */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: '#1f1f2e' }}>
        {weekDays.map((dateStr, i) => {
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDay;
          const num = new Date(dateStr + 'T12:00:00').getDate();
          return (
            <div
              key={dateStr}
              className="flex flex-col items-center pt-3 pb-2 cursor-pointer select-none hover:bg-white/5 transition-colors"
              style={{ borderRight: i < 6 ? '1px solid #1f1f2e' : 'none' }}
              onClick={() => onSelectDay(isSelected ? null : dateStr)}
            >
              <span className="text-[11px] uppercase tracking-widest mb-1" style={{ color: isToday ? '#B0E301' : '#52525B' }}>
                {FR_DAYS_SHORT[i]}
              </span>
              <span
                className="w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold"
                style={{
                  backgroundColor: isSelected ? '#B0E301' : isToday ? '#B0E30120' : 'transparent',
                  color: isSelected ? '#0A0A0A' : isToday ? '#B0E301' : '#D4D4D8',
                }}
              >
                {num}
              </span>
            </div>
          );
        })}
      </div>

      {/* Event rows */}
      <div className="grid grid-cols-7" style={{ minHeight: 180 }}>
        {weekDays.map((dateStr, i) => {
          const d = planning[dateStr];
          const isSelected = dateStr === selectedDay;
          const shiftOpt = d?.shift_type ? SHIFT_OPTIONS.find(o => o.value === d.shift_type) : null;
          const wrkOpt = d?.workout_type && d.workout_type !== 'aucun' ? WORKOUT_OPTIONS.find(o => o.value === d.workout_type) : null;
          const shiftColor = shiftOpt ? SHIFT_COLORS[shiftOpt.value] : null;
          const wrkColor = wrkOpt ? WORKOUT_COLORS[wrkOpt.value] : null;
          return (
            <div
              key={dateStr}
              className="p-2 flex flex-col gap-1.5 cursor-pointer transition-colors hover:bg-white/5"
              style={{
                borderRight: i < 6 ? '1px solid #1f1f2e' : 'none',
                backgroundColor: isSelected ? '#13132066' : 'transparent',
              }}
              onClick={() => onSelectDay(isSelected ? null : dateStr)}
            >
              {shiftOpt ? (
                <div
                  className="rounded-lg px-2 py-1.5 text-[11px] font-semibold leading-tight"
                  style={{ backgroundColor: `${shiftColor}20`, border: `1px solid ${shiftColor}45`, color: shiftColor }}
                >
                  <div className="text-base mb-0.5">{shiftOpt.icon}</div>
                  <div>{shiftOpt.label}</div>
                </div>
              ) : (
                <div
                  className="rounded-lg px-2 py-1.5 text-[11px] text-zinc-700 border border-dashed border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors"
                >
                  + Ajouter
                </div>
              )}
              {wrkOpt && (
                <div
                  className="rounded-lg px-2 py-1.5 text-[11px] font-semibold"
                  style={{ backgroundColor: `${wrkColor}20`, border: `1px solid ${wrkColor}45`, color: wrkColor }}
                >
                  {wrkOpt.icon} {wrkOpt.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const SmartPlanningPage = () => {
  useAuth();
  const now = new Date();
  const today = toDateStr(now);

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());         // 0-indexed
  const [weekStart, setWeekStart] = useState(getMondayOfWeek(today));
  const [planning, setPlanning] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingDate, setEditingDate] = useState(null); // date being edited from history
  const [notifGranted, setNotifGranted] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null); // 'left' or 'right'
  const [animKey, setAnimKey] = useState(Date.now());
  const [expandedSleepTips, setExpandedSleepTips] = useState({}); // { shift_type: boolean }

  // Interactive Drag States
  const [touchOffsetX, setTouchOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);
  const touchStartX = useRef(null);

  const weekDays = getWeekDays(weekStart);
  const filledDays = Object.values(planning).filter(v => v?.shift_type).length;

  // When month changes, update week to contain the 1st visible day in new month
  const goMonth = (delta) => {
    let nextMonth = month + delta;
    let nextYear = year;
    if (nextMonth > 11) { nextMonth = 0; nextYear++; }
    if (nextMonth < 0) { nextMonth = 11; nextYear--; }
    setYear(nextYear);
    setMonth(nextMonth);
    setWeekStart(getMondayOfWeek(`${nextYear}-${pad(nextMonth + 1)}-01`));
    setSelectedDay(null);
  };

  const getAdjMonth = (y, m, delta) => {
    let nm = m + delta, ny = y;
    if (nm > 11) { nm = 0; ny++; }
    if (nm < 0) { nm = 11; ny--; }
    return { year: ny, month: nm };
  };

  const shiftWeek = (dir) => {
    const d = new Date(weekStart + 'T12:00:00');
    d.setDate(d.getDate() + dir * 7);
    const ns = toDateStr(d);
    setWeekStart(ns);
    // Sync month display to first day of this week
    const wd = new Date(ns + 'T12:00:00');
    setYear(wd.getFullYear()); setMonth(wd.getMonth());
    setSelectedDay(null);
  };

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // 1. Fetch from server (True source)
        const resp = await axios.get(`${API}/planning/weekly`, { withCredentials: true });
        const map = {};
        if (Array.isArray(resp.data)) {
          resp.data.forEach(d => {
            map[d.date] = {
              shift_type: d.shift_type,
              workout_type: d.workout_type || 'aucun',
              notes: d.notes
            };
          });
        }

        // 2. Sync local storage with server data
        localStorage.setItem(WEEK_STORAGE_KEY, JSON.stringify(map));
        setPlanning(map);

      } catch (err) {
        console.error("Failed to load planning from server, using local fallback", err);
        // 3. Fallback to local storage if offline
        const local = localStorage.getItem(WEEK_STORAGE_KEY);
        if (local) {
          try { setPlanning(JSON.parse(local)); } catch { }
        }
      } finally {
        setLoading(false);
      }
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') setNotifGranted(true);
    };
    load();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = useCallback((field, val) => {
    if (!selectedDay) return;
    setPlanning(prev => ({ ...prev, [selectedDay]: { ...(prev[selectedDay] || {}), [field]: val } }));
  }, [selectedDay]);

  const deletePlanningDay = useCallback(async (dateStr) => {
    if (!dateStr) return;

    // Optimistic update
    setPlanning(prev => {
      const n = { ...prev };
      delete n[dateStr];
      // Update local storage immediately
      localStorage.setItem(WEEK_STORAGE_KEY, JSON.stringify(n));
      return n;
    });

    try {
      await axios.delete(`${API}/planning/weekly/${dateStr}`, { withCredentials: true });
    } catch (err) {
      console.error("Delete failed on server", err);
      toast.error("Échec de la suppression sur le serveur");
    }
  }, []);

  const handleDelete = useCallback(() => {
    if (!selectedDay) return;
    deletePlanningDay(selectedDay);
    setSelectedDay(null);
    setEditingDate(null);
  }, [selectedDay, deletePlanningDay]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const days = Object.entries(planning).filter(([, v]) => v?.shift_type).map(([date, v]) => ({ date, shift_type: v.shift_type, workout_type: v.workout_type || 'aucun', notes: v.notes || null }));
      await axios.post(`${API}/planning/weekly`, days, { withCredentials: true });
      localStorage.setItem(WEEK_STORAGE_KEY, JSON.stringify(planning));
      localStorage.setItem(REMINDER_STORAGE_KEY, Date.now().toString());
      toast.success(`✅ Planning sauvegardé (${days.length} jour${days.length > 1 ? 's' : ''}) !`);
    } catch { toast.error('Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  const goToday = () => {
    setYear(now.getFullYear()); setMonth(now.getMonth());
    setWeekStart(getMondayOfWeek(today));
    setSelectedDay(today);
  };

  // ── Drag Logic ──────────────────────────────────────────────────────────────
  const handleDragStart = (e) => {
    if (isAnimating) return;
    const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    touchStartX.current = x;
    setIsDragging(true);
    setSlideDirection(null);
  };
  const handleDragMove = (e) => {
    if (touchStartX.current === null || isAnimating) return;
    const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    setTouchOffsetX(x - touchStartX.current);
  };
  const handleDragEnd = (e) => {
    if (touchStartX.current === null || isAnimating) return;
    const threshold = 60;
    const width = e.currentTarget.offsetWidth / 3; // Correct width of ONE month

    if (touchOffsetX < -threshold) {
      // Snap to Next
      setIsAnimating(true);
      setIsDragging(false);
      setTouchOffsetX(-width);
      setTimeout(() => {
        setSkipTransition(true);
        goMonth(1);
        setTouchOffsetX(0);
        setTimeout(() => {
          setSkipTransition(false);
          setIsAnimating(false);
        }, 50); // Small buffer to ensure browser processed the swap
      }, 400);
    } else if (touchOffsetX > threshold) {
      // Snap to Prev
      setIsAnimating(true);
      setIsDragging(false);
      setTouchOffsetX(width);
      setTimeout(() => {
        setSkipTransition(true);
        goMonth(-1);
        setTouchOffsetX(0);
        setTimeout(() => {
          setSkipTransition(false);
          setIsAnimating(false);
        }, 50);
      }, 400);
    } else {
      // Snap back
      setIsDragging(false);
      setTouchOffsetX(0);
    }
    touchStartX.current = null;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 max-w-5xl mx-auto">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ background: 'linear-gradient(90deg, #B0E301, #6441a5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Planning
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Planifie tes postes · FitQuest adapte tes repas</p>
        </div>
      </div>

      {/* ── Calendar header (month nav) ──────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button onClick={() => goMonth(-1)} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-400 hover:text-white transition-colors" style={{ backgroundColor: '#131320', border: '1px solid #1f1f2e' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={goToday} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-colors" style={{ backgroundColor: '#131320', border: '1px solid #1f1f2e' }}>
          Aujourd'hui
        </button>
        <button onClick={() => goMonth(1)} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-400 hover:text-white transition-colors" style={{ backgroundColor: '#131320', border: '1px solid #1f1f2e' }}>
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-lg font-bold capitalize" style={{ color: '#E4E4E7' }}>
          {FR_MONTHS[month]} {year}
        </span>
        <span className="ml-auto text-xs text-zinc-600">{filledDays}/7+ jours planifiés</span>
      </div>

      {
        loading ? (
          <div className="h-64 rounded-2xl animate-pulse" style={{ backgroundColor: '#0d0d14' }} />
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1f1f2e', backgroundColor: '#0d0d14' }}>
            <div
              style={{
                display: 'flex',
                width: '300%',
                transform: `translateX(calc(-33.333% + ${touchOffsetX}px))`,
                transition: (isDragging || skipTransition) ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
                touchAction: 'pan-y',
                cursor: isDragging ? 'grabbing' : 'auto'
              }}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              {/* Previous Month */}
              <div style={{ width: '33.333%' }} className="pointer-events-none opacity-40">
                <MonthView
                  {...getAdjMonth(year, month, -1)}
                  planning={planning}
                  today={today}
                  selectedDay={selectedDay}
                  onSelectDay={() => { }}
                  onGoMonth={() => { }}
                />
              </div>

              {/* Current Month */}
              <div style={{ width: '33.333%' }}>
                <MonthView
                  year={year}
                  month={month}
                  planning={planning}
                  today={today}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  onGoMonth={goMonth}
                />
              </div>

              {/* Next Month */}
              <div style={{ width: '33.333%' }} className="pointer-events-none opacity-40">
                <MonthView
                  {...getAdjMonth(year, month, 1)}
                  planning={planning}
                  today={today}
                  selectedDay={selectedDay}
                  onSelectDay={() => { }}
                  onGoMonth={() => { }}
                />
              </div>
            </div>
          </div>
        )
      }

      {/* ── Day Editor (Universal for New & Existing Days) ───────────────────── */}
      {
        selectedDay && (
          <DayEditor
            dateStr={selectedDay}
            data={planning[selectedDay] || {}}
            onChange={handleChange}
            onDelete={handleDelete}
            onClose={() => { setSelectedDay(null); setEditingDate(null); }}
            onReset={() => { deletePlanningDay(selectedDay); setSelectedDay(null); }}
            onSave={handleSave}
          />
        )
      }

      {/* ── History List ────────────────────────────────────────────────────── */}
      {
        filledDays > 0 && !selectedDay && (

          /* Default → show history list */
          (() => {
            const seenShiftTypes = new Set();
            const entries = Object.entries(planning)
              .filter(([, v]) => v?.shift_type)
              .sort(([a], [b]) => a.localeCompare(b));

            return (
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#0d0d14', border: '1px solid #1f1f2e' }}>
                <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ borderColor: '#1f1f2e' }}>
                  <CheckCircle className="w-3.5 h-3.5 text-[#B0E301]" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Historique — {filledDays} jour{filledDays > 1 ? 's' : ''} planifié{filledDays > 1 ? 's' : ''}
                  </span>
                </div>
                <div>
                  {entries.map(([date, v]) => {
                    const shiftOpt = SHIFT_OPTIONS.find(o => o.value === v.shift_type);
                    const workoutOpt = v.workout_type && v.workout_type !== 'aucun' ? WORKOUT_OPTIONS.find(o => o.value === v.workout_type) : null;
                    const shiftColor = SHIFT_COLORS[v.shift_type];
                    const sleep = SLEEP_TIPS[v.shift_type];
                    const isToday = date === today;
                    const isOpen = selectedDay === date;
                    const showSleep = sleep && !seenShiftTypes.has(v.shift_type);
                    if (sleep) seenShiftTypes.add(v.shift_type);

                    const dateLabel = new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });

                    return (
                      <div key={date} className="border-b last:border-b-0" style={{ borderColor: '#1a1a2a' }}>
                        {/* Row */}
                        <div
                          className="px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                          onClick={() => setSelectedDay(isOpen ? null : date)}
                          style={{ backgroundColor: isToday ? '#B0E30106' : isOpen ? '#1a1a2a' : 'transparent' }}
                        >
                          <span className="text-xs capitalize min-w-[110px]" style={{ color: isToday ? '#B0E301' : '#71717A' }}>
                            {isToday && '📍 '}{dateLabel}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${shiftColor}20`, color: shiftColor, border: `1px solid ${shiftColor}40` }}>
                            {shiftOpt?.icon} {shiftOpt?.label}
                          </span>
                          {workoutOpt && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${WORKOUT_COLORS[v.workout_type]}20`, color: WORKOUT_COLORS[v.workout_type], border: `1px solid ${WORKOUT_COLORS[v.workout_type]}40` }}>
                              {workoutOpt.icon} {workoutOpt.label}
                            </span>
                          )}
                          <span className="ml-auto text-zinc-600 text-sm">{isOpen ? '▲' : '▼'}</span>
                        </div>

                        {/* Action volet */}
                        {isOpen && (
                          <div className="px-4 pb-3 pt-1" style={{ backgroundColor: '#0d0d14' }}>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedDay(null)}
                                className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-zinc-400 hover:text-white transition-colors"
                                style={{ border: '1px solid #2a2a36' }}
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => { setEditingDate(date); }}
                                className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                                style={{ backgroundColor: '#B0E30120', color: '#B0E301', border: '1px solid #B0E30140' }}
                              >
                                ✏️ Modifier
                              </button>
                              <button
                                onClick={() => {
                                  deletePlanningDay(date);
                                  setSelectedDay(null);
                                }}
                                className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                                style={{ backgroundColor: '#ff000015', color: '#ef4444', border: '1px solid #ef444430' }}
                              >
                                🗑️ Supprimer
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Sleep tips — once per unique shift type, collapsible */}
                        {showSleep && (
                          <div className="mx-4 mb-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${sleep.color}30` }}>
                            <button
                              onClick={() => setExpandedSleepTips(prev => ({ ...prev, [v.shift_type]: !prev[v.shift_type] }))}
                              className="w-full px-3 py-1.5 flex items-center justify-between transition-colors hover:bg-white/5"
                              style={{ backgroundColor: `${sleep.color}10` }}
                            >
                              <div className="flex items-center gap-2 text-left">
                                <span>{sleep.icon}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: sleep.color }}>
                                  Conseils sommeil — {shiftOpt?.label} · {sleep.duree}
                                </span>
                              </div>
                              <span className="text-zinc-500 text-xs">{expandedSleepTips[v.shift_type] ? '▲' : '▼'}</span>
                            </button>

                            {expandedSleepTips[v.shift_type] && (
                              <div className="px-3 py-2 space-y-1 animate-fade-in" style={{ backgroundColor: '#080810' }}>
                                <div className="flex flex-wrap gap-3 text-[11px] font-semibold mb-1">
                                  <span className="text-zinc-300">🛌 <span style={{ color: sleep.color }}>{sleep.coucher}</span></span>
                                  <span className="text-zinc-500">→</span>
                                  <span className="text-zinc-300">⏰ <span style={{ color: sleep.color }}>{sleep.reveil}</span></span>
                                </div>
                                {sleep.tips.map((tip, i) => (
                                  <p key={i} className="text-[10px] text-zinc-500 leading-relaxed">{tip}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        )
      }



      {/* ── Legend ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-zinc-600">
        {SHIFT_OPTIONS.map(o => (
          <span key={o.value} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SHIFT_COLORS[o.value] }} />
            {o.label}
          </span>
        ))}
      </div>

      {/* ── Mobile FAB ──────────────────────────────────────────────────────── */}
      {
        !selectedDay && (
          <div className="fixed bottom-24 right-4 z-50 md:hidden">
            <button
              onClick={() => setSelectedDay(today)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-transform active:scale-95"
              style={{ backgroundColor: '#6441a5' }}
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        )
      }
    </div >
  );
};

export default SmartPlanningPage;
