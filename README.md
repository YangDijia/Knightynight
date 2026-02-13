<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1gTBm1DazFz2z1Nj1fNRIFSuBp1luOgu5

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create `.env.local` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Initialize your Supabase tables by running the SQL in `supabase/schema.sql` (Supabase SQL Editor).
4. Run the app:
   `npm run dev`

## Supabase migration notes

This project now uses Supabase instead of Firestore for:
- Bench resting state (`bench_status`)
- Message board notes and comments (`notes`)
- Mood calendar entries (`calendar_entries`)

If you are migrating existing Firestore data, export your Firestore collections and import them into the matching Supabase tables.

## Bench ambient audio files

To make the Bench ambience sliders work, add these files under `public/audio/`:

- `public/audio/fire.mp3`
- `public/audio/wind.mp3`
- `public/audio/greenpath.mp3`

These names are hard-coded in `pages/TheBench.tsx`.
