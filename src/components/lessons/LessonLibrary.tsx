'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { sampleLessons } from '@/data/lessons';
import { LessonPlayer } from '@/components/lessons/LessonPlayer';
import { Lesson, DifficultyLevel } from '@/types';
import { BookOpen, Clock, CheckCircle, Star, MapPin } from 'lucide-react';

export function LessonLibrary() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons([...completedLessons, lessonId]);
    setSelectedLesson(null);
  };

  if (selectedLesson) {
    return (
      <LessonPlayer
        lesson={selectedLesson}
        onComplete={() => handleLessonComplete(selectedLesson.id)}
        onExit={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learn Finnish</h1>
        <p className="text-gray-600">Choose a lesson to start learning. Each lesson includes vocabulary, grammar, and pronunciation practice.</p>
      </div>

      {/* Level Tabs */}
      <LevelTabs />

      {/* Lesson Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleLessons.map((lesson, index) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isCompleted={completedLessons.includes(lesson.id)}
            isLocked={index > 0 && !completedLessons.includes(sampleLessons[index - 1].id)}
            onClick={() => !lessonCardProps.isLocked && setSelectedLesson(lesson)}
          />
        ))}
      </div>
    </div>
  );
}

function LessonCard({ 
  lesson, 
  isCompleted, 
  isLocked, 
  onClick 
}: { 
  lesson: Lesson; 
  isCompleted: boolean; 
  isLocked: boolean;
  onClick: () => void;
}) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grammar': return '📚';
      case 'vocabulary': return '📝';
      case 'culture': return '🎭';
      case 'workplace': return '💼';
      case 'daily': return '🏠';
      default: return '📖';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'grammar': return 'bg-purple-100 text-purple-700';
      case 'vocabulary': return 'bg-blue-100 text-blue-700';
      case 'culture': return 'bg-pink-100 text-pink-700';
      case 'workplace': return 'bg-green-100 text-green-700';
      case 'daily': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
    >
      <Card
        className={`cursor-pointer transition-all ${
          isLocked ? 'opacity-60' : 'hover:shadow-lg'
        }`}
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getCategoryColor(lesson.category)}`}>
            {isCompleted ? <CheckCircle className="w-6 h-6" /> : getCategoryIcon(lesson.category)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(lesson.category)}`}>
                {lesson.category}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {lesson.difficulty}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{lesson.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
            
            {lesson.culturalNote && (
              <div className="mt-3 flex items-center gap-1 text-xs text-amber-600">
                <span>💡</span>
                <span>Cultural context included</span>
              </div>
            )}

            {isLocked && (
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <span>🔒</span>
                <span>Complete previous lesson to unlock</span>
              </div>
            )}
          </div>
          
          {!isLocked && (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <BookOpen className="w-4 h-4" />
                <span>{lesson.exercises.length}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>~{Math.ceil(lesson.exercises.length * 0.5)}min</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function LevelTabs() {
  const levels: DifficultyLevel[] = ['A1', 'A2', 'B1', 'B2'];
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel>('A1');

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => setActiveLevel(level)}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
            activeLevel === level
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {level} Level
        </button>
      ))}
    </div>
  );
}

// Fix the isLocked prop issue
const lessonCardProps = { isLocked: false };
