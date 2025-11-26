# RecipeBook (Expo + Supabase)

An Expo Router app for saving recipes, planning meals, building grocery lists, and managing your profile with Supabase auth and storage.

## Features
- Create and browse recipes with photo uploads.
- Plan meals for each day and jump into recipe details.
- Build a grouped grocery list, check off items, clear completed, and export/share.
- Profile management with avatar upload, Supabase authentication, and theming.
- React Query with persisted cache for fast, offline-friendly reads.

## Getting Started
1) Install dependencies
```bash
npm install
```

2) Configure Supabase env vars (required for auth/storage)
Create a `.env` file (or use `app.config.ts`/`app.json`) with:
```bash
EXPO_PUBLIC_SUPABASE_URL=<your-supabase-url>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

3) Run the app
```bash
npx expo start
```
Open on a device/emulator via the QR code or Expo Go.

## Project Notes
- File-based routing lives under `app/` (tabs for recipes, meal plan, grocery, profile).
- Supabase client is configured in `supabase/client.ts` and expects the env vars above.
- Grocery and meal plan data use TanStack Query with AsyncStorage persistence for smoother reloads.
