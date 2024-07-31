// TODO: Use `Omit<id>` instead of `id?: Nullable<string>`
type Entry = {
    id?: Nullable<string>;
    project: Nullable<Project>;
    is_live_clocking: boolean;
    is_creating: boolean;
    is_editing: boolean;
    is_synced: boolean;
    date: Nullable<Date>;
    start_time: string;
    end_time: string;
    duration: string;
    description: string;
};

type Project = {
    id?: Nullable<string>;
    name: string;
};

type Summary = {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
};

type Priority = {
    id?: Nullable<string>;
    name: string;
    completed: boolean;
};

type Bookmark = {
    id?: Nullable<string>;
    name: string;
    url: string;
};

type User = {
    id?: Nullable<string>;
    display_name: string;
    email: string;
    photo_url: string;
    weekly_target: string;
    bookmarks: Bookmark[];
    priorities: Priority[];
};
