-- Room Quest v0.13: each person's own room shape, shared back to the house map.
-- A member can write only the row for the room their key points at; the admin can write any row.
create table public.household_rooms (
  household_id uuid not null references public.households(id) on delete cascade,
  room_key text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users(id),
  primary key (household_id, room_key)
);

alter table public.household_rooms enable row level security;

create function public.owns_room(hid uuid, rk text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from household_members
                  where household_id = hid and user_id = auth.uid() and room_key = rk)
$$;

create policy "members see room shapes" on public.household_rooms for select using (public.is_member(household_id));
create policy "owner or admin adds room shape" on public.household_rooms for insert
  with check (public.is_admin(household_id) or public.owns_room(household_id, room_key));
create policy "owner or admin updates room shape" on public.household_rooms for update
  using (public.is_admin(household_id) or public.owns_room(household_id, room_key));

grant select, insert, update on public.household_rooms to authenticated;
revoke execute on function public.owns_room(uuid, text) from public, anon;
grant execute on function public.owns_room(uuid, text) to authenticated;
