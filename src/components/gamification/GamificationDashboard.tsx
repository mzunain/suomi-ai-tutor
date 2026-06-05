'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Trophy, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { DailyChallengePanel } from './DailyChallenge';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserStats {
  xp: number;
  streak: number;
  level: number;
  completedLessons: number;
}

// ─── Leaderboard data ─────────────────────────────────────────────────────────

const LEADERBOARD = [
  { rank: 1, name: 'Aino M.', flag: '🇫🇮', xp: 2840, medal: '🥇', color: 'bg-amber-100 text-amber-800' },
  { rank: 2, name: 'Mohammed A.', flag: '🇸🇴', xp: 2210, medal: '🥈', color: 'bg-gray-100 text-gray-700' },
  { rank: 3, name: 'Irina V.', flag: '🇷🇺', xp: 1980, medal: '🥉', color: 'bg-orange-100 text-orange-700' },
  { rank: 4, name: 'Mehmet K.', flag: '🇹🇷', xp: 1650, medal: null, color: '' },
  { rank: 5, name: 'You', flag: '🌍', xp: 1250, medal: null, color: '', isMe: true },
  { rank: 6, name: 'Li Wei', flag: '🇨🇳', xp: 980, medal: null, color: '' },
  { rank: 7, name: 'Ana S.', flag: '🇪🇸', xp: 840, medal: null, color: '' },
  { rank: 8, name: 'Fatima H.', flag: '🇮🇷', xp: 720, medal: null, color: '' },
  { rank: 9, name: 'Pekka L.', flag: '🇫🇮', xp: 580, medal: null, color: '' },
  { rank: 10, name: 'Jana N.', flag: '🇩🇪', xp: 410, medal: null, color: '' },
] as const;

// Initials + deterministic avatar colour
const AVATAR_COLOURS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500',
  'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-rose-500',
  'bg-cyan-500', 'bg-amber-500',
];

function getInitials(name: string): string {
  return name === 'You' ? 'ME' : name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Achievements data ────────────────────────────────────────────────────────

interface Achievement {
  id: string;
  emoji: string;
  name: string;
  description: string;
  progressValue: (stats: UserStats) => number;
  progressMax: number;
  earnedIf: (stats: UserStats) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    emoji: '🎯',
    name: 'First Steps',
    description: 'Complete your first lesson',
    progressValue: (s) => Math.min(s.completedLessons, 1),
    progressMax: 1,
    earnedIf: (s) => s.completedLessons >= 1,
  },
  {
    id: 'week-warrior',
    emoji: '🔥',
    name: 'Week Warrior',
    description: '7-day streak',
    progressValue: (s) => Math.min(s.streak, 7),
    progressMax: 7,
    earnedIf: (s) => s.streak >= 7,
  },
  {
    id: 'grammar-master',
    emoji: '📚',
    name: 'Grammar Master',
    description: 'Complete 5 grammar lessons',
    progressValue: (s) => Math.min(Math.floor(s.completedLessons / 2), 5),
    progressMax: 5,
    earnedIf: (s) => Math.floor(s.completedLessons / 2) >= 5,
  },
  {
    id: 'word-collector',
    emoji: '💎',
    name: 'Word Collector',
    description: 'Learn 100 words',
    progressValue: (s) => Math.min(Math.floor(s.xp / 10), 100),
    progressMax: 100,
    earnedIf: (s) => s.xp >= 1000,
  },
  {
    id: 'perfect-score',
    emoji: '🌟',
    name: 'Perfect Score',
    description: '100% on any lesson',
    progressValue: () => 0,
    progressMax: 1,
    earnedIf: () => false,
  },
  {
    id: 'pronunciation-pro',
    emoji: '🗣️',
    name: 'Pronunciation Pro',
    description: '90%+ on 5 speaking exercises',
    progressValue: () => 2,
    progressMax: 5,
    earnedIf: () => false,
  },
  {
    id: 'dedicated',
    emoji: '📅',
    name: 'Dedicated',
    description: 'Study 30 days',
    progressValue: (s) => Math.min(s.streak, 30),
    progressMax: 30,
    earnedIf: (s) => s.streak >= 30,
  },
  {
    id: 'turku-explorer',
    emoji: '🏛️',
    name: 'Turku Explorer',
    description: 'Complete Turku dialect lesson',
    progressValue: () => 0,
    progressMax: 1,
    earnedIf: () => false,
  },
  {
    id: 'scholar',
    emoji: '🎓',
    name: 'Scholar',
    description: 'Reach level 10',
    progressValue: (s) => Math.min(s.level, 10),
    progressMax: 10,
    earnedIf: (s) => s.level >= 10,
  },
  {
    id: 'sprinter',
    emoji: '🏃',
    name: 'Sprinter',
    description: 'Complete 3 lessons in one day',
    progressValue: () => 0,
    progressMax: 3,
    earnedIf: () => false,
  },
  {
    id: 'polyglot',
    emoji: '🌍',
    name: 'Polyglot',
    description: 'Try 3 different UI languages',
    progressValue: () => 0,
    progressMax: 3,
    earnedIf: () => false,
  },
  {
    id: 'champion',
    emoji: '🏆',
    name: 'Champion',
    description: 'Reach top 3 in leaderboard',
    progressValue: () => 0,
    progressMax: 1,
    earnedIf: () => false,
  },
];

// ─── Weekly bar chart data ────────────────────────────────────────────────────

const WEEKLY_DATA = [
  { day: 'Mon', xp: 45 },
  { day: 'Tue', xp: 80 },
  { day: 'Wed', xp: 35 },
  { day: 'Thu', xp: 60 },
  { day: 'Fri', xp: 90 },
  { day: 'Sat', xp: 25 },
  { day: 'Sun', xp: 55 },
];

// ─── XP level thresholds ──────────────────────────────────────────────────────

function xpForLevel(level: number) {
  return level * 300;
}

// ─── Time until next Sunday ───────────────────────────────────────────────────

function msUntilNextSunday(): number {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  sunday.setHours(0, 0, 0, 0);
  return sunday.getTime() - now.getTime();
}

function formatCountdown(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  return `${days}d ${hours}h`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-4 flex items-center gap-3 shadow-sm`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  );
}

function StreakHeatmap({ streak }: { streak: number }) {
  const today = new Date();
  const cells = Array.from({ length: 28 }, (_, i) => {
    const daysAgo = 27 - i;
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    const active = daysAgo < streak;
    return { date, active, daysAgo };
  });

  const weeks: typeof cells[] = [];
  for (let w = 0; w < 4; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7));
  }

  return (
    <div>
      <div className="flex gap-0.5 mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="flex-1 text-center text-xs text-gray-400">{d}</div>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex gap-0.5">
            {week.map((cell, di) => (
              <motion.div
                key={di}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (wi * 7 + di) * 0.01 }}
                className={`flex-1 h-6 rounded-sm ${
                  cell.active ? 'bg-orange-400' : 'bg-gray-100'
                }`}
                title={cell.date.toDateString()}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyBarChart() {
  const maxXp = Math.max(...WEEKLY_DATA.map((d) => d.xp));
  return (
    <div className="flex items-end gap-1.5 h-28">
      {WEEKLY_DATA.map((item, i) => (
        <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500">{item.xp}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.xp / maxXp) * 80}px` }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: 'easeOut' }}
            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg min-h-[4px]"
          />
          <span className="text-xs text-gray-500">{item.day}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = ['My Progress', 'Leaderboard', 'Achievements'] as const;
type Tab = typeof TABS[number];
const DEFAULT_STATS: UserStats = {
  xp: 1250,
  streak: 7,
  level: 5,
  completedLessons: 15,
};

function getInitialStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;

  try {
    const raw = localStorage.getItem('suomi-ai-tutor-data');
    if (!raw) return DEFAULT_STATS;

    const parsed = JSON.parse(raw);
    const user = parsed?.data?.user ?? parsed?.user;
    const progress = parsed?.data?.progress ?? parsed?.progress;
    if (!user) return DEFAULT_STATS;

    return {
      xp: user.xp ?? 1250,
      streak: user.streak ?? 7,
      level: user.level ?? 5,
      completedLessons: progress?.completedLessons?.length ?? 15,
    };
  } catch {
    return DEFAULT_STATS;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GamificationDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('My Progress');
  const [stats] = useState<UserStats>(getInitialStats);
  const [countdown, setCountdown] = useState(msUntilNextSunday());

  // Countdown ticker
  useEffect(() => {
    const id = setInterval(() => setCountdown(msUntilNextSunday()), 60_000);
    return () => clearInterval(id);
  }, []);

  const xpInCurrentLevel = stats.xp % 300;
  const xpNeededForNextLevel = xpForLevel(1); // 300 per level
  const xpPercent = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Tab bar */}
      <div className="relative flex bg-gray-100 rounded-xl p-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-2 text-sm font-medium rounded-lg transition-colors z-10 ${
              activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'My Progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatCard
                icon={<Zap className="w-6 h-6 text-yellow-500" />}
                value={stats.xp.toLocaleString()}
                label="Total XP ⚡"
                bg="bg-yellow-50"
              />
              <StatCard
                icon={<Flame className="w-6 h-6 text-orange-500" />}
                value={stats.streak}
                label="Day Streak 🔥"
                bg="bg-orange-50"
              />
              <StatCard
                icon={<Trophy className="w-6 h-6 text-blue-500" />}
                value={stats.level}
                label="Level 🏆"
                bg="bg-blue-50"
              />
              <StatCard
                icon={<BookOpen className="w-6 h-6 text-purple-500" />}
                value={stats.completedLessons}
                label="Lessons Done 📚"
                bg="bg-purple-50"
              />
            </div>

            {/* XP progress bar */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-gray-900">Level {stats.level}</h2>
                <span className="text-sm text-gray-500">
                  {xpInCurrentLevel} / {xpNeededForNextLevel} XP
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                {xpNeededForNextLevel - xpInCurrentLevel} XP until Level {stats.level + 1}
              </p>
            </div>

            {/* Streak heatmap */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <h2 className="font-bold text-gray-900">Study Streak — last 28 days</h2>
              </div>
              <StreakHeatmap streak={stats.streak} />
            </div>

            {/* Weekly chart */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <h2 className="font-bold text-gray-900">Weekly Activity</h2>
              </div>
              <WeeklyBarChart />
            </div>

            {/* Daily challenges */}
            <DailyChallengePanel />
          </motion.div>
        )}

        {activeTab === 'Leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">This Week</h2>
                <p className="text-xs text-gray-500">Resets in {formatCountdown(countdown)}</p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full">
                Live ranking
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {LEADERBOARD.map((entry, i) => {
                const isMe = 'isMe' in entry && entry.isMe;
                const avatarBg = AVATAR_COLOURS[i % AVATAR_COLOURS.length];

                return (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0 ${
                      isMe ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {entry.medal ? (
                        <span className="text-xl">{entry.medal}</span>
                      ) : (
                        <span className={`text-sm font-bold ${isMe ? 'text-blue-600' : 'text-gray-400'}`}>
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white ${avatarBg}`}
                    >
                      {getInitials(entry.name)}
                    </div>

                    {/* Name + flag */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isMe ? 'text-blue-700' : 'text-gray-900'}`}>
                        {entry.flag} {entry.name}
                        {isMe && <span className="ml-1 text-xs font-normal text-blue-400">(you)</span>}
                      </p>
                    </div>

                    {/* XP */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${isMe ? 'text-blue-600' : 'text-gray-700'}`}>
                        {entry.xp.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">XP</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'Achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-gray-500 mb-4">
              Earn badges by hitting milestones in your Finnish journey.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {ACHIEVEMENTS.map((ach, i) => {
                const earned = ach.earnedIf(stats);
                const progress = ach.progressValue(stats);
                const pct = Math.min((progress / ach.progressMax) * 100, 100);

                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.04 }}
                    className={`relative rounded-2xl p-3 flex flex-col items-center text-center transition-all ${
                      earned
                        ? 'bg-amber-50 ring-2 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                        : 'bg-white shadow-sm'
                    }`}
                  >
                    <span className={`text-3xl mb-1.5 ${!earned ? 'grayscale opacity-60' : ''}`}>
                      {ach.emoji}
                    </span>
                    <p className={`text-xs font-bold leading-tight mb-0.5 ${earned ? 'text-amber-800' : 'text-gray-800'}`}>
                      {ach.name}
                    </p>
                    <p className="text-[10px] text-gray-500 leading-tight mb-2">{ach.description}</p>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, delay: i * 0.04 }}
                        className={`h-full rounded-full ${earned ? 'bg-amber-400' : 'bg-blue-400'}`}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {earned ? '✓ Earned' : `${progress}/${ach.progressMax}`}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GamificationDashboard;
