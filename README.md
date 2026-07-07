# IT Floor Assistant

A calm, mobile-first troubleshooting coach for a hotel IT technician walking the property. Fast issue
lookup first, AI as an optional fallback — not the other way around.

## Features

- **Home**: one search box plus 8 large issue-category buttons (Payment/POS, Printer, Outlook/Email,
  Teams/Microsoft 365, MFA/Login, Wi-Fi/Network, Laptop/Device, New User Setup) and an Ask AI tile.
- **Search**: type a phrase (e.g. "printer offline", "MFA new phone") and get a best-match summary —
  likely affected layers, the best first question to ask, and Start Flow / Quick Fix / Commands / More
  Help actions — plus a secondary list of other possible matches.
- **KB**: browse all issues grouped by category, with a Favorites section at the top (stored in
  localStorage).
- **Issue pages** (`/issues/[id]`): do this first, layer-by-layer checks, where to check in
  Windows/admin portals, commands, when to escalate, a ticket note template, related KB articles, and
  YouTube search links.
- **Notes**: quick-capture field notes and anything saved from an issue or an AI answer, stored in
  localStorage.
- **Ask AI** (`/ai` + `/api/ai`): optional fallback for issues not yet in the KB. Grounds its answer in
  the closest KB matches when relevant, and returns a structured, mobile-friendly result — likely causes,
  top checks, commands/settings, do-not-touch items, when to escalate, and a ticket note. Falls back to a
  local KB-grounded answer if OpenAI is unavailable.
- Safety guardrails block guest data, payment data, passwords, internal IPs, server names, and
  confidential details before they reach the AI, and the AI is instructed to never ask for them either.
- Light/dark theme toggle.

## Data

The knowledge base is static TypeScript data (`src/lib/kb-data.ts`) — no database required. Favorites
and notes live in the browser's localStorage (`src/lib/storage.ts`).

## Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
OPENAI_API_KEY=
```

Without a key, Ask AI still works — it returns a KB-grounded local answer instead of calling OpenAI.

## Run

```bash
npm install
npm run dev
```
