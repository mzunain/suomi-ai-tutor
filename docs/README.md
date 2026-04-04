# suomi-ai-tutor

> AI-powered Finnish language learning app for immigrants in Finland — Tervetuloa!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-Next.js%20%2B%20OpenAI%20Whisper-black)
![Language](https://img.shields.io/badge/language-Finnish%20%2F%20English-blue)
![City](https://img.shields.io/badge/city-Turku%20%7C%20Helsinki-brightgreen)

## The Problem

Finland has a major immigrant integration challenge. The Finnish government spends millions on language courses through TE-services, but classroom learning is slow, expensive, and not personalized. Most language apps don’t support Finnish properly — the grammar is too complex, and there is zero local cultural context.

I built SuomiAI specifically for immigrants in Turku and Helsinki who need to learn Finnish to get a job and integrate into Finnish society.

## Why Finnish Is Uniquely Difficult

- **15 grammatical cases** (English has 2)
- **Agglutinative morphology** — words can be 30+ characters long
- **Vowel harmony** — front/back vowel rules affect every suffix
- **Dialect differences** — Turku Finnish vs Helsinki Finnish are noticeably different
- **No gender articles** but complex case system replaces them

SuomiAI handles all of this with AI-powered explanations in plain English.

## Features

- **Speech recognition** — OpenAI Whisper for pronunciation feedback
- **Pronunciation scoring** — phoneme-level accuracy analysis
- **Gamified lessons** — streaks, XP, level-up system
- **Dialect mode** — Turku dialect vs standard Finnish vs Helsinki dialect
- **Cultural context** — tips about Finnish workplace culture, social norms, and local customs
- **Vocabulary flashcards** — spaced repetition system
- **Grammar drills** — case endings, verb conjugation, sentence construction
- **Offline mode** — PWA with offline lesson access

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (PWA), Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Speech | OpenAI Whisper API |
| LLM | GPT-4o (explanation generation) |
| Database | PostgreSQL (progress), Redis (session) |
| Auth | NextAuth.js |

## Sample Finnish Lessons Covered

- Greetings: Hei, Moi, Terve (with Turku dialect variants)
- Numbers: Yksi, kaksi, kolme...
- At the grocery store (kaupassa)
- At the doctor’s office (lääkärillä)
- Job interview Finnish
- Workplace small talk

## Roadmap

- [x] Repository setup and architecture
- [ ] Onboarding flow with level assessment
- [ ] Core lesson player (vocabulary + grammar)
- [ ] Whisper pronunciation checker
- [ ] Spaced repetition flashcard system
- [ ] Gamification (XP, streaks, badges)
- [ ] Turku dialect mode
- [ ] PWA offline support
- [ ] Live demo deployment

## License

MIT — see [LICENSE](LICENSE)
