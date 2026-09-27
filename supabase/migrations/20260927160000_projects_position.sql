-- Order of the projects in the project list, set by dragging them; lower comes first
alter table public.projects add column position integer not null default 0;

-- Existing projects keep their order, newest first
update public.projects
set position = ordered.position
from (
    select id, row_number() over (partition by user_id order by created_at desc) - 1 as position
    from public.projects
) as ordered
where ordered.id = public.projects.id;
