"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, Brain, Clock, Volume2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "Greetings" | "Numbers" | "Food" | "Work" | "Nature" | "Time";

interface FlashcardReview {
  id: string;
  finnish: string;
  english: string;
  exampleSentence: string | null;
  category: Category;
  interval: number;
  easeFactor: number;
  reviewCount: number;
}

// ─── Deck (20 cards) ──────────────────────────────────────────────────────────

const FULL_DECK: FlashcardReview[] = [
  // Greetings
  { id: "g1", finnish: "Hei", english: "Hello / Hi", exampleSentence: "Hei, miten menee?", category: "Greetings", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "g2", finnish: "Moi", english: "Hi (informal)", exampleSentence: "Moi! Hauska nähdä sinut.", category: "Greetings", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "g3", finnish: "Kiitos", english: "Thank you", exampleSentence: "Kiitos avusta!", category: "Greetings", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "g4", finnish: "Ole hyvä", english: "You're welcome", exampleSentence: "Kiitos! — Ole hyvä.", category: "Greetings", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "g5", finnish: "Anteeksi", english: "Excuse me / Sorry", exampleSentence: "Anteeksi, missä on rautatieasema?", category: "Greetings", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  // Numbers
  { id: "n1", finnish: "Yksi", english: "One (1)", exampleSentence: "Haluaisin yksi kahvi, kiitos.", category: "Numbers", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "n2", finnish: "Kaksi", english: "Two (2)", exampleSentence: "Minulla on kaksi lasta.", category: "Numbers", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "n3", finnish: "Kolme", english: "Three (3)", exampleSentence: "Kolme euroa, ole hyvä.", category: "Numbers", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "n4", finnish: "Viisi", english: "Five (5)", exampleSentence: "Bussipysäkki on viisi minuuttia.", category: "Numbers", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "n5", finnish: "Kymmenen", english: "Ten (10)", exampleSentence: "Se maksaa kymmenen euroa.", category: "Numbers", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  // Food
  { id: "f1", finnish: "Kahvi", english: "Coffee", exampleSentence: "Haluan kupin kahvia.", category: "Food", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "f2", finnish: "Leipä", english: "Bread", exampleSentence: "Ostan tuoretta leipää kaupasta.", category: "Food", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "f3", finnish: "Vesi", english: "Water", exampleSentence: "Saanko lasin vettä?", category: "Food", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "f4", finnish: "Ruoka", english: "Food", exampleSentence: "Suomalainen ruoka on maukasta.", category: "Food", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "f5", finnish: "Kalakukko", english: "Fish pie", exampleSentence: "Kalakukko on perinteinen savolainen ruoka.", category: "Food", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  // Work
  { id: "w1", finnish: "Työ", english: "Work / Job", exampleSentence: "Minulla on työ Helsingissä.", category: "Work", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "w2", finnish: "Toimisto", english: "Office", exampleSentence: "Toimisto on kolmannessa kerroksessa.", category: "Work", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "w3", finnish: "Kokous", english: "Meeting", exampleSentence: "Kokous alkaa kello kymmenen.", category: "Work", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "w4", finnish: "Puhelin", english: "Phone", exampleSentence: "Puhelin on pöydällä.", category: "Work", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  // Nature
  { id: "nat1", finnish: "Metsä", english: "Forest", exampleSentence: "Suomessa on paljon metsiä.", category: "Nature", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "nat2", finnish: "Järvi", english: "Lake", exampleSentence: "Järvi on kaunis kesällä.", category: "Nature", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "nat3", finnish: "Talvi", english: "Winter", exampleSentence: "Suomen talvi on kylmä mutta kaunis.", category: "Nature", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "nat4", finnish: "Kesä", english: "Summer", exampleSentence: "Kesällä aurinko ei laske pohjoisessa.", category: "Nature", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  // Time
  { id: "t1", finnish: "Huomenna", english: "Tomorrow", exampleSentence: "Tapaaminen on huomenna.", category: "Time", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "t2", finnish: "Tänään", english: "Today", exampleSentence: "Tänään on maanantai.", category: "Time", interval: 1, easeFactor: 2.5, reviewCount: 0 },
  { id: "t3", finnish: "Nyt", english: "Now", exampleSentence: "Minulla on kiire nyt.", category: "Time", interval: 1, easeFactor: 2.5, reviewCount: 0 },
];

const CATEGORIES: Category[] = ["Greetings", "Numbers", "Food", "Work", "Nature", "Time"];
const CATEGORY_EMOJI: Record<Category, string> = {
  Greetings: "👋",
  Numbers: "🔢",
  Food: "🍽️",
  Work: "💼",
  Nature: "🌲",
  Time: "⏰",
};

// ─── Speech synthesis ─────────────────────────────────────────────────────────

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "fi-FI";
  utt.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

// ─── SM-2 Algorithm ───────────────────────────────────────────────────────────

function calculateNextReview(quality: number, card: FlashcardReview) {
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
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  return { interval, easeFactor, reviewCount };
}

// ─── Rating button ────────────────────────────────────────────────────────────

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
      className={`${color} text-white rounded-xl p-3 flex flex-col items-center gap-0.5 hover:opacity-90 active:scale-95 transition-all`}
    >
      {icon}
      <span className="font-semibold text-sm">{label}</span>
      <span className="text-xs opacity-75">{nextInterval}</span>
    </button>
  );
}

// ─── Session summary ──────────────────────────────────────────────────────────

function SessionComplete({
  stats,
  cards,
  onRestart,
}: {
  stats: { correct: number; incorrect: number };
  cards: FlashcardReview[];
  onRestart: () => void;
}) {
  const total = stats.correct + stats.incorrect;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
  const conicGrad = `conic-gradient(#22c55e 0% ${accuracy}%, #f3f4f6 ${accuracy}% 100%)`;

  const hardCards = cards.filter((c) => c.reviewCount === 0 && c.interval === 1);

  return (
    <div className="max-w-md mx-auto py-10 px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-5 flex items-center justify-center"
      >
        <Brain className="w-10 h-10 text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Session Complete!</h2>
      <p className="text-gray-500 mb-6">You reviewed all cards for today</p>

      {/* Accuracy ring */}
      <div className="flex items-center justify-center gap-8 mb-7">
        <div className="relative w-24 h-24 flex-shrink-0">
          <div
            className="w-24 h-24 rounded-full"
            style={{ background: conicGrad }}
          />
          <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
            <span className="text-xl font-bold text-gray-900">{accuracy}%</span>
          </div>
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span className="text-sm text-gray-600">{stats.correct} correct</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
            <span className="text-sm text-gray-600">{stats.incorrect} incorrect</span>
          </div>
        </div>
      </div>

      {hardCards.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-orange-700 mb-2">
            Review again soon:
          </p>
          <ul className="space-y-1">
            {hardCards.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-sm text-orange-800">
                <span className="font-medium">{c.finnish}</span>
                <span className="text-orange-400">—</span>
                <span>{c.english}</span>
              </li>
            ))}
            {hardCards.length > 5 && (
              <li className="text-xs text-orange-500">+{hardCards.length - 5} more</li>
            )}
          </ul>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
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

// ─── Main component ───────────────────────────────────────────────────────────

export function FlashcardSystem() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [cards, setCards] = useState(FULL_DECK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredCards = useMemo(() => {
    if (activeCategory === "All") return cards;
    return cards.filter((c) => c.category === activeCategory);
  }, [cards, activeCategory]);

  const dueCount = filteredCards.filter((c) => c.interval === 1).length;
  const learningCount = filteredCards.filter((c) => c.reviewCount > 0 && c.interval < 10).length;
  const masteredCount = filteredCards.filter((c) => c.interval >= 10).length;

  const currentCard = filteredCards[currentIndex];
  const isComplete = currentIndex >= filteredCards.length;

  const handleRating = (quality: number) => {
    if (isAnimating) return;

    const updatedCard = {
      ...currentCard,
      ...calculateNextReview(quality, currentCard),
    };

    setCards((prev) => prev.map((c) => (c.id === currentCard.id ? updatedCard : c)));
    setSessionStats((prev) => ({
      correct: prev.correct + (quality >= 3 ? 1 : 0),
      incorrect: prev.incorrect + (quality < 3 ? 1 : 0),
    }));

    setIsAnimating(true);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleCategoryChange = (cat: Category | "All") => {
    setActiveCategory(cat);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  if (isComplete) {
    return (
      <SessionComplete
        stats={sessionStats}
        cards={filteredCards}
        onRestart={() => {
          setCurrentIndex(0);
          setIsFlipped(false);
          setSessionStats({ correct: 0, incorrect: 0 });
        }}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Flashcards</h1>
        <p className="text-gray-500 text-sm">Review vocabulary with spaced repetition</p>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => handleCategoryChange("All")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === "All"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {CATEGORY_EMOJI[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg px-2.5 py-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 block" />
          <span className="text-xs text-blue-700 font-medium">{dueCount} due</span>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 rounded-lg px-2.5 py-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-400 block" />
          <span className="text-xs text-orange-700 font-medium">{learningCount} learning</span>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 rounded-lg px-2.5 py-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 block" />
          <span className="text-xs text-green-700 font-medium">{masteredCount} mastered</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(currentIndex / filteredCards.length) * 100}%` }}
            className="h-full bg-blue-500 rounded-full"
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm text-gray-500 flex-shrink-0">
          {currentIndex + 1}/{filteredCards.length}
        </span>
      </div>

      {/* Swipe hint */}
      <p className="text-center text-xs text-gray-400 mb-3">← Hard &nbsp;·&nbsp; Tap to flip &nbsp;·&nbsp; Easy →</p>

      {/* Card */}
      <div className="relative h-72 mb-5" style={{ perspective: "1200px" }}>
        <motion.div
          className="w-full h-full cursor-pointer"
          onClick={() => !isAnimating && setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center p-6 relative">
              {/* Category chip */}
              <span className="absolute top-3 left-3 text-xs bg-blue-100 text-blue-600 font-medium px-2 py-0.5 rounded-full">
                {CATEGORY_EMOJI[currentCard.category]} {currentCard.category}
              </span>

              {/* Audio button */}
              <button
                onClick={(e) => { e.stopPropagation(); speak(currentCard.finnish); }}
                className="absolute top-3 right-3 w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4 text-blue-600" />
              </button>

              <p className="text-sm text-gray-400 mb-3">Finnish</p>
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
                {currentCard.finnish}
              </h2>
              <p className="text-gray-400 text-sm">Tap to reveal</p>
            </div>
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl flex flex-col items-center justify-center p-6 relative">
              {/* Audio button — plays Finnish on back too */}
              <button
                onClick={(e) => { e.stopPropagation(); speak(currentCard.finnish); }}
                className="absolute top-3 right-3 w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4 text-green-600" />
              </button>

              <p className="text-sm text-gray-400 mb-3">English</p>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                {currentCard.english}
              </h2>
              {currentCard.exampleSentence && (
                <div className="mt-2 text-center px-2">
                  <p className="text-xs text-gray-400 mb-1">Example:</p>
                  <p className="text-sm text-gray-600 italic">{currentCard.exampleSentence}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rating buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="grid grid-cols-4 gap-2"
          >
            <RatingButton quality={1} label="Again" color="bg-red-500" onClick={() => handleRating(1)} icon={<RotateCw className="w-4 h-4" />} />
            <RatingButton quality={2} label="Hard" color="bg-orange-500" onClick={() => handleRating(2)} />
            <RatingButton quality={3} label="Good" color="bg-blue-500" onClick={() => handleRating(3)} />
            <RatingButton quality={4} label="Easy" color="bg-green-500" onClick={() => handleRating(4)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isFlipped && (
        <p className="text-center text-gray-400 text-sm mt-4">
          Tap the card, then rate how well you knew it
        </p>
      )}
    </div>
  );
}

export default FlashcardSystem;
