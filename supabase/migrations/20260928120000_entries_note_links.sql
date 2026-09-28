-- Links stay in the note, where they were typed, and are found in it when displayed:
-- a link kept apart goes back at the end of its note
update public.entries set note = trim(note || ' ' || url) where url <> '';

alter table public.entries drop column url;
