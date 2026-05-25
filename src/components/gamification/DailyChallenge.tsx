'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Clock, Zap } from 'lucide-react';
import { getDailyChallenges, DailyChallenge } from '@/data/challenges';

interface ChallengeProgress {
  id: string;
  current: number;
  completed: boolean;
}

const STORAGE_KEY = 'suomi-daily-challenges';

interface StoredProgress {
  date: string;
  progress: ChallengeProgress[];
}

export function DailyChallengePanel() {
  const today = new Date().toISOString().split('T')[0];
  const challenges = getDailyChallenges(today);
  const [progress, setProgress] = useState<ChallengeProgress[]>(() =>
    challenges.map((c) => ({ id: c.id, current: 0, completed: false }))
  );

  useEffect(() => {
    try {
      const stored: StoredProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
      if (stored.date === today && stored.progress) {
        setProgress(stored.progress);
      }
    } catch {
      // ignore
    }
  }, [today]);

  function saveProgress(next: ChallengeProgress[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, progress: next }));
    setProgress(next);
  }

  function handleIncrement(challengeId: string, requirement: number) {
    const next = progress.map((p) => {
      if (p.id !== challengeId) return p;
      const current = Math.min(p.current + 1, requirement);
      return { ...p, current, completed: current >= requirement };
    });
    saveProgress(next);
  }

  const totalXpAvailable = challenges.reduce((acc, c) => acc + c.xpReward + c.bonusXp, 0);
  const earnedXp = challenges.reduce((acc, c) => {
    const p = progress.find((x) => x.id === c.id);
    return acc + (p?.completed ? c.xpReward + c.bonusXp : 0);
  }, 0);
  const completedCount = progress.filter((p) => p.completed).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Daily Challenges
        </h2>
        <div className="flex items-center gap-1 text-sm text-yellow-600 font-medium">
          <Zap className="w-4 h-4" />
          <span>{earnedXp}/{totalXpAvailable} XP</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4">Resets at midnight · {completedCount}/{challenges.length} done</p>

      <div className="space-y-3">
        {challenges.map((challenge, i) => {
          const p = progress.find((x) => x.id === challenge.id) ?? { id: challenge.id, current: 0, completed: false };
          return (
            <ChallengeRow
              key={challenge.id}
              challenge={challenge}
              progress={p}
              index={i}
              onIncrement={() => handleIncrement(challenge.id, challenge.requirement)}
            />
          );
        })}
      </div>
    </Card>
  );
}

function ChallengeRow({
  challenge,
  progress,
  index,
  onIncrement,
}: {
  challenge: DailyChallenge;
  progress: ChallengeProgress;
  index: number;
  onIncrement: () => void;
}) {
  const pct = Math.min((progress.current / challenge.requirement) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
        progress.completed
          ? 'border-green-200 bg-green-50'
          : 'border-gray-100 bg-gray-50'
      }`}
    >
      <span className="text-2xl">{challenge.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm font-medium ${progress.completed ? 'text-green-700' : 'text-gray-800'}`}>
            {challenge.title}
          </p>
          <span className="text-xs text-yellow-600 font-medium whitespace-nowrap ml-2">
            +{challenge.xpReward + challenge.bonusXp} XP
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate">{challenge.description}</p>
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${progress.completed ? 'bg-green-500' : 'bg-blue-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {progress.current}/{challenge.requirement}
        </p>
      </div>
      {progress.completed ? (
        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
      ) : (
        <button
          onClick={onIncrement}
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-lg transition-colors flex-shrink-0"
        >
          +1
        </button>
      )}
    </motion.div>
  );
}
