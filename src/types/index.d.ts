type Entry = {
    readonly id?: string;
    project: Project;
    is_live_clocking: boolean;
    is_creating: boolean;
    is_editing: boolean;
    is_synced: boolean;
    date: string;
    start_time: string;
    end_time: string;
    duration: string;
    description: string;
};

type Project = {
    readonly id?: string;
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
    readonly id?: string;
    name: string;
    completed: boolean;
};
