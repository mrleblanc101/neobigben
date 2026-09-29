-- Time tracker: each user only sees and edits their own projects, entries and settings.

create table public.projects (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
    name text not null check (length(trim(name)) > 0),
    color text not null,
    favorite boolean not null default false,
    created_at timestamptz not null default now()
);

-- Project names are unique per user, ignoring case
create unique index projects_user_id_name_key on public.projects (user_id, lower(name));

create table public.entries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
    project_id uuid not null references public.projects (id) on delete cascade,
    day date not null,
    start_time time not null,
    end_time time not null,
    note text not null default '',
    url text not null default '',
    created_at timestamptz not null default now(),
    check (end_time > start_time)
);

create index entries_user_id_day_idx on public.entries (user_id, day);
create index entries_project_id_idx on public.entries (project_id);

create table public.user_settings (
    user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
    weekly_goal_hours smallint not null default 40 check (weekly_goal_hours between 1 and 80)
);

alter table public.projects enable row level security;
alter table public.entries enable row level security;
alter table public.user_settings enable row level security;

create policy "Users manage their own projects" on public.projects
    for all to authenticated
    using (user_id = (select auth.uid()))
    with check (user_id = (select auth.uid()));

-- An entry can only point at one of the user's own projects
create policy "Users manage their own entries" on public.entries
    for all to authenticated
    using (user_id = (select auth.uid()))
    with check (
        user_id = (select auth.uid())
        and exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid()))
    );

create policy "Users manage their own settings" on public.user_settings
    for all to authenticated
    using (user_id = (select auth.uid()))
    with check (user_id = (select auth.uid()));

grant select, insert, update, delete on public.projects, public.entries, public.user_settings to authenticated;
