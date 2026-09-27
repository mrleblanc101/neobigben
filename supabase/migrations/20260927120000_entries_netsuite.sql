-- Whether an entry has been copied into NetSuite
alter table public.entries add column copied_to_netsuite boolean not null default false;
