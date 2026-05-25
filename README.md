# SuomiAI — Finnish Language Learning App

> A competitive, feature-rich Finnish language tutor built with Next.js 16, deployed on Vercel.

**Live:** [suomi-ai-tutor.vercel.app](https://suomi-ai-tutor.vercel.app)

---

## Features

| Module | Details |
|---|---|
| 📚 **Lesson Library** | 50+ lessons across A1–B2, Duolingo-style path view, Word of the Day, search & level filter |
| ❤️ **Lesson Player** | 5-hearts lives system, multiple-choice & fill-in, green/red feedback bar, confetti on completion |
| 🧠 **Flashcards** | SM-2 spaced repetition algorithm, category filter, flip animations |
| 💬 **Chat Practice** | 8 real-world scenarios (café, doctor, workplace…), pick-a-response dialogue engine |
| 🏆 **Gamification** | XP, levels, daily streaks, weekly leaderboard, achievement badges |
| 🗺️ **Dialects & Culture** | Standard Finnish, Turku dialect, Helsinki slang + 6 cultural insight cards |
| 🌐 **8-Language UI** | English, Finnish, Swedish, Arabic, Russian, Persian, Turkish, Somali |
| 🔐 **Auth (WIP)** | Google OAuth + cloud progress sync via NextAuth + Prisma (PR #4) |

---

## Tech Stack

- **Framework**: Next.js 16.2.2 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4, framer-motion
- **Auth**: NextAuth v4 (Google OAuth)
- **Database**: PostgreSQL via Prisma 7 (optional — app runs fully without it)
- **Deployment**: Vercel (Frankfurt `fra1` region)
- **CI/CD**: GitHub Actions → `vercel deploy --prod` on push to `main`

---

## Getting Started

### Requirements

- **Node.js >= 20.9.0** (use `nvm use 20` if you have nvm)
- npm 10+

### Run locally

```bash
# Install dependencies
npm install --ignore-scripts

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

---

## Environment Variables

The app runs without any env vars (database features gracefully degrade to stubs).

To enable auth + cloud sync, create `.env.local`:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/
│   │   ├── auth/           # NextAuth handler
│   │   ├── challenges/     # Daily challenges API
│   │   └── pronunciation/  # Pronunciation API
│   └── page.tsx            # Root layout with sidebar nav
├── components/
│   ├── chat/               # ChatPractice — scenario dialogue engine
│   ├── dialects/           # DialectSelector + cultural notes
│   ├── flashcards/         # FlashcardSystem with SM-2 algorithm
│   ├── gamification/       # GamificationDashboard (XP / leaderboard / achievements)
│   ├── lessons/            # LessonLibrary + LessonPlayer
│   ├── onboarding/         # OnboardingFlow
│   └── ui/                 # Shared components (Button, Card, LanguageSwitcher…)
├── data/
│   └── lessons.ts          # 50+ lesson definitions
├── hooks/
│   └── useTranslation.ts   # i18n hook (8 languages, localStorage-backed)
└── lib/
    └── prisma.ts           # Null-safe Prisma client (stubs when no DATABASE_URL)
```

---

## Deployment

Push to `main` → GitHub Actions builds and deploys to Vercel automatically.

Manual deploy:
```bash
VERCEL_ORG_ID=<org-id> VERCEL_PROJECT_ID=<project-id> npx vercel deploy --prod
```

---

## Roadmap

- [ ] Merge PR #4 — Google OAuth + cloud sync (needs `DATABASE_URL` set in Vercel)
- [ ] Audio pronunciation (Web Speech API / TTS)
- [ ] Grammar exercises with case drills
- [ ] Offline PWA support
- [ ] Mobile app (React Native / Expo)
