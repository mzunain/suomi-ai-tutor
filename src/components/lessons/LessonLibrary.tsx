'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { sampleLessons } from '@/data/lessons';
import { LessonPlayer } from '@/components/lessons/LessonPlayer';
import { Lesson, DifficultyLevel } from '@/types';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Lock,
  Star,
  Search,
  LayoutGrid,
  GitBranch,
  Zap,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'suomi-ai-tutor-data';
const TOTAL_LESSONS = 53; // total in curriculum

// Seeded random for word of the day
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getWordOfTheDay(lessons: Lesson[]): { finnish: string; english: string; category: string } | null {
  if (!lessons.length) return null;
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const allExercises = lessons.flatMap((l) => l.exercises);
  const idx = Math.floor(seededRandom(seed) * allExercises.length);
  const ex = allExercises[idx];
  if (!ex) return null;
  const parentLesson = lessons.find((l) => l.id === ex.lessonId);
  return {
    finnish: ex.finnishText,
    english: ex.englishText,
    category: parentLesson?.category ?? 'vocabulary',
  };
}

function hasDialectContent(lesson: Lesson): boolean {
  return !!(lesson.contentTurku || lesson.contentHelsinki);
}

function getTotalXP(lesson: Lesson): number {
  return lesson.exercises.reduce((sum, ex) => sum + (ex.xpReward ?? 10), 0);
}

function getEstimatedMinutes(lesson: Lesson): number {
  return Math.max(1, Math.ceil(lesson.exercises.length * 0.6));
}

const CATEGORY_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  grammar:    { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  vocabulary: { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  culture:    { bg: 'bg-pink-100',   text: 'text-pink-700',   dot: 'bg-pink-500'   },
  workplace:  { bg: 'bg-teal-100',   text: 'text-teal-700',   dot: 'bg-teal-500'   },
  daily:      { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500'  },
};

const CATEGORY_ICON: Record<string, string> = {
  grammar:    '📚',
  vocabulary: '📝',
  culture:    '🎭',
  workplace:  '💼',
  daily:      '🏠',
};

const DIFFICULTY_ORDER: DifficultyLevel[] = ['A1', 'A2', 'B1', 'B2'];

function isLessonLocked(lesson: Lesson, completedLessons: string[]): boolean {
  // A lesson is locked if there is any lesson with a lower order number that is not completed
  const prerequisite = sampleLessons.find(
    (l) => l.difficulty === lesson.difficulty && l.order < lesson.order
  );
  if (!prerequisite) return false;
  return !completedLessons.includes(prerequisite.id);
}

// ─── Word of the Day ───────────────────────────────────────────────────────────

function WordOfTheDay({ lessons }: { lessons: Lesson[] }) {
  const word = useMemo(() => getWordOfTheDay(lessons), [lessons]);
  const [revealed, setRevealed] = useState(false);

  if (!word) return null;
  const color = CATEGORY_COLOR[word.category] ?? CATEGORY_COLOR.vocabulary;

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 flex items-center gap-4">
      <div className="text-3xl">✨</div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-0.5">Word of the Day</p>
        <p className="text-xl font-bold text-gray-900">{word.finnish}</p>
        <button
          onClick={() => setRevealed((r: boolean) => !r)}
          className="text-sm text-amber-600 hover:text-amber-800 mt-0.5 transition-colors"
        >
          {revealed ? word.english : 'Tap to reveal'}
        </button>
      </div>
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text}`}>
        {CATEGORY_ICON[word.category]} {word.category}
      </span>
    </div>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({ completedLessons }: { completedLessons: string[] }) {
  const completed = completedLessons.length;
  const percent = Math.round((completed / TOTAL_LESSONS) * 100);

  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-700">
            {completed} / {TOTAL_LESSONS} lessons
          </span>
          <span className="text-sm font-bold text-blue-600">{percent}% complete</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #1a56db, #10b981)' }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Level Tabs ────────────────────────────────────────────────────────────────

function LevelTabs({
  activeLevel,
  setActiveLevel,
  lessonCounts,
}: {
  activeLevel: DifficultyLevel | 'all';
  setActiveLevel: (l: DifficultyLevel | 'all') => void;
  lessonCounts: Record<DifficultyLevel | 'all', number>;
}) {
  const tabs: (DifficultyLevel | 'all')[] = ['all', ...DIFFICULTY_ORDER];

  const TAB_COLORS: Record<DifficultyLevel | 'all', string> = {
    all: 'bg-slate-700 text-white',
    A1:  'bg-green-500 text-white',
    A2:  'bg-blue-500 text-white',
    B1:  'bg-purple-500 text-white',
    B2:  'bg-rose-500 text-white',
  };

  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((level) => (
        <button
          key={level}
          onClick={() => setActiveLevel(level)}
          className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeLevel === level
              ? TAB_COLORS[level]
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {level === 'all' ? 'All Levels' : `${level} Level`}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeLevel === level ? 'bg-white/20' : 'bg-gray-300/60'}`}>
            {lessonCounts[level]}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Lesson Card (Grid view) ────────────────────────────────────────────────────

function LessonCard({
  lesson,
  isCompleted,
  isLocked,
  onClick,
}: {
  lesson: Lesson;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
}) {
  const color = CATEGORY_COLOR[lesson.category] ?? CATEGORY_COLOR.vocabulary;
  const totalXP = getTotalXP(lesson);
  const mins = getEstimatedMinutes(lesson);
  const hasDialect = hasDialectContent(lesson);

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
    >
      <div
        onClick={() => !isLocked && onClick()}
        className={`rounded-2xl border bg-white p-4 transition-all ${
          isLocked
            ? 'opacity-55 cursor-not-allowed border-gray-200'
            : isCompleted
            ? 'cursor-pointer border-green-200 shadow-sm hover:shadow-md'
            : 'cursor-pointer border-gray-200 hover:border-blue-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
              isCompleted ? 'bg-green-100' : color.bg
            }`}
          >
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : isLocked ? (
              <Lock className="w-5 h-5 text-gray-400" />
            ) : (
              CATEGORY_ICON[lesson.category] ?? '📖'
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Tags row */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${color.bg} ${color.text}`}>
                {lesson.category}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                {lesson.difficulty}
              </span>
              {hasDialect && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600" title="Has dialect content">
                  🗺️ Dialect
                </span>
              )}
              {isCompleted && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                  Done
                </span>
              )}
            </div>

            <h3 className="font-bold text-gray-900 text-sm leading-snug mb-0.5">{lesson.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{lesson.description}</p>

            {lesson.culturalNote && !isLocked && (
              <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                <span>💡</span>
                <span>Cultural context</span>
              </div>
            )}

            {isLocked && (
              <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Complete previous lesson to unlock
              </p>
            )}
          </div>

          {/* Right meta */}
          {!isLocked && (
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                <Zap className="w-3.5 h-3.5" />
                <span>{totalXP} XP</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lesson.exercises.length}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>~{mins}m</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Path View ─────────────────────────────────────────────────────────────────

function PathView({
  lessons,
  completedLessons,
  onSelectLesson,
}: {
  lessons: Lesson[];
  completedLessons: string[];
  onSelectLesson: (lesson: Lesson) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-0 py-4">
      {lessons.map((lesson, idx) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const locked = isLessonLocked(lesson, completedLessons);
        const isCurrent = !isCompleted && !locked;

        const side = idx % 2 === 0 ? 'center' : 'center';
        const offsetClass = idx % 4 < 2 ? 'ml-0' : 'ml-16';

        return (
          <div key={lesson.id} className={`flex flex-col items-center ${offsetClass}`}>
            {/* Connector line */}
            {idx > 0 && (
              <div
                className={`w-0.5 h-8 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`}
              />
            )}

            {/* Node */}
            <motion.button
              whileHover={!locked ? { scale: 1.08 } : {}}
              whileTap={!locked ? { scale: 0.95 } : {}}
              onClick={() => !locked && onSelectLesson(lesson)}
              disabled={locked}
              className={`relative flex flex-col items-center group`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4 shadow-md transition-all ${
                  isCompleted
                    ? 'bg-green-500 border-green-400 text-white'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-400 text-white ring-4 ring-blue-200'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                } ${isCurrent ? 'animate-pulse' : ''}`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-7 h-7" />
                ) : locked ? (
                  <Lock className="w-6 h-6" />
                ) : (
                  <Star className="w-7 h-7" />
                )}
              </div>

              {/* Label */}
              <div
                className={`mt-2 text-center max-w-[120px] ${
                  locked ? 'opacity-50' : ''
                }`}
              >
                <p className={`text-xs font-bold leading-tight ${isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-500'}`}>
                  {lesson.title}
                </p>
                <p className="text-xs text-gray-400">{lesson.difficulty}</p>
              </div>
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function LessonLibrary() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'path'>('grid');

  // Load completed lessons from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const completed: string[] = parsed?.progress?.completedLessons ?? [];
        setCompletedLessons(completed);
      }
    } catch {
      // silently ignore
    }
  }, []);

  const handleLessonComplete = (lessonId: string, results: { score: number; xp: number; timeSpent: number }) => {
    setCompletedLessons((prev: string[]) => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      // Persist to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : {};
        parsed.progress = parsed.progress ?? {};
        parsed.progress.completedLessons = next;
        parsed.progress.totalXp = (parsed.progress.totalXp ?? 0) + results.xp;
        parsed.user = parsed.user ?? {};
        parsed.user.xp = (parsed.user.xp ?? 0) + results.xp;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch {}
      return next;
    });
    setSelectedLesson(null);
  };

  // Lesson counts per level
  const lessonCounts = useMemo(() => {
    const counts: Record<DifficultyLevel | 'all', number> = { all: sampleLessons.length, A1: 0, A2: 0, B1: 0, B2: 0 };
    for (const l of sampleLessons) counts[l.difficulty] = (counts[l.difficulty] ?? 0) + 1;
    return counts;
  }, []);

  // Filtered & searched lessons
  const filteredLessons = useMemo(() => {
    let result = sampleLessons;
    if (activeLevel !== 'all') {
      result = result.filter((l) => l.difficulty === activeLevel);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.description ?? '').toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeLevel, searchQuery]);

  // If a lesson is selected, show the player
  if (selectedLesson) {
    return (
      <LessonPlayer
        lesson={selectedLesson}
        onComplete={(results) => handleLessonComplete(selectedLesson.id, results)}
        onExit={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Learn Finnish</h1>
        <p className="text-gray-500 text-sm">
          Choose a lesson to start learning. Each lesson includes vocabulary, grammar, and pronunciation practice.
        </p>
      </div>

      {/* Word of the Day */}
      <WordOfTheDay lessons={sampleLessons} />

      {/* Stats bar */}
      <StatsBar completedLessons={completedLessons} />

      {/* Controls row: level tabs + search + view toggle */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search lessons..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 transition-colors ${
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('path')}
            className={`p-2.5 transition-colors ${
              viewMode === 'path' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
            title="Path view"
          >
            <GitBranch className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level tabs */}
      <LevelTabs
        activeLevel={activeLevel}
        setActiveLevel={setActiveLevel}
        lessonCounts={lessonCounts}
      />

      {/* No results */}
      <AnimatePresence mode="wait">
        {filteredLessons.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-gray-400"
          >
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No lessons found</p>
            <p className="text-sm mt-1">Try a different search or level filter</p>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isCompleted={completedLessons.includes(lesson.id)}
                isLocked={isLessonLocked(lesson, completedLessons)}
                onClick={() => setSelectedLesson(lesson)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="path"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PathView
              lessons={filteredLessons}
              completedLessons={completedLessons}
              onSelectLesson={setSelectedLesson}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
