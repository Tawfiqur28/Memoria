create extension if not exists "pgcrypto";

create table if not exists public.patient_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  age int not null check (age > 0),
  phone_number text,
  hometown text,
  spouse_name text,
  children jsonb default '[]'::jsonb,
  pets jsonb default '[]'::jsonb,
  hobbies jsonb default '[]'::jsonb,
  daily_routine jsonb default '[]'::jsonb,
  trigger_topics text[] default '{}',
  consent_archive_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  full_name text not null,
  relationship text not null,
  phone_number text not null,
  photo_url text not null,
  memory_notes text[] default '{}',
  shared_memories jsonb default '[]'::jsonb,
  last_interaction_at timestamptz,
  city text,
  created_at timestamptz default now()
);

create unique index if not exists contacts_patient_phone_key
  on public.contacts(patient_id, phone_number);

create table if not exists public.life_facts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  category text not null,
  fact text not null,
  created_at timestamptz default now()
);

create table if not exists public.caregivers (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  full_name text not null,
  email text,
  phone_number text,
  push_token text,
  created_at timestamptz default now()
);

create table if not exists public.session_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  source text not null check (source in ('mobile', 'desktop')),
  user_utterance text not null,
  ai_response text not null,
  summary text,
  created_at timestamptz default now()
);

create table if not exists public.push_alerts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  level text not null check (level in ('info', 'warning', 'sos')),
  message text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.archive_consents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  video_statement_url text not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

alter table public.patient_profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.life_facts enable row level security;
alter table public.caregivers enable row level security;
alter table public.session_logs enable row level security;
alter table public.push_alerts enable row level security;
alter table public.archive_consents enable row level security;

create policy "patients can read own profile"
on public.patient_profiles for select
to authenticated
using (id = auth.uid());

create policy "patients can update own profile"
on public.patient_profiles for update
to authenticated
using (id = auth.uid());

create policy "contacts readable by patient ownership"
on public.contacts for select
to authenticated
using (patient_id = auth.uid());

create policy "contacts manageable by patient ownership"
on public.contacts for all
to authenticated
using (patient_id = auth.uid())
with check (patient_id = auth.uid());

create policy "life_facts readable by patient ownership"
on public.life_facts for select
to authenticated
using (patient_id = auth.uid());

create policy "life_facts manageable by patient ownership"
on public.life_facts for all
to authenticated
using (patient_id = auth.uid())
with check (patient_id = auth.uid());

create policy "caregivers readable by patient ownership"
on public.caregivers for select
to authenticated
using (patient_id = auth.uid());

create policy "session logs readable by patient ownership"
on public.session_logs for select
to authenticated
using (patient_id = auth.uid());

create policy "session logs insert by patient ownership"
on public.session_logs for insert
to authenticated
with check (patient_id = auth.uid());

create policy "push alerts readable by patient ownership"
on public.push_alerts for select
to authenticated
using (patient_id = auth.uid());

create policy "push alerts insert by patient ownership"
on public.push_alerts for insert
to authenticated
with check (patient_id = auth.uid());

create policy "archive consent readable by patient ownership"
on public.archive_consents for select
to authenticated
using (patient_id = auth.uid());
