'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Data types ───────────────────────────────────────────────────────────────

interface Option {
  text: string;
  translation: string;
  isCorrect: boolean;
}

interface Step {
  aiMessage: string;
  aiTranslation: string;
  options: Option[];
  aiResponse: string;
  aiResponseTranslation: string;
  aiResponseWrong: string;
  aiResponseWrongTranslation: string;
}

interface ScenarioData {
  id: 'cafe' | 'doctor' | 'work';
  label: string;
  emoji: string;
  steps: Step[];
}

// ─── Scenario data ────────────────────────────────────────────────────────────

const SCENARIOS: ScenarioData[] = [
  {
    id: 'cafe',
    label: 'At the Café',
    emoji: '☕',
    steps: [
      {
        aiMessage: 'Hei! Mitä saa olla?',
        aiTranslation: 'Hi! What can I get you?',
        options: [
          { text: 'Haluaisin kahvin, kiitos.', translation: "I'd like a coffee, please.", isCorrect: true },
          { text: 'Anteeksi, missä on vessa?', translation: 'Excuse me, where is the toilet?', isCorrect: false },
          { text: 'Hyvää päivää!', translation: 'Good day!', isCorrect: false },
        ],
        aiResponse: 'Iso vai pieni?',
        aiResponseTranslation: 'Large or small?',
        aiResponseWrong: 'Anteeksi, en ymmärtänyt. Haluatko tilata jotain?',
        aiResponseWrongTranslation: "Sorry, I didn't understand. Would you like to order something?",
      },
      {
        aiMessage: 'Iso vai pieni?',
        aiTranslation: 'Large or small?',
        options: [
          { text: 'Iso, kiitos.', translation: 'Large, please.', isCorrect: true },
          { text: 'Ei, kiitos.', translation: 'No, thank you.', isCorrect: false },
          { text: 'En tiedä.', translation: "I don't know.", isCorrect: false },
        ],
        aiResponse: 'Haluatko sokeria tai maitoa?',
        aiResponseTranslation: 'Would you like sugar or milk?',
        aiResponseWrong: 'Okei, otetaan pieni kahvi sitten.',
        aiResponseWrongTranslation: "OK, let's go with a small coffee then.",
      },
      {
        aiMessage: 'Haluatko sokeria tai maitoa?',
        aiTranslation: 'Would you like sugar or milk?',
        options: [
          { text: 'Ei kiitos, musta kahvi on hyvä.', translation: 'No thank you, black coffee is fine.', isCorrect: true },
          { text: 'Missä on WC?', translation: 'Where is the WC?', isCorrect: false },
          { text: 'Paljonko se maksaa?', translation: 'How much does it cost?', isCorrect: false },
        ],
        aiResponse: 'Selvä! Paljonko saa olla?',
        aiResponseTranslation: 'Got it! Anything else?',
        aiResponseWrong: 'Okei, laitan maitoa ja sokeria.',
        aiResponseWrongTranslation: 'OK, I will add milk and sugar.',
      },
      {
        aiMessage: 'Selvä! Paljonko saa olla?',
        aiTranslation: 'Got it! Anything else?',
        options: [
          { text: 'Ei muuta, kiitos. Paljonko se maksaa?', translation: 'Nothing else, thanks. How much is it?', isCorrect: true },
          { text: 'Minulla on nälkä.', translation: 'I am hungry.', isCorrect: false },
          { text: 'Olen myöhässä.', translation: 'I am late.', isCorrect: false },
        ],
        aiResponse: 'Se on kolme euroa viisikymmentä.',
        aiResponseTranslation: 'That is three euros fifty.',
        aiResponseWrong: 'Okei, haluatko lisätä jotain?',
        aiResponseWrongTranslation: 'OK, would you like to add anything?',
      },
      {
        aiMessage: 'Se on kolme euroa viisikymmentä.',
        aiTranslation: 'That is three euros fifty.',
        options: [
          { text: 'Tässä on neljä euroa.', translation: 'Here is four euros.', isCorrect: true },
          { text: 'Se on liian kallista!', translation: 'That is too expensive!', isCorrect: false },
          { text: 'En osaa sanoa.', translation: "I can't say.", isCorrect: false },
        ],
        aiResponse: 'Kiitos! Tässä on vaihtorahasi. Hyvää päivänjatkoa!',
        aiResponseTranslation: 'Thank you! Here is your change. Have a great day!',
        aiResponseWrong: 'Maksetaan kortilla sitten?',
        aiResponseWrongTranslation: 'Shall we pay by card then?',
      },
    ],
  },
  {
    id: 'doctor',
    label: 'At the Doctor',
    emoji: '🏥',
    steps: [
      {
        aiMessage: 'Hyvää päivää. Mikä vaivaa?',
        aiTranslation: 'Good day. What seems to be the problem?',
        options: [
          { text: 'Minulla on päänsärky.', translation: 'I have a headache.', isCorrect: true },
          { text: 'Kiitos hyvää, entä sinä?', translation: 'Fine thanks, and you?', isCorrect: false },
          { text: 'En ymmärrä.', translation: "I don't understand.", isCorrect: false },
        ],
        aiResponse: 'Kuinka kauan päänsärky on kestänyt?',
        aiResponseTranslation: 'How long have you had the headache?',
        aiResponseWrong: 'Anteeksi, kysyin mikä vaivaa teitä tänään.',
        aiResponseWrongTranslation: "Sorry, I asked what is bothering you today.",
      },
      {
        aiMessage: 'Kuinka kauan päänsärky on kestänyt?',
        aiTranslation: 'How long have you had the headache?',
        options: [
          { text: 'Noin kaksi päivää.', translation: 'About two days.', isCorrect: true },
          { text: 'Minulla on kylmä.', translation: 'I am cold.', isCorrect: false },
          { text: 'Voisitteko puhua hitaammin?', translation: 'Could you speak more slowly?', isCorrect: false },
        ],
        aiResponse: 'Onko teillä muita oireita, kuten kuumetta tai pahoinvointia?',
        aiResponseTranslation: 'Do you have any other symptoms, such as fever or nausea?',
        aiResponseWrong: 'Okei, ja kuinka kauan oireet ovat kestäneet?',
        aiResponseWrongTranslation: 'OK, and how long have the symptoms lasted?',
      },
      {
        aiMessage: 'Onko teillä muita oireita?',
        aiTranslation: 'Do you have any other symptoms?',
        options: [
          { text: 'Minulla on myös huimausta.', translation: 'I also have dizziness.', isCorrect: true },
          { text: 'Olen väsynyt.', translation: 'I am tired.', isCorrect: false },
          { text: 'En muista.', translation: "I don't remember.", isCorrect: false },
        ],
        aiResponse: 'Ymmärrän. Otetaan verenpaine ja lämpötila.',
        aiResponseTranslation: 'I understand. Let us take your blood pressure and temperature.',
        aiResponseWrong: 'Selvä, tarkistetaan verenpaine ensin.',
        aiResponseWrongTranslation: 'OK, let us check the blood pressure first.',
      },
      {
        aiMessage: 'Onko teillä allergioita lääkkeille?',
        aiTranslation: 'Do you have any medication allergies?',
        options: [
          { text: 'En, minulla ei ole allergioita.', translation: 'No, I have no allergies.', isCorrect: true },
          { text: 'Kyllä, rakastan lääkkeitä.', translation: 'Yes, I love medicine.', isCorrect: false },
          { text: 'Ehkä huomenna.', translation: 'Maybe tomorrow.', isCorrect: false },
        ],
        aiResponse: 'Hyvä. Kirjoitan teille reseptin kipulääkkeelle.',
        aiResponseTranslation: 'Good. I will write you a prescription for a painkiller.',
        aiResponseWrong: 'Kerrotko tarkemmin, millaisia allergioita?',
        aiResponseWrongTranslation: 'Could you tell me more about what kind of allergies?',
      },
      {
        aiMessage: 'Kirjoitan teille reseptin. Ottakaa lääke kahdesti päivässä.',
        aiTranslation: 'I am writing you a prescription. Take the medicine twice a day.',
        options: [
          { text: 'Kiitos paljon, lääkäri.', translation: 'Thank you very much, doctor.', isCorrect: true },
          { text: 'Minulla ei ole rahaa.', translation: "I don't have money.", isCorrect: false },
          { text: 'Onko se vaarallista?', translation: 'Is it dangerous?', isCorrect: false },
        ],
        aiResponse: 'Ole hyvä. Toivottavasti toivut pian. Palaa tarvittaessa.',
        aiResponseTranslation: "You're welcome. I hope you recover soon. Come back if needed.",
        aiResponseWrong: 'Resepti on ilmainen vakuutuksellasi. Voit noutaa lääkkeen apteekista.',
        aiResponseWrongTranslation: 'The prescription is free with your insurance. You can pick up the medicine at the pharmacy.',
      },
    ],
  },
  {
    id: 'work',
    label: 'At Work',
    emoji: '💼',
    steps: [
      {
        aiMessage: 'Hei! Oletko uusi työntekijä?',
        aiTranslation: 'Hi! Are you the new employee?',
        options: [
          { text: 'Kyllä, minä olen Anna. Hauska tutustua!', translation: 'Yes, I am Anna. Nice to meet you!', isCorrect: true },
          { text: 'En, olen täällä tapaamassa.', translation: "No, I'm here for a meeting.", isCorrect: false },
          { text: 'Voitko puhua hitaammin?', translation: 'Can you speak more slowly?', isCorrect: false },
        ],
        aiResponse: 'Hauska tutustua, Anna! Olen Mikko, tiimisi johtaja.',
        aiResponseTranslation: 'Nice to meet you, Anna! I am Mikko, your team leader.',
        aiResponseWrong: 'Anteeksi, minulla on tapaaminen kello kaksi. Kenen kanssa?',
        aiResponseWrongTranslation: 'Sorry, I have a meeting at two. With whom?',
      },
      {
        aiMessage: 'Mistä tulet? Oletko asunut Suomessa kauan?',
        aiTranslation: 'Where are you from? Have you lived in Finland long?',
        options: [
          { text: 'Olen asunut Suomessa kaksi vuotta.', translation: 'I have lived in Finland for two years.', isCorrect: true },
          { text: 'En pidä talvesta.', translation: "I don't like winter.", isCorrect: false },
          { text: 'Suomi on kaunis maa.', translation: 'Finland is a beautiful country.', isCorrect: false },
        ],
        aiResponse: 'Hienoa! Puhutko suomea jo hyvin?',
        aiResponseTranslation: 'Great! Do you speak Finnish well already?',
        aiResponseWrong: 'Kyllä, Suomi on todella upea paikka!',
        aiResponseWrongTranslation: 'Yes, Finland is truly a wonderful place!',
      },
      {
        aiMessage: 'Mikä on tittelisi tai tehtäväsi tiimissä?',
        aiTranslation: 'What is your title or role in the team?',
        options: [
          { text: 'Olen ohjelmistokehittäjä.', translation: 'I am a software developer.', isCorrect: true },
          { text: 'En tiedä vielä.', translation: "I don't know yet.", isCorrect: false },
          { text: 'Opiskelen vielä.', translation: 'I am still studying.', isCorrect: false },
        ],
        aiResponse: 'Mahtavaa! Tarvitsemme kovasti kehittäjiä. Oletko käyttänyt Reactia?',
        aiResponseTranslation: 'Fantastic! We really need developers. Have you used React?',
        aiResponseWrong: 'Okei, no tule mukaan niin kerron tehtävistä paremmin.',
        aiResponseWrongTranslation: 'OK, come along and I will tell you more about the tasks.',
      },
      {
        aiMessage: 'Kokous alkaa kello kaksitoista. Onko sinulla kysymyksiä?',
        aiTranslation: 'The meeting starts at twelve. Do you have any questions?',
        options: [
          { text: 'Missä kokoushuone on?', translation: 'Where is the meeting room?', isCorrect: true },
          { text: 'En pidä kokouksista.', translation: "I don't like meetings.", isCorrect: false },
          { text: 'Haluaisin kahvia ensin.', translation: 'I would like coffee first.', isCorrect: false },
        ],
        aiResponse: 'Se on toisessa kerroksessa, huone 204. Hissi on tuolla.',
        aiResponseTranslation: 'It is on the second floor, room 204. The elevator is over there.',
        aiResponseWrong: 'Hyvä idea! Kahvihuone on ensimmäisessä kerroksessa.',
        aiResponseWrongTranslation: 'Good idea! The coffee room is on the first floor.',
      },
      {
        aiMessage: 'Tervetuloa tiimiin! Onko sinulla muita kysymyksiä?',
        aiTranslation: 'Welcome to the team! Do you have any other questions?',
        options: [
          { text: 'Kiitos paljon! Olen innoissani aloittaa.', translation: 'Thank you very much! I am excited to start.', isCorrect: true },
          { text: 'Missä on lähin kauppa?', translation: 'Where is the nearest store?', isCorrect: false },
          { text: 'Milloin on ruokatauko?', translation: 'When is the lunch break?', isCorrect: false },
        ],
        aiResponse: 'Loistavaa asennetta! Nähdään kokouksessa. Hyvää ensimmäistä päivää!',
        aiResponseTranslation: 'Great attitude! See you at the meeting. Have a great first day!',
        aiResponseWrong: 'Ruokatauko on kello kaksitoista. Tervetuloa uudelleen!',
        aiResponseWrongTranslation: 'Lunch break is at twelve. Welcome again!',
      },
    ],
  },
];

// ─── Message type ─────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  translation?: string;
}

type ScenarioId = 'cafe' | 'doctor' | 'work';

function getInitialMessage(scenarioId: ScenarioId, suffix = '0'): Message {
  const scenarioData = SCENARIOS.find((s) => s.id === scenarioId)!;
  const first = scenarioData.steps[0];

  return {
    id: `ai-${suffix}`,
    role: 'ai',
    text: first.aiMessage,
    translation: first.aiTranslation,
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ChatPractice() {
  const [scenario, setScenario] = useState<ScenarioId>('cafe');
  const [messages, setMessages] = useState<Message[]>(() => [getInitialMessage('cafe')]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [lastWasCorrect, setLastWasCorrect] = useState<boolean | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scenarioData = SCENARIOS.find((s) => s.id === scenario)!;

  const resetScenario = (nextScenario: ScenarioId, suffix = '0') => {
    setScenario(nextScenario);
    setMessages([getInitialMessage(nextScenario, suffix)]);
    setCurrentStep(0);
    setSelectedOption(null);
    setScore({ correct: 0, total: 0 });
    setIsTyping(false);
    setIsComplete(false);
    setLastWasCorrect(null);
    setXpEarned(0);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOptionSelect = (option: Option) => {
    if (selectedOption !== null || isTyping) return;

    const isCorrect = option.isCorrect;
    setSelectedOption(option.text);
    setLastWasCorrect(isCorrect);

    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1,
    };
    setScore(newScore);

    if (isCorrect) {
      setXpEarned((prev) => prev + 5);
    }

    // Add user message
    const userMsg: Message = {
      id: `user-${currentStep}`,
      role: 'user',
      text: option.text,
      translation: option.translation,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Show typing indicator then AI response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const step = scenarioData.steps[currentStep];
      const aiReply: Message = {
        id: `ai-${currentStep + 1}`,
        role: 'ai',
        text: isCorrect ? step.aiResponse : step.aiResponseWrong,
        translation: isCorrect ? step.aiResponseTranslation : step.aiResponseWrongTranslation,
      };

      setMessages((prev) => [...prev, aiReply]);

      const nextStep = currentStep + 1;
      if (nextStep >= scenarioData.steps.length) {
        setIsComplete(true);
        setCurrentStep(nextStep);
      } else {
        // Add next prompt after a short pause
        setTimeout(() => {
          const nextStepData = scenarioData.steps[nextStep];
          const nextAiMsg: Message = {
            id: `ai-prompt-${nextStep}`,
            role: 'ai',
            text: nextStepData.aiMessage,
            translation: nextStepData.aiTranslation,
          };
          setMessages((prev) => [...prev, nextAiMsg]);
          setCurrentStep(nextStep);
          setSelectedOption(null);
          setLastWasCorrect(null);
        }, 600);
      }
    }, 800);
  };

  const handleRestart = () => {
    resetScenario(scenario, '0-restart');
  };

  const currentOptions =
    !isComplete && currentStep < scenarioData.steps.length
      ? scenarioData.steps[currentStep].options
      : [];

  const canSelectOptions = selectedOption === null && !isTyping && !isComplete;

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white text-xl font-bold">Chat Practice 🤖</h1>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
            <span className="text-yellow-300 text-sm font-bold">
              {score.correct}/{score.total} ⭐
            </span>
            {xpEarned > 0 && (
              <AnimatePresence>
                <motion.span
                  key={xpEarned}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-green-300 text-xs font-semibold"
                >
                  +{xpEarned} XP
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Scenario pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => resetScenario(s.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                scenario === s.id
                  ? 'bg-white text-slate-900'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-1">
                  <span className="text-sm">🤖</span>
                </div>
              )}

              {/* Bubble */}
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    msg.role === 'ai'
                      ? 'bg-white shadow-sm rounded-bl-sm'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
                  }`}
                >
                  <p className={`text-sm font-medium leading-snug ${msg.role === 'ai' ? 'text-gray-900' : 'text-white'}`}>
                    {msg.text}
                  </p>
                  {msg.translation && (
                    <p className={`text-xs mt-0.5 ${msg.role === 'ai' ? 'text-gray-400' : 'text-blue-100'}`}>
                      {msg.translation}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🤖</span>
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full block"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scenario complete screen ── */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-6"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-xl font-bold text-gray-900">Scenario complete!</h2>
              <p className="text-gray-500 text-sm mt-1">
                You scored{' '}
                <span className="font-semibold text-blue-600">
                  {score.correct}/{score.total}
                </span>{' '}
                and earned{' '}
                <span className="font-semibold text-yellow-500">+{xpEarned} XP</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Try again 🔄
              </button>
              <button
                onClick={() => {
                  const nextId = scenario === 'cafe' ? 'doctor' : scenario === 'doctor' ? 'work' : 'cafe';
                  resetScenario(nextId);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Next scenario →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Response options ── */}
      {!isComplete && (
        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          {/* Swipe hint */}
          {!selectedOption && (
            <p className="text-center text-xs text-gray-400">Choose your response</p>
          )}

          <AnimatePresence mode="wait">
            {canSelectOptions ? (
              <motion.div
                key={`options-${currentStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {currentOptions.map((option, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <p className="text-sm font-medium text-gray-900">{option.text}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{option.translation}</p>
                  </motion.button>
                ))}
              </motion.div>
            ) : selectedOption !== null ? (
              <motion.div
                key="feedback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-xl px-4 py-3 text-center ${
                  lastWasCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <p className={`text-sm font-semibold ${lastWasCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {lastWasCorrect ? '✅ Correct! +5 XP' : "❌ Not quite — listen to the AI's response"}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default ChatPractice;
