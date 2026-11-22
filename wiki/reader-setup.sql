-- Reader: private books + pages, one set per signed-in person.
-- Run once in the Room Quest Supabase project (SQL editor).

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  author text,
  bookmark jsonb,                         -- {p: page number, s: sentence on that page, t: time}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.book_pages (
  book_id uuid not null references public.books (id) on delete cascade,
  page_number int not null check (page_number > 0),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  text text not null,
  updated_at timestamptz not null default now(),
  primary key (book_id, page_number)
);

create index if not exists book_pages_user_idx on public.book_pages (user_id);

alter table public.books enable row level security;
alter table public.book_pages enable row level security;

-- each person sees and changes only their own rows
create policy "books own" on public.books
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- pages must also belong to a book that is theirs
create policy "book_pages own" on public.book_pages
  for all to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.books b where b.id = book_id and b.user_id = auth.uid())
  );

-- explicit grants (new tables no longer get them automatically); signed-in only, nothing for anonymous visitors
revoke all on public.books, public.book_pages from anon;
grant select, insert, update, delete on public.books to authenticated;
grant select, insert, update, delete on public.book_pages to authenticated;
