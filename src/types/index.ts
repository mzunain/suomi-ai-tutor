// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  nativeLanguage: string;
  currentLevel: 'A1' | 'A2' | 'B1' | 'B2';
  dialectPreference: 'standard' | 'turku' | 'helsinki';
  goal: string | null;
  xp: number;
  streak: number;
  longestStreak: number;
  lastActive: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt: Date | null;
  score: number;
  timeSpent: number;
  attempts: number;
  dailyStreak: number;
}

// Lesson types
export type ExerciseType = 'multiple_choice' | 'speaking' | 'typing' | 'matching' | 'listening';
export type GrammarFocus = 'case' | 'verb' | 'vowel_harmony' | 'consonant_gradation' | null;
export type LessonCategory = 'grammar' | 'vocabulary' | 'culture' | 'workplace' | 'daily';
export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type Dialect = 'standard' | 'turku' | 'helsinki';

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  difficulty: DifficultyLevel;
  category: LessonCategory;
  order: number;
  contentStandard: string;
  contentTurku: string | null;
  contentHelsinki: string | null;
  culturalNote: string | null;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  order: number;
  finnishText: string;
  englishText: string;
  finnishAudioUrl: string | null;
  grammarFocus: GrammarFocus;
  grammarExplanation: string | null;
  options: string[];
  correctAnswer: string;
  acceptableAnswers: string[];
  hint: string | null;
  xpReward: number;
}

// Flashcard types
export interface Flashcard {
  id: string;
  userId: string;
  finnish: string;
  english: string;
  exampleSentence: string | null;
  category: string | null;
  nextReview: Date;
  interval: number;
  easeFactor: number;
  reviewCount: number;
  status: 'learning' | 'review' | 'mastered';
}

// Pronunciation types
export interface PronunciationAttempt {
  id: string;
  userId: string;
  targetText: string;
  targetPhonemes: string[];
  audioUrl: string | null;
  transcribedText: string;
  phonemeAccuracy: number;
  wordScores: Array<{ word: string; score: number }> | null;
  phonemeErrors: Array<{ expected: string; actual: string; position: number }> | null;
  createdAt: Date;
}

// Gamification types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  xpBonus: number;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: Badge;
}

// Assessment types
export interface AssessmentQuestion {
  id: string;
  type: 'vocabulary' | 'grammar' | 'comprehension';
  finnishText: string;
  englishText: string;
  options: string[];
  correctAnswer: string;
  difficulty: DifficultyLevel;
}

export interface AssessmentResult {
  level: DifficultyLevel;
  vocabularyScore: number;
  grammarScore: number;
  comprehensionScore: number;
  recommendations: string[];
}

// Dialect content
export interface DialectVariant {
  standard: string;
  turku?: string;
  helsinki?: string;
  audioStandard?: string;
  audioTurku?: string;
  audioHelsinki?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
