create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  business_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  company text,
  email text,
  phone text,
  source text,
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_status_check
    check (status in ('new', 'contacted', 'qualified', 'won', 'lost'))
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  name text not null,
  client_name text not null,
  status text not null default 'planning',
  description text,
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check
    check (status in ('planning', 'active', 'waiting', 'complete'))
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete cascade,
  project_id uuid references public.projects (id) on delete cascade,
  raw_notes text not null,
  summary text not null,
  draft_email text not null,
  created_at timestamptz not null default now(),
  constraint ai_generations_parent_check
    check (lead_id is not null or project_id is not null)
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;

create index if not exists leads_owner_id_idx on public.leads (owner_id);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists projects_owner_id_idx on public.projects (owner_id);
create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists ai_generations_owner_id_idx on public.ai_generations (owner_id);

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row
execute function public.handle_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.handle_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.projects enable row level security;
alter table public.ai_generations enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Users can insert own lead" on public.leads;
create policy "Users can insert own lead"
on public.leads
for insert
with check (auth.uid() = owner_id);

drop policy if exists "Users can view own leads" on public.leads;
create policy "Users can view own leads"
on public.leads
for select
using (auth.uid() = owner_id);

drop policy if exists "Users can update own leads" on public.leads;
create policy "Users can update own leads"
on public.leads
for update
using (auth.uid() = owner_id);

drop policy if exists "Users can delete own leads" on public.leads;
create policy "Users can delete own leads"
on public.leads
for delete
using (auth.uid() = owner_id);

drop policy if exists "Users can insert own project" on public.projects;
create policy "Users can insert own project"
on public.projects
for insert
with check (auth.uid() = owner_id);

drop policy if exists "Users can view own projects" on public.projects;
create policy "Users can view own projects"
on public.projects
for select
using (auth.uid() = owner_id);

drop policy if exists "Users can update own projects" on public.projects;
create policy "Users can update own projects"
on public.projects
for update
using (auth.uid() = owner_id);

drop policy if exists "Users can delete own projects" on public.projects;
create policy "Users can delete own projects"
on public.projects
for delete
using (auth.uid() = owner_id);

drop policy if exists "Users can insert own ai generations" on public.ai_generations;
create policy "Users can insert own ai generations"
on public.ai_generations
for insert
with check (auth.uid() = owner_id);

drop policy if exists "Users can view own ai generations" on public.ai_generations;
create policy "Users can view own ai generations"
on public.ai_generations
for select
using (auth.uid() = owner_id);

drop policy if exists "Users can update own ai generations" on public.ai_generations;
create policy "Users can update own ai generations"
on public.ai_generations
for update
using (auth.uid() = owner_id);

drop policy if exists "Users can delete own ai generations" on public.ai_generations;
create policy "Users can delete own ai generations"
on public.ai_generations
for delete
using (auth.uid() = owner_id);
