# Skinstinct Content Engine — Case 1 / Meera

Telegram note → score → (optional) news angle → draft in Meera's voice → back to Telegram → APPROVE/REJECT → Supabase.
Built to match the Execution Plan exactly (L3 + B1 checkpoints). Nothing auto-publishes — see `THE CUT` below.

## What's already done for you in this folder

- `voice-skill.txt` — the Voice Skill, already written from the 15 published pieces (the checkpoint L3·1 step).
  You don't need to redo the Claude-browser voice-profiling step; you can still refine it if it feels off once you see real drafts.
- `scoring-and-drafts-demo.md` — a hand-run demo of the full pipeline (scoring, news angle, drafting) against
  the 5 sample notes you have, showing exactly what Telegram would receive for each.
- All the application code (`api/`, `lib/`) implementing L3·2, L3·3, and all three B1 checkpoints.
- `supabase/schema.sql` — the three tables from checkpoint B1·3, ready to run as-is.

## What only you can do (needs your accounts / phone)

1. **Telegram + bot** — follow `MESA_Case01_Telegram Setup.pdf` in your case folder exactly (channel → BotFather → add bot as admin → get chat ID via @userinfobot). You should already have this from before the 23 Sept session.
2. **Get API keys**
   - Gemini: https://aistudio.google.com/ → Get API key
   - Anthropic (Claude): https://console.anthropic.com/ → API Keys
   - Supabase: create a free project at https://supabase.com/ → Settings → API for the URL and `service_role` key
3. **Run the schema** — paste `supabase/schema.sql` into the Supabase SQL editor and run it once.
4. **Push this project to GitHub**, then **import it into Vercel**.
5. **Set environment variables in Vercel** (Project → Settings → Environment Variables) — copy every key from `.env.example` with your real values. Redeploy after adding them.
6. **Point Telegram at your deployment** — in a browser, visit:

   ```
   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<YOUR_VERCEL_URL>/api/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>
   ```

   You should see `{"ok":true,...}`. (Include `&secret_token=...` only if you set `TELEGRAM_WEBHOOK_SECRET` in step 5 — it's optional but cheap insurance against random POSTs to your endpoint.)

7. **Test**: send a strong note (e.g. the Note 01 text from your dataset) to your capture channel. Within a few seconds you should get either a draft with `Reply APPROVE or REJECT to this message.` at the bottom, or a rejection with a one-line reason. Reply `APPROVE` under the draft and confirm in Supabase (`drafts` table) that its `status` flips to `approved`.

## How it maps to the Execution Plan

| Checkpoint | Where it lives |
|---|---|
| L3·1 Voice Skill | `voice-skill.txt` (already written) |
| L3·2 Build the project | this whole repo |
| L3·3 Connect and test | the `setWebhook` step above |
| B1·1 Scoring | `lib/gemini.js#scoreNote`, gate in `api/webhook.js#handleNewNote` |
| B1·2 News angle | `lib/gemini.js#extractKeywords` + `lib/news.js#fetchTopNews`, verify-flag block in `api/webhook.js` |
| B1·3 Memory | `lib/supabase.js`, `supabase/schema.sql`, APPROVE/REJECT handling in `api/webhook.js#handleDecision` |
| Final 15 min — model comparison | set `DRAFT_MODEL=gemini` vs `DRAFT_MODEL=claude` in Vercel env vars and re-send the same note to compare |

## THE CUT — why there's no auto-publish button

Per the Nine Checks (see the filled Solution Template), check 07 — Judgment Protected — fails for
auto-scheduling: Meera explicitly rejected two consultants who offered end-to-end tools, because she
wants to remain the author of everything published. `APPROVE` in this system only updates a database
row so Meera and future-you can see what got greenlit; it never calls the LinkedIn API. Publishing stays
a manual, deliberate act on her side. Do not wire this up to auto-post — that rebuilds the exact thing
she said no to.

## Local dev

```bash
npm install
npx vercel dev
```

`vercel dev` will serve `/api/*` on `http://localhost:3000`. To test the webhook locally you'll need a
tunnel (e.g. `npx localtunnel --port 3000` or `ngrok http 3000`) and a temporary `setWebhook` call pointed
at the tunnel URL — swap it back to your real Vercel URL afterward.
