-- Default start time of a new entry on a day with no entries yet
alter table public.user_settings add column day_start time not null default '09:30';
