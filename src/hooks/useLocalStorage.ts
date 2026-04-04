'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'suomi-ai-tutor-data';

export interface PersistedData {
  user: {
    id: string;
    name: string;
    email: string;
    xp: number;
    level: number;
    streak: number;
    lastActive: string;
    dialectPreference: 'standard' | 'turku' | 'helsinki';
    nativeLanguage: string;
  };
  progress: {
    completedLessons: string[];
    lessonScores: Record<string, number>;
    totalXp: number;
    currentStreak: number;
    longestStreak: number;
  };
  flashcards: Array<{
    id: string;
    finnish: string;
    english: string;
    nextReview: string;
    interval: number;
    easeFactor: number;
    reviewCount: number;
    status: 'learning' | 'review' | 'mastered';
  }>;
  settings: {
    audioEnabled: boolean;
    notificationsEnabled: boolean;
    dailyGoal: number;
    uiLanguage: string;
  };
  timestamp: string;
}

const defaultData: PersistedData = {
  user: {
    id: '',
    name: '',
    email: '',
    xp: 0,
    level: 1,
    streak: 0,
    lastActive: new Date().toISOString(),
    dialectPreference: 'standard',
    nativeLanguage: 'en',
  },
  progress: {
    completedLessons: [],
    lessonScores: {},
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
  },
  flashcards: [],
  settings: {
    audioEnabled: true,
    notificationsEnabled: true,
    dailyGoal: 15,
    uiLanguage: 'en',
  },
  timestamp: new Date().toISOString(),
};

export function useLocalStorage() {
  const [data, setData] = useState<PersistedData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle schema updates
        setData({ ...defaultData, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [data, isLoaded]);

  const updateUser = useCallback((updates: Partial<PersistedData['user']>) => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, ...updates },
      timestamp: new Date().toISOString(),
    }));
  }, []);

  const updateProgress = useCallback((updates: Partial<PersistedData['progress']>) => {
    setData(prev => ({
      ...prev,
      progress: { ...prev.progress, ...updates },
      timestamp: new Date().toISOString(),
    }));
  }, []);

  const updateSettings = useCallback((updates: Partial<PersistedData['settings']>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
      timestamp: new Date().toISOString(),
    }));
  }, []);

  const addFlashcard = useCallback((flashcard: PersistedData['flashcards'][0]) => {
    setData(prev => ({
      ...prev,
      flashcards: [...prev.flashcards, flashcard],
      timestamp: new Date().toISOString(),
    }));
  }, []);

  const updateFlashcard = useCallback((id: string, updates: Partial<PersistedData['flashcards'][0]>) => {
    setData(prev => ({
      ...prev,
      flashcards: prev.flashcards.map(fc => 
        fc.id === id ? { ...fc, ...updates } : fc
      ),
      timestamp: new Date().toISOString(),
    }));
  }, []);

  const markLessonComplete = useCallback((lessonId: string, score: number, xp: number) => {
    setData(prev => {
      const completedLessons = [...prev.progress.completedLessons];
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }
      
      return {
        ...prev,
        progress: {
          ...prev.progress,
          completedLessons,
          lessonScores: { ...prev.progress.lessonScores, [lessonId]: score },
          totalXp: prev.progress.totalXp + xp,
        },
        user: {
          ...prev.user,
          xp: prev.user.xp + xp,
          lastActive: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };
    });
  }, []);

  const updateStreak = useCallback(() => {
    setData(prev => {
      const lastActive = new Date(prev.user.lastActive);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      
      let newStreak = prev.user.streak;
      if (diffDays === 0) {
        // Already active today
        return prev;
      } else if (diffDays === 1) {
        // Consecutive day
        newStreak = prev.user.streak + 1;
      } else {
        // Streak broken
        newStreak = 1;
      }

      return {
        ...prev,
        user: {
          ...prev.user,
          streak: newStreak,
          lastActive: today.toISOString(),
        },
        progress: {
          ...prev.progress,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, prev.progress.longestStreak),
        },
        timestamp: new Date().toISOString(),
      };
    });
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      setData({ ...defaultData, ...parsed });
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }, []);

  const clearData = useCallback(() => {
    setData(defaultData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    data,
    isLoaded,
    updateUser,
    updateProgress,
    updateSettings,
    addFlashcard,
    updateFlashcard,
    markLessonComplete,
    updateStreak,
    exportData,
    importData,
    clearData,
  };
}
