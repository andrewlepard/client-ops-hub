## Client Ops Hub

Starter project for a demo SaaS app using [Next.js](https://nextjs.org), TypeScript, Tailwind CSS, and Supabase.

## Local setup

1. Install dependencies if needed:

```bash
npm install
```

2. Copy the environment example:

```bash
cp .env.local.example .env.local
```

3. Add your Supabase values to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Included now

- Next.js App Router with TypeScript
- Tailwind CSS
- Supabase packages: `@supabase/supabase-js` and `@supabase/ssr`
- Minimal browser/server Supabase helper files

## Not built yet

- Authentication UI
- Database schema
- Dashboard pages
- Vercel deployment config

Those can be added next once your Supabase project is ready.
