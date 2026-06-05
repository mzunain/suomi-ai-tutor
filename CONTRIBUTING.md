# Contributing

Thanks for helping improve SuomiAI. Keep changes focused, verify them locally, and prefer practical Finnish-learning value over generic language-app features.

## Local Setup

```bash
npm install --ignore-scripts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

Run both checks before opening a PR:

```bash
npm run lint
npm run build
```

## Environment

The app works without environment variables. Optional database and auth features use:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Adding Lessons

- Add lesson content in `src/data/lessons.ts`.
- Keep examples practical: work, healthcare, groceries, public services, social situations.
- Include Finnish, English, difficulty level, XP, and cultural context when relevant.
- Prefer real-life phrases over isolated vocabulary lists.

## Adding Translations

- Update `src/i18n/translations.ts`.
- Keep UI labels short enough for mobile navigation and compact controls.
- Check long strings in Arabic, Persian, Russian, Turkish, and Somali where possible.

## Code Style

- Follow the existing component structure under `src/components/`.
- Keep browser-only behavior inside client components.
- Avoid adding new dependencies unless they solve a clear product or engineering problem.
- Do not commit generated build output unless the repository already expects it for that path.
