'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PronunciationChecker } from '@/components/pronunciation/PronunciationChecker';
import { Exercise, Lesson } from '@/types';
import { Check, X, Volume2, Lightbulb, ArrowRight, RotateCcw } from 'lucide-react';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: (results: { score: number; xp: number; timeSpent: number }) => void;
  onExit?: () => void;
}

export function LessonPlayer({ lesson, onComplete, onExit }: LessonPlayerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { correct: boolean; attempts: number }>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [typedAnswer, setTypedAnswer] = useState('');

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / lesson.exercises.length) * 100;

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    setAnswers({
      ...answers,
      [currentExercise.id]: { 
        correct: isCorrect, 
        attempts: (answers[currentExercise.id]?.attempts || 0) + 1 
      },
    });
    setShowFeedback(true);

    if (isCorrect) {
      setTimeout(() => {
        if (currentExerciseIndex < lesson.exercises.length - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setShowFeedback(false);
          setTypedAnswer('');
        } else {
          setIsCompleted(true);
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          const correctCount = Object.values(answers).filter(a => a.correct).length + 1;
          const score = Math.round((correctCount / lesson.exercises.length) * 100);
          const xp = Object.values(answers).reduce((sum, a) => sum + (a.correct ? 10 : 0), isCorrect ? 10 : 0);
          onComplete?.({ score, xp, timeSpent });
        }
      }, 1500);
    }
  };

  const handleTypedSubmit = () => {
    const normalizedInput = typedAnswer.toLowerCase().trim();
    const isCorrect = currentExercise.acceptableAnswers.some(
      ans => ans.toLowerCase().trim() === normalizedInput
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

  if (isCompleted) {
    return (
      <LessonComplete 
        lesson={lesson} 
        answers={answers} 
        timeSpent={Math.floor((Date.now() - startTime) / 1000)}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
        <div className="flex-1 mx-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="text-sm font-medium text-gray-600">
          {currentExerciseIndex + 1}/{lesson.exercises.length}
        </div>
      </div>

      {/* Exercise */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card variant="highlight" padding="lg">
            {/* Question */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentExercise.finnishText}
                </h2>
                <button
                  onClick={() => playAudio(currentExercise.finnishText)}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <Volume2 className="w-5 h-5 text-blue-600" />
                </button>
              </div>
              <p className="text-gray-600">{currentExercise.englishText}</p>
            </div>

            {/* Exercise Types */}
            <div className="space-y-4">
              {currentExercise.type === 'multiple_choice' && (
                <div className="grid grid-cols-1 gap-3">
                  {currentExercise.options.map((option, idx) => {
                    const isSelected = showFeedback && 
                      (answers[currentExercise.id]?.correct ? option === currentExercise.correctAnswer : false);
                    const isWrong = showFeedback && 
                      !answers[currentExercise.id]?.correct && 
                      option !== currentExercise.correctAnswer &&
                      answers[currentExercise.id];
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => !showFeedback && handleAnswer(option, option === currentExercise.correctAnswer)}
                        disabled={showFeedback}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50'
                            : isWrong
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {isSelected && <Check className="w-5 h-5 text-green-500" />}
                          {isWrong && <X className="w-5 h-5 text-red-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentExercise.type === 'typing' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTypedSubmit()}
                    placeholder="Type in Finnish..."
                    disabled={showFeedback}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                  />
                  <Button 
                    onClick={handleTypedSubmit}
                    disabled={!typedAnswer || showFeedback}
                    className="w-full"
                  >
                    Check
                  </Button>
                </div>
              )}

              {currentExercise.type === 'speaking' && (
                <PronunciationChecker
                  targetText={currentExercise.finnishText}
                  onResult={(result) => {
                    if (result.accuracy >= 60) {
                      handleAnswer(currentExercise.finnishText, true);
                    }
                  }}
                />
              )}

              {currentExercise.type === 'matching' && (
                <div className="text-center py-4 text-gray-600">
                  <p>Matching exercise - coming soon!</p>
                  <Button onClick={() => handleAnswer('matched', true)} className="mt-4">
                    Continue
                  </Button>
                </div>
              )}

              {currentExercise.type === 'listening' && (
                <div className="space-y-4">
                  <button
                    onClick={() => playAudio(currentExercise.finnishText)}
                    className="w-full p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Volume2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-700 font-medium">Click to listen</p>
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    {currentExercise.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option, option === currentExercise.correctAnswer)}
                        disabled={showFeedback}
                        className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 font-medium"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Grammar Explanation */}
            {currentExercise.grammarExplanation && showFeedback && answers[currentExercise.id]?.correct && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Grammar Tip</p>
                    <p className="text-sm text-yellow-800 mt-1">{currentExercise.grammarExplanation}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feedback */}
            {showFeedback && !answers[currentExercise.id]?.correct && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex items-center justify-between"
              >
                <p className="text-red-600 font-medium">Not quite. Try again!</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowFeedback(false);
                    setTypedAnswer('');
                  }}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Try Again
                </Button>
              </motion.div>
            )}

            {/* Hint */}
            {currentExercise.hint && !showFeedback && (
              <button
                onClick={() => alert(currentExercise.hint)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <Lightbulb className="w-4 h-4" />
                Need a hint?
              </button>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LessonComplete({ 
  lesson, 
  answers, 
  timeSpent,
  onExit 
}: { 
  lesson: Lesson; 
  answers: Record<string, { correct: boolean; attempts: number }>;
  timeSpent: number;
  onExit?: () => void;
}) {
  const correctCount = Object.values(answers).filter(a => a.correct).length;
  const total = lesson.exercises.length;
  const accuracy = Math.round((correctCount / total) * 100);
  const xp = correctCount * 10;

  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Lesson Complete!</h2>
      <p className="text-gray-600 mb-8">Great job finishing {lesson.title}</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-50 rounded-xl p-4">
          <div className="text-3xl font-bold text-yellow-600">{xp}</div>
          <p className="text-sm text-gray-600">XP Earned</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
          <p className="text-sm text-gray-600">Accuracy</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-3xl font-bold text-blue-600">
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </div>
          <p className="text-sm text-gray-600">Time</p>
        </div>
      </div>

      <Button size="lg" onClick={onExit} rightIcon={<ArrowRight className="w-5 h-5" />}>
        Continue
      </Button>
    </div>
  );
}
