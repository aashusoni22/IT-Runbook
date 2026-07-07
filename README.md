# Hotel IT Field Assistant

Mobile-first, AI-assisted Next.js knowledge base and troubleshooting assistant for hotel IT support teams.

## Features

- AI Assist: describe an issue in plain language and get a triaged, step-by-step fix. Grounded in the
  property's KB when a match exists (RAG-style, via `/api/assist`), with a structured JSON response
  (urgency, likely cause, quick fix, steps, commands, escalation, ticket template) and a safe local
  fallback when OpenAI is unavailable.
- Urgency triage badges (low/medium/high/critical) so a new tech knows how fast to move.
- Home screen with the AI Assist box front and center, emergency quick actions, category buttons, and favorites.
- Supabase-backed `kb_articles` knowledge base with graceful fallback to curated sample data.
- Search across title, category, symptoms, steps, commands, tags, and notes.
- Article detail pages for symptoms, quick fix, steps, commands, escalation notes, and ticket templates.
- Add article form and "Save as KB draft" from an AI Assist result.
- Favorites through the `is_favorite` boolean.
- Light/dark theme toggle.
- Safety guardrails: blocks guest data, payment data, passwords, internal IPs, and confidential details
  before they reach the AI.

## Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is optional for read-only local exploration, but recommended for draft inserts from API routes.

## Supabase schema

```sql
create table if not exists kb_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  impact text,
  beginner_summary text,
  estimated_time text,
  equipment text[] not null default '{}',
  symptoms text[] not null default '{}',
  quick_fix text not null,
  steps text[] not null default '{}',
  layers jsonb not null default '[]'::jsonb,
  navigation_steps jsonb not null default '[]'::jsonb,
  commands text[] not null default '{}',
  command_blocks jsonb not null default '[]'::jsonb,
  escalation_notes text not null default '',
  ticket_template text not null default '',
  references jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kb_articles_favorite_idx on kb_articles (is_favorite);
create index if not exists kb_articles_updated_at_idx on kb_articles (updated_at desc);
```

## Run

```bash
npm install
npm run dev
```
