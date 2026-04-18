# Memoria OS

Memoria OS is a multi-app platform for Alzheimer's support:

- `supabase/`: database schema, RLS policies, and seed data.
- `packages/shared/`: shared memory graph and prompt builder utilities.
- `apps/caregiver-web/`: React + Tailwind caregiver dashboard.
- `apps/patient-mobile/`: Expo React Native patient-facing app.
- `apps/backend/`: secure API for Whisper, Claude, ElevenLabs, and D-ID.
- `apps/desktop-agent/`: Electron tray app for wake phrase and offline sync scaffolding.

## Quick start

1. Copy `.env.example` to `.env` and fill in values.
2. Run Supabase migrations from `supabase/schema.sql`, then `supabase/seed.sql`.
3. Install dependencies in each app and run:
   - Backend API: `npm run dev` in `apps/backend`
   - Caregiver web: `npm run dev` in `apps/caregiver-web`
   - Patient mobile: `npx expo start` in `apps/patient-mobile`
   - Desktop agent: `npm run dev` in `apps/desktop-agent`

## Security

- Never hardcode API keys in source files.
- Use service role key only in trusted backend/server environments.
- Patient data is protected through row-level security policies.
