"use client";

import { useState } from "react";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { LessonLibrary } from "@/components/lessons/LessonLibrary";
import { FlashcardSystem } from "@/components/flashcards/FlashcardSystem";
import { GamificationDashboard } from "@/components/gamification/GamificationDashboard";
import { DialectSelector } from "@/components/dialects/DialectSelector";
import { BookOpen, Brain, Trophy, MessageCircle, Settings } from "lucide-react";

type View = "lessons" | "flashcards" | "progress" | "dialects" | "onboarding";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("lessons");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🇫🇮</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SuomiAI</span>
          </div>

          <div className="space-y-2">
            <NavButton
              active={currentView === "lessons"}
              onClick={() => setCurrentView("lessons")}
              icon={<BookOpen className="w-5 h-5" />}
              label="Learn"
            />
            <NavButton
              active={currentView === "flashcards"}
              onClick={() => setCurrentView("flashcards")}
              icon={<Brain className="w-5 h-5" />}
              label="Flashcards"
            />
            <NavButton
              active={currentView === "progress"}
              onClick={() => setCurrentView("progress")}
              icon={<Trophy className="w-5 h-5" />}
              label="Progress"
            />
            <NavButton
              active={currentView === "dialects"}
              onClick={() => setCurrentView("dialects")}
              icon={<MessageCircle className="w-5 h-5" />}
              label="Dialects"
            />
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-gray-200">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          <MobileNavButton
            active={currentView === "lessons"}
            onClick={() => setCurrentView("lessons")}
            icon={<BookOpen className="w-5 h-5" />}
            label="Learn"
          />
          <MobileNavButton
            active={currentView === "flashcards"}
            onClick={() => setCurrentView("flashcards")}
            icon={<Brain className="w-5 h-5" />}
            label="Cards"
          />
          <MobileNavButton
            active={currentView === "progress"}
            onClick={() => setCurrentView("progress")}
            icon={<Trophy className="w-5 h-5" />}
            label="Progress"
          />
          <MobileNavButton
            active={currentView === "dialects"}
            onClick={() => setCurrentView("dialects")}
            icon={<MessageCircle className="w-5 h-5" />}
            label="Culture"
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {currentView === "lessons" && <LessonLibrary />}
        {currentView === "flashcards" && <FlashcardSystem />}
        {currentView === "progress" && <GamificationDashboard />}
        {currentView === "dialects" && <DialectSelector />}
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-50"
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
      className={`flex flex-col items-center gap-1 p-2 transition-colors ${
        active ? "text-blue-600" : "text-gray-400"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
