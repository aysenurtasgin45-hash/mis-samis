# SAMIS Backend Setup

## Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Run `supabase/seed.sql` for starter municipality, facility, animal, and operation data.
4. Copy project URL and anon key into `.env`:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Local install

This project now depends on the Supabase JS client:

```bash
npm install
npm run lint
npm run build
```

## Vercel

Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values in Vercel project environment variables. `vercel.json` is configured to serve the Vite SPA from `dist`.
