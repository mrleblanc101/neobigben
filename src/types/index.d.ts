type Entry = {
    readonly id?: String;
    project: Object;
    is_live_clocking: Boolean;
    is_editing: Boolean;
    date: String;
    start_time: String;
    end_time: String;
    duration: String;
    description: String;
};

type Project = {
    readonly id?: string;
    name: string;
};
