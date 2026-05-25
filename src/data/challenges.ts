export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: "vocabulary" | "listening" | "streak" | "flashcards" | "grammar";
  xpReward: number;
  bonusXp: number;
  requirement: number;
  icon: string;
}

export const challengePool: DailyChallenge[] = [
  {
    id: "c-vocab-5",
    title: "Word Sprint",
    description: "Learn 5 new vocabulary words",
    type: "vocabulary",
    xpReward: 20,
    bonusXp: 10,
    requirement: 5,
    icon: "📝",
  },
  {
    id: "c-lesson-1",
    title: "Daily Lesson",
    description: "Complete 1 lesson",
    type: "vocabulary",
    xpReward: 30,
    bonusXp: 15,
    requirement: 1,
    icon: "📚",
  },
  {
    id: "c-streak-1",
    title: "Keep the Flame",
    description: "Maintain your daily streak",
    type: "streak",
    xpReward: 15,
    bonusXp: 5,
    requirement: 1,
    icon: "🔥",
  },
  {
    id: "c-flashcard-10",
    title: "Card Shark",
    description: "Review 10 flashcards",
    type: "flashcards",
    xpReward: 25,
    bonusXp: 10,
    requirement: 10,
    icon: "🃏",
  },
  {
    id: "c-perfect-1",
    title: "Perfectionist",
    description: "Complete a lesson with 100% accuracy",
    type: "vocabulary",
    xpReward: 50,
    bonusXp: 25,
    requirement: 1,
    icon: "⭐",
  },
  {
    id: "c-grammar-2",
    title: "Grammar Guru",
    description: "Complete 2 grammar-focused exercises",
    type: "grammar",
    xpReward: 35,
    bonusXp: 15,
    requirement: 2,
    icon: "🎓",
  },
  {
    id: "c-vocab-10",
    title: "Vocabulary Builder",
    description: "Learn 10 new words today",
    type: "vocabulary",
    xpReward: 40,
    bonusXp: 20,
    requirement: 10,
    icon: "💡",
  },
];

export function getDailyChallenges(dateStr: string): DailyChallenge[] {
  // Deterministic selection based on date so all users get same challenges
  const seed = dateStr.split("-").reduce((acc, n) => acc + parseInt(n), 0);
  const indices = [seed % challengePool.length, (seed + 2) % challengePool.length, (seed + 4) % challengePool.length];
  const unique = [...new Set(indices)];
  return unique.map((i) => challengePool[i]);
}
