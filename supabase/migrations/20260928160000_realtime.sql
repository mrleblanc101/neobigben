-- Publish changes to the user's data over Realtime, so open tabs and devices update as they happen.
-- Row level security still decides who receives which rows. Tables already published (from the dashboard) are skipped.
do $$
declare
    name text;
begin
    foreach name in array array['projects', 'entries', 'user_settings'] loop
        if not exists (
            select 1 from pg_publication_tables
            where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = name
        ) then
            execute format('alter publication supabase_realtime add table public.%I', name);
        end if;
    end loop;
end $$;
