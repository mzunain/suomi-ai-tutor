import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateStreak(lastActive: Date, currentStreak: number): number {
  const now = new Date();
  const last = new Date(lastActive);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak;
  if (diffDays > 1) return 0;
  return currentStreak;
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    'A1': 'bg-green-500',
    'A2': 'bg-blue-500',
    'B1': 'bg-yellow-500',
    'B2': 'bg-orange-500',
    'C1': 'bg-red-500',
  };
  return colors[level] || 'bg-gray-500';
}

export function getDialectName(dialect: string): string {
  const names: Record<string, string> = {
    'standard': 'Standard Finnish',
    'turku': 'Turku Dialect',
    'helsinki': 'Helsinki Dialect',
  };
  return names[dialect] || 'Standard Finnish';
}

export function calculateXPForLevel(level: number): number {
  // XP needed for each level increases exponentially
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getPhonemes(text: string): string[] {
  // Simplified Finnish phoneme extraction
  // In production, this would use a proper phoneme library
  const phonemeMap: Record<string, string> = {
    'a': 'a', 'ä': 'æ', 'b': 'b', 'c': 'k', 'd': 'd',
    'e': 'e', 'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i',
    'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n',
    'o': 'o', 'ö': 'ø', 'p': 'p', 'q': 'k', 'r': 'r',
    's': 's', 't': 't', 'u': 'u', 'v': 'v', 'w': 'v',
    'x': 'ks', 'y': 'y', 'z': 'z', 'å': 'o', 'ü': 'y',
  };
  
  return text.toLowerCase().split('').map(char => phonemeMap[char] || char);
}
