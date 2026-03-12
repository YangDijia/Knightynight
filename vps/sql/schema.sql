-- Knightynight PostgreSQL schema for self-hosted VPS backend

create extension if not exists pgcrypto;

create table if not exists public.bench_status (
  id int primary key,
  knight_resting boolean not null default false,
  hornet_resting boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.bench_status (id, knight_resting, hornet_resting)
values (1, false, false)
on conflict (id) do nothing;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  text text not null default '',
  image_url text,
  liked boolean not null default false,
  timestamp_text text not null,
  created_at timestamptz not null default now(),
  author text not null check (author in ('Knight', 'Hornet')),
  comments jsonb not null default '[]'::jsonb
);

create index if not exists notes_created_at_idx on public.notes (created_at desc);

create table if not exists public.calendar_entries (
  id bigint generated always as identity primary key,
  user_profile text not null check (user_profile in ('Knight', 'Hornet')),
  entry_date date not null,
  mood text check (mood in ('happy', 'sad', 'angry', 'neutral', 'peaceful')),
  journal text,
  updated_at timestamptz not null default now(),
  unique (user_profile, entry_date)
);

create index if not exists calendar_entries_user_date_idx
  on public.calendar_entries (user_profile, entry_date);
