-- Trickno · Organ — palettes (per-user, private; sharing comes later via `published`)
-- Run once in the Supabase SQL editor.

create table if not exists public.palettes (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  owner_name  text,
  name        text not null default 'Untitled',
  colors      jsonb not null default '[]'::jsonb,            -- ["#rrggbb", ...] up to 30
  snap        text check (snap in ('keep','vivid')),         -- null = not snapped to notes
  orig        jsonb,                                         -- original colours while snapped (so Restore works)
  sort_order  integer not null default 0,
  published   boolean not null default false,                -- reserved for the future share/publish system
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint palettes_colors_is_array check (jsonb_typeof(colors) = 'array' and jsonb_array_length(colors) <= 30),
  constraint palettes_orig_is_array   check (orig is null or (jsonb_typeof(orig) = 'array' and jsonb_array_length(orig) <= 30))
);

create index if not exists palettes_owner_idx on public.palettes (owner_id, sort_order);

alter table public.palettes enable row level security;

-- Owners can do everything with their own palettes.
drop policy if exists "palettes: owner full access" on public.palettes;
create policy "palettes: owner full access" on public.palettes
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Anyone can read palettes that were published (nothing sets this yet).
drop policy if exists "palettes: public can read published" on public.palettes;
create policy "palettes: public can read published" on public.palettes
  for select to anon, authenticated
  using (published = true);

grant select on public.palettes to anon;
grant select, insert, update, delete on public.palettes to authenticated;
