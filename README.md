# MIS SAMIS Dashboard

A Vercel-ready Management Information System dashboard built with Next.js and Supabase.

## Dashboards

- Admin Dashboard
- Manager Dashboard
- Staff Dashboard

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add your Supabase anon key.

3. Run the app:

```bash
npm run dev
```

## Supabase

The schema and mock data live in `supabase/schema.sql`. It creates 10 MIS tables and inserts at least 10 mock rows into each table.

For Vercel, add these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
