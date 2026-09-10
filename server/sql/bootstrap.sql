-- ============================================================
--  גוב ארי — CANONICAL DATABASE BOOTSTRAP  (Phase 8)
--
--  מטרה: לאתחל מסד PostgreSQL / Supabase *ריק לגמרי* למצב שהאפליקציה מצפה לו,
--  כולל הקשחת אבטחת PII באותה הרצה (Phase 9 — לא "יוצרים עכשיו, מאבטחים אחר כך").
--
--  תכונות:
--   • idempotent — בטוח בהרצה חוזרת (CREATE ... IF NOT EXISTS / OR REPLACE / guarded DO).
--   • deterministic — אין תלות בסדר חיצוני, אין נתונים אקראיים.
--   • לא הרסני — אין DROP TABLE / DROP COLUMN / DELETE / UPDATE של נתונים.
--   • זהה בתוכן ל-migrations/001_init_leads.sql + 002_rls_grants.sql, מאוחד, + טבלת orders.
--
--  שימוש: Supabase → SQL Editor → הדבק → Run. ואז הרץ server/sql/inspect_readonly.sql לאימות.
--  (בזמן ריצה האפליקציה גם מריצה 001+002 אוטומטית בכל cold start — הכול idempotent.)
--
--  לא נבדק מול Postgres חי בסביבה הזו (אין psql/Docker מקומי). נבדק סטטית בלבד.
-- ============================================================

begin;

-- ---- extensions ----
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ============================================================
--  1. leads — רשומה קנונית אחת ללקוח (מפתח = טלפון מנורמל)
-- ============================================================
create table if not exists public.leads (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),

  full_name                 text not null,
  phone_raw                 text not null,
  phone_normalized          text not null,
  city                      text,
  email                     text,
  notes                     text,

  status                    text not null default 'new',
    -- new | contacted | qualified | installation_scheduled | won | lost

  source                    text,
  page_url                  text,
  referrer                  text,
  landing_page              text,
  utm_source                text,
  utm_medium                text,
  utm_campaign              text,
  utm_content               text,
  utm_term                  text,
  fbclid                    text,
  gclid                     text,
  fbp                       text,
  fbc                       text,

  user_agent                text,
  submissions_count         integer not null default 1,

  contacted_at              timestamptz,
  installation_scheduled_at timestamptz,
  closed_at                 timestamptz
);

create unique index if not exists leads_phone_normalized_key on public.leads (phone_normalized);
create index if not exists leads_created_at_idx  on public.leads (created_at desc);
create index if not exists leads_status_idx      on public.leads (status);
create index if not exists leads_utm_campaign_idx on public.leads (utm_campaign);

-- ============================================================
--  2. lead_submissions — כל הגשה נשמרת (append-only), גם חוזרת
-- ============================================================
create table if not exists public.lead_submissions (
  id                uuid primary key default gen_random_uuid(),
  lead_id           uuid not null references public.leads (id) on delete cascade,
  created_at        timestamptz not null default now(),

  full_name         text,
  phone_raw         text,
  phone_normalized  text,
  city              text,
  email             text,
  notes             text,

  page_url          text,
  referrer          text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_content       text,
  utm_term          text,
  fbclid            text,
  gclid             text,
  fbp               text,
  fbc               text,

  user_agent        text,
  ip_hash           text,          -- SHA-256(ip + IP_HASH_SALT), 32 hex — לא שומרים IP גולמי
  idempotency_key   text           -- מונע כפילות בלחיצה כפולה / retry
);

create index if not exists lead_submissions_lead_id_idx on public.lead_submissions (lead_id);
create index if not exists lead_submissions_created_at_idx on public.lead_submissions (created_at desc);
create unique index if not exists lead_submissions_idem_idx
  on public.lead_submissions (idempotency_key) where idempotency_key is not null;

-- ============================================================
--  3. lead_events — outbox עמיד (כתיבת הליד לא תלויה בו)
-- ============================================================
create table if not exists public.lead_events (
  id                uuid primary key default gen_random_uuid(),
  lead_id           uuid not null references public.leads (id) on delete cascade,
  submission_id     uuid references public.lead_submissions (id) on delete set null,

  event_type        text not null,                    -- ADMIN_EMAIL | META_CAPI | SHEET_BACKUP
  status            text not null default 'pending',  -- pending | processing | done | failed
  attempts          integer not null default 0,
  next_attempt_at   timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  processed_at      timestamptz,
  last_error        text,
  payload           jsonb
);

create index if not exists lead_events_due_idx on public.lead_events (status, next_attempt_at);
create index if not exists lead_events_lead_id_idx on public.lead_events (lead_id);

-- ============================================================
--  4. orders — נתיב הזמנה ישירה (נשאר לתאימות; לא בשימוש במשפך הליד)
--     בקוד נוצר עצלנית ע"י server/src/orders.js; יוצרים כאן מראש כדי ש-RLS יחול מיד.
-- ============================================================
create table if not exists public.orders (
  id          text primary key,
  created_at  timestamptz not null default now(),
  status      text not null,
  amount      integer not null,
  email       text,
  data        jsonb not null
);

-- ============================================================
--  5. trigger: updated_at על leads
-- ============================================================
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================
--  6. אבטחת PII — RLS + שלילת הרשאות מתפקידי PostgREST
--     RLS פעיל + אפס policies + לא FORCE = deny-all לכל תפקיד שאינו הבעלים.
--     האפליקציה מתחברת כבעלים (postgres) דרך ה-pooler → עוקפת RLS → ממשיכה לעבוד.
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array['leads','lead_submissions','lead_events','orders']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('revoke all on public.%I from authenticated', t);
    execute format('revoke all on public.%I from public', t);
  end loop;
end $$;

-- רצפים (אין serial כרגע — הגנה עתידית)
do $$
declare s text;
begin
  for s in select sequence_name from information_schema.sequences where sequence_schema = 'public'
  loop
    execute format('revoke all on sequence public.%I from anon, authenticated', s);
  end loop;
end $$;

commit;

-- ============================================================
--  אימות מהיר (קרא-בלבד) — אמור להחזיר 4 שורות, rls_enabled = true בכולן
-- ============================================================
-- select c.relname, c.relrowsecurity as rls_enabled
-- from pg_class c join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname='public' and c.relname in ('leads','lead_submissions','lead_events','orders')
-- order by 1;
