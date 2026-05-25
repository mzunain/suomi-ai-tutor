'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Language } from '@/i18n/translations';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'so', label: 'Soomaali', flag: '🇸🇴' },
];

export function LanguageSwitcher({ language, onLanguageChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm"
        aria-label="Change interface language"
      >
        <Globe className="w-4 h-4" />
        <span>{current.flag} {current.label}</span>
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 min-w-[160px]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onLanguageChange(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                lang.code === language ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
