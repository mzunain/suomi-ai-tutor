'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { MapPin, Volume2, BookOpen, MessageCircle } from 'lucide-react';

interface DialectInfo {
  id: string;
  name: string;
  region: string;
  description: string;
  features: string[];
  examples: { standard: string; dialect: string; meaning: string }[];
  color: string;
}

const dialects: DialectInfo[] = [
  {
    id: 'standard',
    name: 'Standard Finnish',
    region: 'All Finland',
    description: 'Yleiskieli - The formal, written standard used in education, media, and official contexts. Based on Western dialects.',
    features: [
      'Used in news and books',
      'Taught in schools',
      'Most formal variant',
      'Basis for YKI test',
    ],
    examples: [
      { standard: 'Minä', dialect: 'Minä', meaning: 'I' },
      { standard: 'Talo', dialect: 'Talo', meaning: 'House' },
      { standard: 'Miten menee?', dialect: 'Miten menee?', meaning: 'How are you?' },
    ],
    color: 'bg-blue-500',
  },
  {
    id: 'turku',
    name: 'Turku Dialect',
    region: 'Turku & Southwest',
    description: 'Turun murre - Known for its relaxed, friendly character. Often considered the "softest" Finnish dialect with unique vowel sounds.',
    features: [
      'R-relaxed pronunciation',
      'Soft d sounds',
      'Extended vowels',
      'Famous "Turku R"',
    ],
    examples: [
      { standard: 'Mä', dialect: 'Mää', meaning: 'I' },
      { standard: 'Sä', dialect: 'Sää', meaning: 'You' },
      { standard: 'Miten menee?', dialect: 'Mittee kuuluu?', meaning: 'How are you?' },
      { standard: 'Hyvää päivää', dialect: 'Huuvaa päevää', meaning: 'Good day' },
    ],
    color: 'bg-green-500',
  },
  {
    id: 'helsinki',
    name: 'Helsinki Dialect',
    region: 'Helsinki Region',
    description: 'Stadin slangi - Urban, fast-paced dialect influenced by Swedish and Russian. Features direct, efficient communication style.',
    features: [
      'Fast tempo',
      'Abbreviated forms',
      'Slang vocabulary',
      'Urban expressions',
    ],
    examples: [
      { standard: 'Yksi', dialect: 'Yks', meaning: 'One' },
      { standard: 'Kahvi', dialect: 'Kahvi / Kahia', meaning: 'Coffee' },
      { standard: 'Moi', dialect: 'Moi / Moro', meaning: 'Hi' },
      { standard: 'Haluan', dialect: 'Haluun', meaning: 'I want' },
    ],
    color: 'bg-purple-500',
  },
];

const culturalNotes = [
  {
    title: 'Sisu',
    icon: '💪',
    content: 'The Finnish concept of stoic determination, grit, and resilience. Sisu is about pushing through difficulties without complaint.',
  },
  {
    title: 'Silence',
    icon: '🤫',
    content: 'Comfortable silence is valued in Finnish culture. Not speaking doesn\'t mean awkwardness—it shows respect and thoughtfulness.',
  },
  {
    title: 'Sauna',
    icon: '🧖',
    content: 'The sauna is sacred in Finland. There are 3.3 million saunas for 5.5 million people. Business deals and friendships are built here.',
  },
  {
    title: 'Punctuality',
    icon: '⏰',
    content: 'Being on time is crucial. Arrive 5-10 minutes early for meetings. Being late is considered disrespectful.',
  },
  {
    title: 'Directness',
    icon: '🗣️',
    content: 'Finns are direct and honest. Small talk is minimal. "How are you?" is a genuine question, not just a greeting.',
  },
  {
    title: 'Coffee Culture',
    icon: '☕',
    content: 'Finns drink 10kg of coffee per person yearly—the highest in the world! Coffee breaks (kahvitauko) are sacred at work.',
  },
];

export function DialectSelector() {
  const [selectedDialect, setSelectedDialect] = useState('standard');
  const dialect = dialects.find(d => d.id === selectedDialect) || dialects[0];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dialects & Culture</h1>
        <p className="text-gray-600">
          Explore Finnish dialects and learn cultural insights for better integration
        </p>
      </div>

      {/* Dialect Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {dialects.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDialect(d.id)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedDialect === d.id
                ? `${d.color} text-white`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            {d.name}
          </button>
        ))}
      </div>

      {/* Dialect Info Card */}
      <Card className="mb-8 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-16 h-16 ${dialect.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{dialect.name}</h2>
            <p className="text-gray-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {dialect.region}
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{dialect.description}</p>

        {/* Features */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Key Features
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {dialect.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-700"
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="space-y-3">
            {dialect.examples.map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Standard: {ex.standard}</p>
                  <p className={`font-medium ${selectedDialect === 'standard' ? 'text-gray-900' : dialect.color.replace('bg-', 'text-')}`}>
                    {selectedDialect === 'standard' ? 'Standard' : dialect.name.split(' ')[0]}: {ex.dialect}
                  </p>
                </div>
                <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-lg">
                  {ex.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Cultural Notes */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Cultural Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {culturalNotes.map((note) => (
            <Card key={note.title} className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{note.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{note.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{note.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
