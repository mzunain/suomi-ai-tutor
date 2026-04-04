'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Flame, Star, Target, Trophy, Zap, Calendar, TrendingUp } from 'lucide-react';

interface UserStats {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  totalLessons: number;
  perfectLessons: number;
  wordsLearned: number;
}

const sampleStats: UserStats = {
  xp: 1250,
  level: 5,
  streak: 7,
  longestStreak: 12,
  totalLessons: 15,
  perfectLessons: 8,
  wordsLearned: 127,
};

const badges = [
  { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earned: true },
  { id: '2', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', earned: true },
  { id: '3', name: 'Pronunciation Pro', description: 'Get 90%+ on 5 speaking exercises', icon: '🎤', earned: false },
  { id: '4', name: 'Grammar Master', description: 'Complete 5 grammar lessons', icon: '📚', earned: true },
  { id: '5', name: 'Word Collector', description: 'Learn 100 words', icon: '💎', earned: true },
  { id: '6', name: 'Perfect Score', description: 'Complete a lesson with 100% accuracy', icon: '⭐', earned: false },
  { id: '7', name: 'Dedicated Learner', description: 'Study for 30 days', icon: '📅', earned: false },
  { id: '8', name: 'Turku Explorer', description: 'Complete a lesson in Turku dialect', icon: '🏛️', earned: false },
];

export function GamificationDashboard() {
  const [stats] = useState(sampleStats);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Zap className="w-6 h-6 text-yellow-500" />}
          value={stats.xp}
          label="Total XP"
          color="bg-yellow-50"
        />
        <StatCard
          icon={<Flame className="w-6 h-6 text-orange-500" />}
          value={stats.streak}
          label="Day Streak"
          color="bg-orange-50"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6 text-blue-500" />}
          value={stats.level}
          label="Level"
          color="bg-blue-50"
        />
        <StatCard
          icon={<Star className="w-6 h-6 text-purple-500" />}
          value={stats.wordsLearned}
          label="Words"
          color="bg-purple-50"
        />
      </div>

      {/* Streak Calendar */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Study Streak
          </h2>
          <span className="text-sm text-gray-600">{stats.streak} days</span>
        </div>
        <StreakCalendar streak={stats.streak} />
      </Card>

      {/* XP Progress */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Level {stats.level}</h2>
          <span className="text-sm text-gray-600">{stats.xp} / 1500 XP</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${(stats.xp / 1500) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {1500 - stats.xp} XP until Level {stats.level + 1}
        </p>
      </Card>

      {/* Badges */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      {/* Weekly Activity */}
      <Card className="mt-8 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Weekly Activity
        </h2>
        <WeeklyActivityChart />
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <Card className={`${color} p-4`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function StreakCalendar({ streak }: { streak: number }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeks = 4;

  return (
    <div className="flex gap-1">
      {Array.from({ length: weeks * 7 }).map((_, i) => {
        const dayIndex = i % 7;
        const isActive = i < streak;
        return (
          <motion.div
            key={i}
            initial={isActive ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
              isActive
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
            title={days[dayIndex]}
          >
            {isActive && <Flame className="w-4 h-4" />}
          </motion.div>
        );
      })}
    </div>
  );
}

function BadgeCard({ badge }: { badge: typeof badges[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-xl border-2 text-center ${
        badge.earned
          ? 'border-yellow-400 bg-yellow-50'
          : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      <div className="text-3xl mb-2">{badge.icon}</div>
      <p className="font-medium text-gray-900 text-sm">{badge.name}</p>
      <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
    </motion.div>
  );
}

function WeeklyActivityChart() {
  const data = [
    { day: 'Mon', xp: 45 },
    { day: 'Tue', xp: 80 },
    { day: 'Wed', xp: 35 },
    { day: 'Thu', xp: 60 },
    { day: 'Fri', xp: 90 },
    { day: 'Sat', xp: 25 },
    { day: 'Sun', xp: 55 },
  ];

  const maxXp = Math.max(...data.map(d => d.xp));

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((item, i) => (
        <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.xp / maxXp) * 100}%` }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="w-full bg-blue-500 rounded-t-lg min-h-[4px]"
          />
          <span className="text-xs text-gray-600">{item.day}</span>
        </div>
      ))}
    </div>
  );
}
