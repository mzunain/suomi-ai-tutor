# SuomiAI-Tutor: Product Strategy & Architecture

## Product Vision
**Mission:** The most effective Finnish language learning platform for immigrants in Finland — combining AI-powered personalization, dialect authenticity, and cultural integration support.

## Competitor Analysis

### Duolingo Finnish (Primary Competitor)
**Strengths:**
- Gamified engagement (streaks, XP, leaderboards)
- Large user base, free access
- Mobile-first experience

**Weaknesses/Gaps:**
- ❌ No grammar explanations for Finnish cases (15 cases not explained)
- ❌ Zero dialect support (Turku vs Helsinki differences ignored)
- ❌ Weak pronunciation feedback (just green/red, no phoneme analysis)
- ❌ Generic content, not tailored for immigrants
- ❌ No workplace/job interview Finnish
- ❌ No cultural context (small talk, social norms)
- ❌ No vowel harmony instruction
- ❌ No offline mode for refugees with limited connectivity

### Babbel
**Strengths:**
- Structured lessons with grammar explanations
- Speech recognition

**Weaknesses:**
- ❌ **Does NOT support Finnish at all**

### Busuu
**Strengths:**
- Community corrections
- Structured courses

**Weaknesses:**
- ❌ Generic approach, not Finnish-specific
- ❌ Limited grammar depth
- ❌ No dialect support

### Other Apps (Memrise, Drops, etc.)
- Focus on vocabulary only
- No speaking practice
- No cultural integration features

## SuomiAI Competitive Differentiation

### 1. Finnish Grammar Mastery (Competitors Missing)
- **Case Explorer:** Interactive visualization of 15 Finnish grammatical cases
- **Vowel Harmony Trainer:** Visual + audio feedback for front/back vowel rules
- **Agglutination Builder:** Drag-and-drop word building showing suffix stacking
- **Consonant Gradation:** Visual rules for k→kk→∅ patterns

### 2. Dialect Authenticity (Unique Feature)
- **Standard Finnish:** Yleiskieli (formal/written)
- **Helsinki Dialect:** Stadin slangi, urban variations
- **Turku Dialect:** Turun murre, local expressions
- **Dialect Toggle:** Switch anytime during lessons

### 3. Immigrant-First Curriculum (Competitors Missing)
- **TE-Services Module:** Job application vocabulary, unemployment office interactions
- **Job Interview Finnish:** Mock interviews with AI feedback
- **Workplace Integration:** Small talk, coffee room conversations, email etiquette
- **Housing & Living:** Vuokra (rent), sähkö (electricity), vuokrasopimus (lease)
- **Healthcare Finnish:** Lääkärillä (at doctor), apteekki (pharmacy)
- **Integration Exam Prep:** YKI test preparation (Finnish citizenship requirement)

### 4. AI-Powered Personalization (Superior to Competitors)
- **Adaptive Difficulty:** LLM adjusts lesson complexity based on performance
- **Error Analysis:** Not just "wrong" but "you used partitive case, accusative needed here"
- **Cultural Q&A:** Ask "Why do Finns say X?" during lessons
- **Pronunciation Coach:** Phoneme-level feedback using Whisper API

### 5. Cultural Integration Layer (Unique)
- **Sisu & Silence:** Understanding Finnish communication style
- **Sauna Etiquette:** Cultural do's and don'ts
- **Work Culture:** Hierarchy, directness, meeting protocols
- **Seasonal Life:** Juhannus, vappu, Christmas traditions
- **Small Talk Guide:** Weather, cottage life, ice hockey as conversation starters

### 6. Accessibility & Inclusion (Competitors Weak)
- **Offline PWA:** Learn without internet (critical for refugees)
- **Progressive Proficiency:** YKI levels A1 → A2 → B1 → B2 tracking
- **Multi-language UI:** English, Arabic, Somali, Russian interfaces
- **Audio-First Mode:** For low-literacy learners

## Target User Personas

### Primary: Ahmed (Syrian Refugee, Turku)
- 28 years old, works in cleaning services
- Needs Finnish for job advancement, citizenship
- Studies evenings, limited internet
- Pain points: Understanding Turku dialect at work, TE-services bureaucracy

### Secondary: Maria (Spanish Professional, Helsinki)
- 32 years old, software engineer
- Needs Finnish for workplace integration, networking
- Pain points: Small talk, understanding "Finnish silence", professional emails

### Tertiary: Li (Chinese Student, Tampere)
- 24 years old, university student
- Needs Finnish for part-time work, integration
- Pain points: Pronunciation, grammar cases, making friends

## Feature Roadmap (MVP → Scale)

### Phase 1: Core Foundation (Week 1-2)
- [x] Project architecture & tech stack
- [x] Database schema & models
- [ ] User onboarding with level assessment
- [ ] Basic lesson player (vocabulary + grammar)
- [ ] Speech recognition integration (Whisper)

### Phase 2: Learning Engine (Week 2-3)
- [ ] Spaced repetition system (SM-2 algorithm)
- [ ] Gamification (XP, streaks, badges)
- [ ] Progress tracking dashboard
- [ ] Offline PWA support

### Phase 3: Finnish Specialization (Week 3-4)
- [ ] Case explorer interactive tool
- [ ] Dialect mode (Turku/Helsinki/Standard)
- [ ] Grammar drill mini-games
- [ ] Vowel harmony visualizer

### Phase 4: Immigrant Integration (Week 4-5)
- [ ] Workplace Finnish module
- [ ] Job interview simulator
- [ ] Cultural context cards
- [ ] YKI test prep mode

### Phase 5: AI Enhancement (Week 5-6)
- [ ] AI conversation partner
- [ ] Error explanation engine
- [ ] Personalized lesson recommendations
- [ ] Cultural Q&A chatbot

### Phase 6: Community & Scale (Week 6-7)
- [ ] Leaderboards & challenges
- [ ] Study groups
- [ ] Tutor marketplace integration
- [ ] Analytics dashboard for educators

## Technical Architecture

### Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 18, TypeScript, Tailwind CSS |
| State | Zustand (client), React Query (server) |
| Backend | Next.js API Routes, tRPC |
| Database | PostgreSQL (Prisma ORM) |
| Cache | Redis (sessions, streaks) |
| Auth | NextAuth.js (email, Google) |
| Speech | OpenAI Whisper API (fallback: Web Speech API) |
| AI/LLM | GPT-4o-mini for explanations (cost-effective) |
| Storage | Supabase Storage (audio recordings) |
| Deployment | Vercel |

### Database Schema (Simplified)
```
User
├── profile (name, native_language, goals)
├── progress (xp, streak, level)
├── dialect_preference (standard|turku|helsinki)
└── yki_level (A1|A2|B1|B2)

Lesson
├── title, description, difficulty
├── category (grammar|vocabulary|culture|workplace)
├── dialect_variants (turku_content, helsinki_content)
└── exercises[]

Exercise
├── type (multiple_choice|speaking|typing|matching)
├── finnish_text, english_translation
├── grammar_focus (case|verb|vowel_harmony)
├── audio_url
└── pronunciation_guide

UserProgress
├── user_id, lesson_id, completed_at
├── score, time_spent, attempts
└── pronunciation_scores[]

Flashcard
├── user_id, word_id
├── next_review (SRS)
├── interval, ease_factor
└── review_count
```

### Key Components

#### 1. Pronunciation Engine
- Record user audio (MediaRecorder API)
- Send to Whisper API for transcription
- Compare with target text
- Phoneme-level diff analysis
- Visual feedback (waveform + scoring)

#### 2. Grammar Case Explorer
- Interactive SVG diagrams
- Case selection tool
- Example sentence builder
- Visual highlighting of case endings

#### 3. Dialect Manager
- Content variant system
- Audio variant mapping
- Regional vocabulary substitutions
- Toggle component (persistent preference)

#### 4. SRS (Spaced Repetition)
- SM-2 algorithm implementation
- Review scheduling
- Difficulty adjustment
- Mastery tracking

## Success Metrics (KPIs)

### Engagement
- DAU/MAU ratio (target: >30%)
- Average session duration (target: >15 min)
- Lesson completion rate (target: >70%)
- Streak retention (target: >40% at 7 days)

### Learning Outcomes
- Words learned per week (target: >50)
- Pronunciation accuracy improvement (target: +20% in 4 weeks)
- Grammar test scores (target: +30% in 8 weeks)
- User-reported confidence (target: 4.2/5)

### Retention
- Day 7 retention (target: >50%)
- Day 30 retention (target: >30%)
- Paywall conversion (if freemium) (target: >5%)

## Go-to-Market

### Launch Strategy
1. **Beta:** Turku immigrant organizations, TE-services
2. **Launch:** Helsinki & Turku Facebook groups, Reddit r/LearnFinnish
3. **Growth:** Partnership with Finnish adult education centers (kansalaisopisto)
4. **Scale:** Integration with employer programs (KONE, Nokia, etc.)

### Pricing (Future)
- **Free:** Basic lessons, 10 min/day speaking, ads
- **Pro (€9.99/mo):** Unlimited, dialects, offline, AI tutor
- **Institution (€49/mo):** Class management, analytics, assignments

## Immediate Next Steps
1. Set up project structure with Next.js 15
2. Configure database with Prisma
3. Build authentication system
4. Create onboarding flow with level assessment
5. Implement basic lesson player
6. Add pronunciation checker with Whisper
7. Build gamification layer
8. Add Finnish-specific grammar tools
9. Create immigrant-focused content modules
10. Deploy and gather feedback
