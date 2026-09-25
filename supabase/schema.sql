-- Case 1 / Meera — memory layer (checkpoint B1.3)
-- Run this once in the Supabase SQL editor for your project.

create table if not exists notes (
  id bigint generated always as identity primary key,
  telegram_message_id bigint,
  raw_text text not null,
  score numeric,
  score_reason text,
  status text not null default 'received', -- received | scored_rejected | scored_passed
  created_at timestamptz not null default now()
);

create table if not exists drafts (
  id bigint generated always as identity primary key,
  note_id bigint references notes(id) on delete cascade,
  draft_text text not null,
  news_headline text,
  news_source text,
  news_date text,
  news_link text,
  model_used text,           -- 'claude' or 'gemini'
  status text not null default 'pending', -- pending | approved | rejected
  telegram_message_id bigint, -- the id of the message the draft was sent as, so replies can be matched
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists voice_skill (
  id bigint generated always as identity primary key,
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Rejected notes and rejected drafts are kept, not deleted (per the brief) —
-- there is no delete path in the app code; status is the only thing that changes.

create index if not exists idx_drafts_note_id on drafts(note_id);
create index if not exists idx_notes_status on notes(status);
create index if not exists idx_drafts_status on drafts(status);
