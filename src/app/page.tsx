"use client";

import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { LessonLibrary } from "@/components/lessons/LessonLibrary";
import { FlashcardSystem } from "@/components/flashcards/FlashcardSystem";
import { GamificationDashboard } from "@/components/gamification/GamificationDashboard";
import { DialectSelector } from "@/components/dialects/DialectSelector";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { BookOpen, Brain, Trophy, MessageCircle, Settings, Map, Flame } from "lucide-react";
import { ChatPractice } from "@/components/chat/ChatPractice";

type View = "lessons" | "flashcards" | "progress" | "dialects" | "chat" | "onboarding";

interface UserStats {
  xp: number;
  level: number;
  streak: number;
}

const XP_PER_LEVEL = 300;

function XPBar({ xp, level }: { xp: number; level: number }) {
  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  const percent = Math.min(100, Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100));

  return (
    <div className="px-4 py-3 border-b border-slate-800">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-slate-400">Level {level}</span>
        <span className="text-xs text-amber-400 font-medium">
          {xpInCurrentLevel} / {XP_PER_LEVEL} XP
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
          }}
        />
      </div>
    </div>
  );
}

function UserAvatar({ level }: { level: number }) {
  return (
    <div className="px-4 pt-5 pb-3 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base shadow-lg">
            YO
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center">
            <span className="text-slate-900 text-xs font-black">{level}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">You</p>
          <p className="text-xs text-slate-400">Finnish Learner</p>
        </div>
      </div>
    </div>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="px-4 py-2.5 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-semibold text-orange-300">
          {streak}-day streak
        </span>
        {streak >= 7 && (
          <span className="ml-auto text-xs bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded-full font-medium">
            On fire!
          </span>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("lessons");
  const { t, language, setLanguage } = useTranslation();
  const [userStats, setUserStats] = useState<UserStats>({ xp: 0, level: 1, streak: 0 });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("suomi-ai-tutor-data");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserStats({
          xp: parsed?.user?.xp ?? 0,
          level: parsed?.user?.level ?? 1,
          streak: parsed?.user?.streak ?? 0,
        });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const navItems: { view: View; icon: React.ReactNode; label: string }[] = [
    { view: "lessons", icon: <BookOpen className="w-5 h-5" />, label: t("learn") },
    { view: "flashcards", icon: <Brain className="w-5 h-5" />, label: t("flashcards") },
    { view: "progress", icon: <Trophy className="w-5 h-5" />, label: t("progress") },
    { view: "dialects", icon: <Map className="w-5 h-5" />, label: t("dialects") },
    { view: "chat", icon: <MessageCircle className="w-5 h-5" />, label: "Chat" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      {/* Sidebar Navigation */}
      <nav
        className="w-64 hidden md:flex flex-col flex-shrink-0"
        style={{ background: "var(--sidebar-bg)" }}
      >
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-lg">🇫🇮</span>
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">SuomiAI</span>
          </div>
        </div>

        {/* User avatar */}
        <UserAvatar level={userStats.level} />

        {/* XP bar */}
        <XPBar xp={userStats.xp} level={userStats.level} />

        {/* Streak */}
        <StreakBadge streak={userStats.streak} />

        {/* Nav items */}
        <div className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ view, icon, label }) => (
            <NavButton
              key={view}
              active={currentView === view}
              onClick={() => setCurrentView(view)}
              icon={icon}
              label={label}
            />
          ))}
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <div className="mb-1">
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
          </div>
          <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full text-sm">
            <Settings className="w-4 h-4" />
            <span>{t("settings")}</span>
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 safe-area-inset-bottom">
        <div className="flex justify-around py-1">
          {navItems.map(({ view, icon, label }) => (
            <MobileNavButton
              key={view}
              active={currentView === view}
              onClick={() => setCurrentView(view)}
              icon={icon}
              label={label}
            />
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 min-h-screen">
        {currentView === "lessons" && <LessonLibrary />}
        {currentView === "flashcards" && <FlashcardSystem />}
        {currentView === "progress" && <GamificationDashboard />}
        {currentView === "dialects" && <DialectSelector />}
        {currentView === "chat" && <ChatPractice />}
      </main>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-2 py-2 transition-colors ${
        active ? "text-blue-400" : "text-slate-500"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
