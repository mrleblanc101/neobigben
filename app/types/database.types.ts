// Matches supabase/migrations. Regenerate with `supabase gen types typescript` once the CLI is set up.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    __InternalSupabase: {
        PostgrestVersion: "13";
    };
    public: {
        Tables: {
            entries: {
                Row: {
                    created_at: string;
                    day: string;
                    end_time: string;
                    id: string;
                    note: string;
                    project_id: string;
                    start_time: string;
                    url: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    day: string;
                    end_time: string;
                    id?: string;
                    note?: string;
                    project_id: string;
                    start_time: string;
                    url?: string;
                    user_id?: string;
                };
                Update: {
                    created_at?: string;
                    day?: string;
                    end_time?: string;
                    id?: string;
                    note?: string;
                    project_id?: string;
                    start_time?: string;
                    url?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "entries_project_id_fkey";
                        columns: ["project_id"];
                        isOneToOne: false;
                        referencedRelation: "projects";
                        referencedColumns: ["id"];
                    },
                ];
            };
            projects: {
                Row: {
                    color: string;
                    created_at: string;
                    favorite: boolean;
                    id: string;
                    name: string;
                    user_id: string;
                };
                Insert: {
                    color: string;
                    created_at?: string;
                    favorite?: boolean;
                    id?: string;
                    name: string;
                    user_id?: string;
                };
                Update: {
                    color?: string;
                    created_at?: string;
                    favorite?: boolean;
                    id?: string;
                    name?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_settings: {
                Row: {
                    user_id: string;
                    weekly_goal_hours: number;
                };
                Insert: {
                    user_id?: string;
                    weekly_goal_hours?: number;
                };
                Update: {
                    user_id?: string;
                    weekly_goal_hours?: number;
                };
                Relationships: [];
            };
        };
        Views: { [_ in never]: never };
        Functions: { [_ in never]: never };
        Enums: { [_ in never]: never };
        CompositeTypes: { [_ in never]: never };
    };
};
