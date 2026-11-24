create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  email text not null,
  user_id uuid references auth.users(id) on delete set null,
  role text not null default 'member' check (role in ('admin','member')),
  room_key text,
  created_at timestamptz not null default now()
);
create unique index household_members_email_uq on public.household_members (household_id, lower(email));

create table public.household_state (
  household_id uuid primary key references public.households(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.household_state enable row level security;

create function public.is_member(hid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from household_members where household_id = hid and user_id = auth.uid())
$$;

create function public.is_admin(hid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from household_members where household_id = hid and user_id = auth.uid() and role = 'admin')
$$;

create function public.create_household(hname text) returns uuid
language plpgsql security definer set search_path = public as $$
declare hid uuid;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  insert into households(name, created_by) values (hname, auth.uid()) returning id into hid;
  insert into household_members(household_id, email, user_id, role)
    values (hid, lower(auth.jwt()->>'email'), auth.uid(), 'admin');
  insert into household_state(household_id) values (hid);
  return hid;
end $$;

create function public.claim_invites() returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update household_members set user_id = auth.uid()
   where user_id is null and lower(email) = lower(auth.jwt()->>'email');
  get diagnostics n = row_count;
  return n;
end $$;

create policy "see my houses" on public.households for select using (public.is_member(id) or created_by = auth.uid());
create policy "admin renames house" on public.households for update using (public.is_admin(id));

create policy "see house keys" on public.household_members for select
  using (public.is_member(household_id) or lower(email) = lower(auth.jwt()->>'email'));
create policy "admin hands out keys" on public.household_members for insert with check (public.is_admin(household_id));
create policy "admin changes keys" on public.household_members for update using (public.is_admin(household_id));
create policy "admin removes keys" on public.household_members for delete using (public.is_admin(household_id));

create policy "members read house map" on public.household_state for select using (public.is_member(household_id));
create policy "admin writes house map" on public.household_state for insert with check (public.is_admin(household_id));
create policy "admin updates house map" on public.household_state for update using (public.is_admin(household_id));

grant select, update on public.households to authenticated;
grant select, insert, update, delete on public.household_members to authenticated;
grant select, insert, update on public.household_state to authenticated;
revoke execute on function public.create_household(text), public.claim_invites(), public.is_member(uuid), public.is_admin(uuid) from public, anon;
grant execute on function public.create_household(text), public.claim_invites(), public.is_member(uuid), public.is_admin(uuid) to authenticated;