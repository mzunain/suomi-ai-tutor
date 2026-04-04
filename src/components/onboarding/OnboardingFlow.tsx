"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { sampleLessons, assessmentQuestions } from "@/data/lessons";
import { DifficultyLevel, AssessmentResult } from "@/types";
import { ArrowRight, Check, X } from "lucide-react";

const steps = [
  { id: "welcome", title: "Welcome" },
  { id: "profile", title: "Your Profile" },
  { id: "assessment", title: "Level Assessment" },
  { id: "goals", title: "Your Goals" },
  { id: "complete", title: "Ready!" },
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "",
    nativeLanguage: "en",
    dialect: "standard" as const,
  });
  const [assessmentAnswers, setAssessmentAnswers] = useState<
    Record<string, string>
  >({});
  const [goals, setGoals] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateLevel = (): AssessmentResult => {
    const answers = Object.values(assessmentAnswers);
    const correct = answers.filter(
      (a, i) => a === assessmentQuestions[i]?.correctAnswer,
    ).length;

    const percentage = correct / assessmentQuestions.length;

    let level: DifficultyLevel = "A1";
    if (percentage >= 0.8) level = "B1";
    else if (percentage >= 0.6) level = "A2";

    return {
      level,
      vocabularyScore: Math.round(percentage * 100),
      grammarScore: Math.round(percentage * 95),
      comprehensionScore: Math.round(percentage * 90),
      recommendations: [
        "Focus on daily vocabulary",
        "Practice pronunciation",
        "Learn basic grammar cases",
      ],
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar
            progress={(currentStep / (steps.length - 1)) * 100}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            {steps.map((step, idx) => (
              <span
                key={step.id}
                className={
                  idx <= currentStep ? "text-blue-600 font-medium" : ""
                }
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="highlight" padding="lg">
              {currentStep === 0 && <WelcomeStep onNext={handleNext} />}
              {currentStep === 1 && (
                <ProfileStep
                  profile={profile}
                  setProfile={setProfile}
                  onNext={handleNext}
                />
              )}
              {currentStep === 2 && (
                <AssessmentStep
                  answers={assessmentAnswers}
                  setAnswers={setAssessmentAnswers}
                  onNext={handleNext}
                />
              )}
              {currentStep === 3 && (
                <GoalsStep
                  goals={goals}
                  setGoals={setGoals}
                  onNext={handleNext}
                />
              )}
              {currentStep === 4 && <CompleteStep result={calculateLevel()} />}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center"
      >
        <span className="text-4xl text-white">🇫🇮</span>
      </motion.div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Tervetuloa SuomiAI:hin!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        The smartest way to learn Finnish for life in Finland. Whether
        you&apos;re in Turku or Helsinki, we&apos;ve got you covered.
      </p>
      <div className="space-y-3 text-left max-w-md mx-auto mb-8">
        <div className="flex items-center gap-3 text-gray-700">
          <Check className="w-5 h-5 text-green-500" />
          <span>AI-powered pronunciation feedback</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Check className="w-5 h-5 text-green-500" />
          <span>Local dialect support (Turku & Helsinki)</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Check className="w-5 h-5 text-green-500" />
          <span>Workplace Finnish for job success</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Check className="w-5 h-5 text-green-500" />
          <span>Cultural tips for integration</span>
        </div>
      </div>
      <Button
        size="lg"
        onClick={onNext}
        rightIcon={<ArrowRight className="w-5 h-5" />}
      >
        Get Started
      </Button>
    </div>
  );
}

function ProfileStep({
  profile,
  setProfile,
  onNext,
}: {
  profile: { name: string; nativeLanguage: string; dialect: "standard" };
  setProfile: (p: typeof profile) => void;
  onNext: () => void;
}) {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Tell us about yourself
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What should we call you?
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your native language
          </label>
          <select
            value={profile.nativeLanguage}
            onChange={(e) =>
              setProfile({ ...profile, nativeLanguage: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="es">Spanish</option>
            <option value="ru">Russian</option>
            <option value="so">Somali</option>
            <option value="fa">Farsi</option>
            <option value="tr">Turkish</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Which dialect are you most interested in?
          </label>
          <div className="space-y-3">
            <button
              onClick={() => setProfile({ ...profile, dialect: "standard" })}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                profile.dialect === "standard"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Standard Finnish
              </div>
              <div className="text-sm text-gray-600">
                Yleiskieli - The formal language used in education and media
              </div>
            </button>
          </div>
        </div>

        <Button onClick={onNext} className="w-full" disabled={!profile.name}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function AssessmentStep({
  answers,
  setAnswers,
  onNext,
}: {
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
  onNext: () => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const question = assessmentQuestions[currentQ];

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [question.id]: answer });

    if (currentQ < assessmentQuestions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 500);
    }
  };

  const isComplete =
    currentQ >= assessmentQuestions.length - 1 && answers[question.id];

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Quick Assessment
      </h2>
      <p className="text-gray-600 mb-6">
        Question {currentQ + 1} of {assessmentQuestions.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center py-6 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-900 mb-2">
              {question.finnishText}
            </p>
            <p className="text-gray-600">{question.englishText}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={!!answers[question.id]}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  answers[question.id] === option
                    ? answers[question.id] === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : answers[question.id] && option === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {answers[question.id] === option &&
                    (answers[question.id] === question.correctAnswer ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    ))}
                  {answers[question.id] &&
                    answers[question.id] !== option &&
                    option === question.correctAnswer && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Button onClick={onNext} className="w-full">
            See My Results
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function GoalsStep({
  goals,
  setGoals,
  onNext,
}: {
  goals: string[];
  setGoals: (g: string[]) => void;
  onNext: () => void;
}) {
  const goalOptions = [
    { id: "work", label: "Get a job", icon: "💼" },
    { id: "citizenship", label: "Citizenship (YKI test)", icon: "🇫🇮" },
    { id: "daily", label: "Daily life in Finland", icon: "🏠" },
    { id: "study", label: "Study at university", icon: "🎓" },
    { id: "social", label: "Make friends & socialize", icon: "👋" },
    { id: "workplace", label: "Better at current job", icon: "📈" },
  ];

  const toggleGoal = (id: string) => {
    if (goals.includes(id)) {
      setGoals(goals.filter((g) => g !== id));
    } else {
      setGoals([...goals, id]);
    }
  };

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What are your goals?
      </h2>
      <p className="text-gray-600 mb-6">
        Select all that apply. We&apos;ll personalize your learning journey.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              goals.includes(goal.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="text-2xl mb-2">{goal.icon}</div>
            <div className="text-sm font-medium text-gray-900">
              {goal.label}
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={onNext}
        className="w-full mt-6"
        disabled={goals.length === 0}
      >
        Continue
      </Button>
    </div>
  );
}

function CompleteStep({ result }: { result: AssessmentResult }) {
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You&apos;re all set!
      </h2>
      <p className="text-gray-600 mb-6">
        Based on your assessment, we recommend starting at:
      </p>

      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {result.level}
        </div>
        <p className="text-gray-600">CEFR Level</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-900">
            {result.vocabularyScore}%
          </div>
          <p className="text-sm text-gray-600">Vocabulary</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-900">
            {result.grammarScore}%
          </div>
          <p className="text-sm text-gray-600">Grammar</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-900">
            {result.comprehensionScore}%
          </div>
          <p className="text-sm text-gray-600">Comprehension</p>
        </div>
      </div>

      <Button size="lg" className="w-full">
        Start Learning Finnish!
      </Button>
    </div>
  );
}
