"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Flashcard as FlashcardType } from "@/types";
import { RotateCw, Check, X, Brain, Clock } from "lucide-react";

interface FlashcardReview {
  id: string;
  finnish: string;
  english: string;
  exampleSentence: string | null;
  interval: number;
  easeFactor: number;
  reviewCount: number;
}

// Sample flashcards for demo
const sampleFlashcards: FlashcardReview[] = [
  {
    id: "1",
    finnish: "Hei",
    english: "Hello",
    exampleSentence: "Hei, miten menee?",
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0,
  },
  {
    id: "2",
    finnish: "Kiitos",
    english: "Thank you",
    exampleSentence: "Kiitos avusta!",
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0,
  },
  {
    id: "3",
    finnish: "Kahvi",
    english: "Coffee",
    exampleSentence: "Haluan kupin kahvia.",
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0,
  },
  {
    id: "4",
    finnish: "Talo",
    english: "House",
    exampleSentence: "Tämä on minun taloni.",
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0,
  },
  {
    id: "5",
    finnish: "Ystävä",
    english: "Friend",
    exampleSentence: "Hän on minun ystäväni.",
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0,
  },
];

export function FlashcardSystem() {
  const [cards, setCards] = useState(sampleFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
  });

  const currentCard = cards[currentIndex];
  const isComplete = currentIndex >= cards.length;

  // SM-2 Algorithm
  const calculateNextReview = (quality: number, card: FlashcardReview) => {
    let { interval, easeFactor, reviewCount } = card;

    if (quality >= 3) {
      if (reviewCount === 0) {
        interval = 1;
      } else if (reviewCount === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      reviewCount++;
    } else {
      reviewCount = 0;
      interval = 1;
    }

    easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    return { interval, easeFactor, reviewCount };
  };

  const handleRating = (quality: number) => {
    const updatedCard = {
      ...currentCard,
      ...calculateNextReview(quality, currentCard),
    };

    setCards(cards.map((c, i) => (i === currentIndex ? updatedCard : c)));
    setSessionStats({
      correct: sessionStats.correct + (quality >= 3 ? 1 : 0),
      incorrect: sessionStats.incorrect + (quality < 3 ? 1 : 0),
    });

    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
  };

  if (isComplete) {
    return (
      <SessionComplete
        stats={sessionStats}
        onRestart={() => {
          setCurrentIndex(0);
          setSessionStats({ correct: 0, incorrect: 0 });
        }}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h1>
        <p className="text-gray-600">
          Review vocabulary with spaced repetition
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(currentIndex / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">
          {currentIndex + 1}/{cards.length}
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-1 text-sm text-green-600">
          <Check className="w-4 h-4" />
          <span>{sessionStats.correct}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-red-600">
          <X className="w-4 h-4" />
          <span>{sessionStats.incorrect}</span>
        </div>
      </div>

      {/* Card */}
      <div className="relative h-80 mb-6">
        <motion.div
          className="w-full h-full cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Card
              variant="highlight"
              className="h-full flex flex-col items-center justify-center p-8"
            >
              <p className="text-sm text-gray-500 mb-4">Finnish</p>
              <h2 className="text-4xl font-bold text-gray-900 text-center">
                {currentCard.finnish}
              </h2>
              <p className="text-gray-400 mt-8 text-sm">
                Click to reveal answer
              </p>
            </Card>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <Card
              variant="highlight"
              className="h-full flex flex-col items-center justify-center p-8"
            >
              <p className="text-sm text-gray-500 mb-4">English</p>
              <h2 className="text-3xl font-bold text-gray-900 text-center">
                {currentCard.english}
              </h2>
              {currentCard.exampleSentence && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">Example:</p>
                  <p className="text-gray-700 italic mt-1">
                    {currentCard.exampleSentence}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Rating Buttons */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-2"
        >
          <RatingButton
            quality={1}
            label="Again"
            color="bg-red-500"
            onClick={() => handleRating(1)}
            icon={<RotateCw className="w-4 h-4" />}
          />
          <RatingButton
            quality={2}
            label="Hard"
            color="bg-orange-500"
            onClick={() => handleRating(2)}
          />
          <RatingButton
            quality={3}
            label="Good"
            color="bg-blue-500"
            onClick={() => handleRating(3)}
          />
          <RatingButton
            quality={4}
            label="Easy"
            color="bg-green-500"
            onClick={() => handleRating(4)}
          />
        </motion.div>
      )}

      {/* Instructions */}
      {!isFlipped && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Click the card to see the answer, then rate how well you knew it
        </p>
      )}
    </div>
  );
}

function RatingButton({
  quality,
  label,
  color,
  onClick,
  icon,
}: {
  quality: number;
  label: string;
  color: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  const nextInterval =
    quality === 1 ? "<1m" : quality === 2 ? "2d" : quality === 3 ? "3d" : "5d";

  return (
    <button
      onClick={onClick}
      className={`${color} text-white rounded-xl p-3 flex flex-col items-center gap-1 hover:opacity-90 transition-opacity`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
      <span className="text-xs opacity-75">{nextInterval}</span>
    </button>
  );
}

function SessionComplete({
  stats,
  onRestart,
}: {
  stats: { correct: number; incorrect: number };
  onRestart: () => void;
}) {
  const total = stats.correct + stats.incorrect;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
      >
        <Brain className="w-10 h-10 text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Session Complete!
      </h2>
      <p className="text-gray-600 mb-8">
        You&apos;ve reviewed all cards for today
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-3xl font-bold text-green-600">
            {stats.correct}
          </div>
          <p className="text-sm text-gray-600">Correct</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
          <p className="text-sm text-gray-600">Accuracy</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Next review in:</span>
        </div>
        <p className="font-medium text-gray-900">24 hours</p>
        <p className="text-xs text-gray-500 mt-1">
          Come back tomorrow for optimal spaced repetition
        </p>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
      >
        Review Again
      </button>
    </div>
  );
}
