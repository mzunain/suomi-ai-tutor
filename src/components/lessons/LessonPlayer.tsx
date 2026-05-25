'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { PronunciationChecker } from '@/components/pronunciation/PronunciationChecker';
import { Lesson } from '@/types';
import {
  X,
  Volume2,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Check,
  Share2,
  Heart,
} from 'lucide-react';

const MAX_HEARTS = 5;
const LETTER_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

// ─── Confetti ──────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  '#1a56db', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

function Confetti() {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.floor((i / 36) * 100)}%`,
    delay: `${(i % 9) * 0.12}s`,
    duration: `${1.4 + (i % 5) * 0.3}s`,
    size: i % 3 === 0 ? 10 : i % 3 === 1 ? 7 : 5,
    shape: i % 3 === 0 ? 'rounded-sm' : 'rounded-full',
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`absolute top-0 animate-confetti ${p.shape}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Hearts display ────────────────────────────────────────────────────────────

function HeartsDisplay({ hearts, shakingHeart }: { hearts: number; shakingHeart: boolean }) {
  return (
    <div className={`flex items-center gap-0.5 ${shakingHeart ? 'animate-shake' : ''}`}>
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <span
          key={i}
          className={`text-lg transition-all duration-300 ${
            i < hearts ? 'opacity-100 scale-100' : 'opacity-30 grayscale'
          }`}
          style={i < hearts ? {} : { filter: 'grayscale(1)' }}
        >
          {i < hearts ? '❤️' : '🖤'}
        </span>
      ))}
    </div>
  );
}

// ─── Feedback Bar (Duolingo-style) ─────────────────────────────────────────────

function FeedbackBar({
  correct,
  correctAnswer,
  xpGained,
  grammarNote,
  onContinue,
}: {
  correct: boolean;
  correctAnswer: string;
  xpGained: number;
  grammarNote?: string | null;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      className={`fixed bottom-0 left-0 right-0 z-40 px-4 py-4 md:px-8 md:py-5 ${
        correct
          ? 'bg-green-500'
          : 'bg-red-500'
      }`}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {correct ? (
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-white flex-shrink-0" />
              <div>
                <p className="text-white font-bold text-base">Correct!</p>
                {xpGained > 0 && (
                  <p className="text-green-100 text-sm">+{xpGained} XP earned</p>
                )}
                {grammarNote && (
                  <p className="text-green-100 text-sm mt-0.5 line-clamp-2">{grammarNote}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold text-base">Incorrect</p>
                <p className="text-red-100 text-sm">
                  Correct answer: <span className="font-semibold text-white">{correctAnswer}</span>
                </p>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onContinue}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all flex-shrink-0 ${
            correct
              ? 'bg-white text-green-600 hover:bg-green-50 shadow-lg'
              : 'bg-white text-red-600 hover:bg-red-50 shadow-lg'
          }`}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Out of Hearts Screen ──────────────────────────────────────────────────────

function OutOfHeartsScreen({ lesson, onRestart, onExit }: { lesson: Lesson; onRestart: () => void; onExit?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="text-7xl mb-6"
      >
        💔
      </motion.div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Out of Hearts!</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        You used all your hearts in <strong>{lesson.title}</strong>. Practice makes perfect — try again!
      </p>
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
        {onExit && (
          <button
            onClick={onExit}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Exit
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Lesson Complete ───────────────────────────────────────────────────────────

function LessonComplete({
  lesson,
  answers,
  timeSpent,
  sessionXP,
  onExit,
}: {
  lesson: Lesson;
  answers: Record<string, { correct: boolean; attempts: number }>;
  timeSpent: number;
  sessionXP: number;
  onExit?: () => void;
}) {
  const [shared, setShared] = useState(false);
  const correctCount = Object.values(answers).filter((a) => a.correct).length;
  const total = lesson.exercises.length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const mins = Math.floor(timeSpent / 60);
  const secs = (timeSpent % 60).toString().padStart(2, '0');

  const handleShare = () => {
    const text = `I just completed "${lesson.title}" on SuomiAI! 🇫🇮 ${accuracy}% accuracy · ${sessionXP} XP earned. Learning Finnish one lesson at a time!`;
    navigator.clipboard.writeText(text).then(() => setShared(true));
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <>
      <Confetti />
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, delay: 0.1 }}
          className="text-7xl mb-4"
        >
          🎉
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-gray-900 mb-1"
        >
          Lesson Complete!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-8"
        >
          Fantastic work on <span className="font-semibold text-gray-700">{lesson.title}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-amber-600">{sessionXP}</div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">XP Earned</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-green-600">{accuracy}%</div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Accuracy</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-blue-600">
              {mins}:{secs}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Time</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {shared ? 'Copied!' : 'Share'}
          </button>
          <Button
            size="lg"
            onClick={onExit}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="flex-1"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </>
  );
}

// ─── Main LessonPlayer ─────────────────────────────────────────────────────────

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: (results: { score: number; xp: number; timeSpent: number }) => void;
  onExit?: () => void;
}

export function LessonPlayer({ lesson, onComplete, onExit }: LessonPlayerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { correct: boolean; attempts: number }>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [typedAnswer, setTypedAnswer] = useState('');
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [shakingHeart, setShakingHeart] = useState(false);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCulturalNote, setShowCulturalNote] = useState(true);

  const typingInputRef = useRef<HTMLInputElement>(null);

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex) / lesson.exercises.length) * 100;
  const progressEnd = ((currentExerciseIndex + 1) / lesson.exercises.length) * 100;

  // Auto-focus typing input
  useEffect(() => {
    if (currentExercise?.type === 'typing' && typingInputRef.current && !showFeedback) {
      typingInputRef.current.focus();
    }
  }, [currentExerciseIndex, showFeedback, currentExercise?.type]);

  // Reset hint when exercise changes
  useEffect(() => {
    setShowHint(false);
  }, [currentExerciseIndex]);

  const advance = useCallback(() => {
    setShowFeedback(false);
    setTypedAnswer('');
    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex((i) => i + 1);
    } else {
      setIsCompleted(true);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const correctCount = Object.values({ ...answers }).filter((a: { correct: boolean; attempts: number }) => a.correct).length;
      const score = Math.round((correctCount / lesson.exercises.length) * 100);
      onComplete?.({ score, xp: sessionXP, timeSpent });
    }
  }, [currentExerciseIndex, lesson.exercises.length, answers, sessionXP, startTime, onComplete]);

  const handleAnswer = useCallback(
    (answer: string, isCorrect: boolean) => {
      const xpGain = isCorrect ? (currentExercise.xpReward ?? 10) : 0;

      setAnswers((prev: Record<string, { correct: boolean; attempts: number }>) => ({
        ...prev,
        [currentExercise.id]: {
          correct: isCorrect,
          attempts: (prev[currentExercise.id]?.attempts ?? 0) + 1,
        },
      }));

      setLastAnswerCorrect(isCorrect);
      setShowFeedback(true);

      if (isCorrect) {
        setSessionXP((xp: number) => xp + xpGain);
      } else {
        setHearts((h: number) => {
          const next = h - 1;
          if (next <= 0) {
            setOutOfHearts(true);
          }
          return next;
        });
        setShakingHeart(true);
        setTimeout(() => setShakingHeart(false), 500);
      }
    },
    [currentExercise]
  );

  const handleTypedSubmit = () => {
    if (!typedAnswer.trim()) return;
    const normalized = typedAnswer.toLowerCase().trim();
    const isCorrect = currentExercise.acceptableAnswers.some(
      (ans) => ans.toLowerCase().trim() === normalized
    );
    handleAnswer(typedAnswer, isCorrect);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fi-FI';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleRestart = () => {
    setCurrentExerciseIndex(0);
    setAnswers({});
    setShowFeedback(false);
    setIsCompleted(false);
    setTypedAnswer('');
    setHearts(MAX_HEARTS);
    setOutOfHearts(false);
    setSessionXP(0);
    setShakingHeart(false);
    setShowHint(false);
    setShowCulturalNote(true);
  };

  if (outOfHearts) {
    return <OutOfHeartsScreen lesson={lesson} onRestart={handleRestart} onExit={onExit} />;
  }

  if (isCompleted) {
    return (
      <LessonComplete
        lesson={lesson}
        answers={answers}
        timeSpent={Math.floor((Date.now() - startTime) / 1000)}
        sessionXP={sessionXP}
        onExit={onExit}
      />
    );
  }

  if (!currentExercise) return null;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onExit}
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #1a56db, #10b981)' }}
              animate={{ width: `${showFeedback ? progressEnd : progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* XP counter */}
        <div className="flex items-center gap-1 text-amber-600 font-bold text-sm flex-shrink-0 min-w-[52px] justify-end">
          <span className="text-amber-500">⚡</span>
          <span>+{sessionXP}</span>
        </div>

        {/* Hearts */}
        <HeartsDisplay hearts={hearts} shakingHeart={shakingHeart} />
      </div>

      {/* Exercise counter */}
      <p className="text-xs text-gray-400 text-center mb-4 font-medium">
        {currentExerciseIndex + 1} of {lesson.exercises.length}
      </p>

      {/* Cultural note (first exercise only) */}
      <AnimatePresence>
        {lesson.culturalNote && currentExerciseIndex === 0 && showCulturalNote && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3"
          >
            <span className="text-2xl flex-shrink-0">💡</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 text-sm mb-0.5">Cultural Note</p>
              <p className="text-amber-800 text-sm leading-relaxed">{lesson.culturalNote}</p>
            </div>
            <button
              onClick={() => setShowCulturalNote(false)}
              className="text-amber-400 hover:text-amber-700 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          {/* Exercise type label */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {currentExercise.type === 'multiple_choice'
              ? 'Choose the correct answer'
              : currentExercise.type === 'typing'
              ? 'Type in Finnish'
              : currentExercise.type === 'speaking'
              ? 'Pronunciation practice'
              : currentExercise.type === 'listening'
              ? 'Listen and choose'
              : 'Match the pairs'}
          </p>

          {/* Question */}
          <div className="text-center mb-7">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {currentExercise.finnishText}
              </h2>
              {currentExercise.type !== 'typing' && (
                <button
                  onClick={() => playAudio(currentExercise.finnishText)}
                  className="w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Volume2 className="w-4 h-4 text-blue-600" />
                </button>
              )}
            </div>
            <p className="text-gray-500 text-sm">{currentExercise.englishText}</p>
          </div>

          {/* ── Multiple Choice ── */}
          {currentExercise.type === 'multiple_choice' && (
            <div className="space-y-3">
              {currentExercise.options.map((option, idx) => {
                let state: 'default' | 'correct' | 'wrong' | 'missed' = 'default';
                if (showFeedback) {
                  if (option === currentExercise.correctAnswer) {
                    state = 'correct';
                  } else if (!lastAnswerCorrect && answers[currentExercise.id]) {
                    state = 'wrong';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() =>
                      !showFeedback &&
                      handleAnswer(option, option === currentExercise.correctAnswer)
                    }
                    disabled={showFeedback}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all font-medium ${
                      state === 'correct'
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : state === 'wrong'
                        ? 'border-red-300 bg-red-50 text-red-800'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-800'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        state === 'correct'
                          ? 'bg-green-500 text-white'
                          : state === 'wrong'
                          ? 'bg-red-400 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {LETTER_LABELS[idx]}
                    </span>
                    <span className="flex-1">{option}</span>
                    {state === 'correct' && <Check className="w-5 h-5 text-green-500" />}
                    {state === 'wrong' && <X className="w-5 h-5 text-red-400" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Typing ── */}
          {currentExercise.type === 'typing' && (
            <div className="space-y-3">
              <div className="relative">
                <input
                  ref={typingInputRef}
                  type="text"
                  value={typedAnswer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTypedAnswer(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && !showFeedback && handleTypedSubmit()}
                  placeholder="Type in Finnish..."
                  disabled={showFeedback}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
                    showFeedback
                      ? lastAnswerCorrect
                        ? 'border-green-400 bg-green-50'
                        : 'border-red-400 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                <span className="absolute right-3 bottom-2 text-xs text-gray-300">
                  {typedAnswer.length}
                </span>
              </div>
              {!showFeedback && (
                <Button
                  onClick={handleTypedSubmit}
                  disabled={!typedAnswer.trim()}
                  className="w-full"
                >
                  Check Answer
                </Button>
              )}
            </div>
          )}

          {/* ── Speaking ── */}
          {currentExercise.type === 'speaking' && (
            <PronunciationChecker
              targetText={currentExercise.finnishText}
              onResult={(result) => {
                if (result.accuracy >= 60) {
                  handleAnswer(currentExercise.finnishText, true);
                } else if (!showFeedback) {
                  handleAnswer(currentExercise.finnishText, false);
                }
              }}
            />
          )}

          {/* ── Matching (simplified) ── */}
          {currentExercise.type === 'matching' && (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4 text-sm">Matching exercise</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {currentExercise.options.slice(0, 4).map((pair, idx) => {
                  const [fi, en] = pair.split('-');
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-1 p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                    >
                      <span className="font-semibold text-blue-700">{fi}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-600">{en}</span>
                    </div>
                  );
                })}
              </div>
              {!showFeedback && (
                <Button onClick={() => handleAnswer('matched', true)}>
                  Got it! Continue
                </Button>
              )}
            </div>
          )}

          {/* ── Listening ── */}
          {currentExercise.type === 'listening' && (
            <div className="space-y-4">
              <button
                onClick={() => playAudio(currentExercise.finnishText)}
                className="w-full p-5 rounded-xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 transition-colors flex flex-col items-center gap-2"
              >
                <Volume2 className="w-8 h-8 text-blue-600" />
                <p className="text-blue-700 font-semibold text-sm">Click to Listen</p>
              </button>
              {!showFeedback && (
                <div className="grid grid-cols-2 gap-3">
                  {currentExercise.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        handleAnswer(option, option === currentExercise.correctAnswer)
                      }
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 font-medium text-gray-800 transition-all text-sm"
                    >
                      <span className="inline-flex w-6 h-6 rounded-full bg-gray-100 items-center justify-center text-xs font-bold text-gray-600 mr-2">
                        {LETTER_LABELS[idx]}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hint */}
          {currentExercise.hint && !showFeedback && (
            <div className="mt-5">
              <button
                onClick={() => setShowHint((s: boolean) => !s)}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-amber-600 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-medium overflow-hidden"
                  >
                    💡 {currentExercise.hint}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Grammar explanation (shown after correct answer) */}
          <AnimatePresence>
            {showFeedback && lastAnswerCorrect && currentExercise.grammarExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
              >
                <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">
                  Grammar Tip
                </p>
                <p className="text-sm text-yellow-900">{currentExercise.grammarExplanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Feedback bar */}
      <AnimatePresence>
        {showFeedback && (
          <FeedbackBar
            correct={lastAnswerCorrect}
            correctAnswer={currentExercise.correctAnswer}
            xpGained={lastAnswerCorrect ? (currentExercise.xpReward ?? 10) : 0}
            grammarNote={
              lastAnswerCorrect && currentExercise.grammarExplanation
                ? undefined // shown inline above
                : undefined
            }
            onContinue={advance}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
