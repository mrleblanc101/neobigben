import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

type Entry = {
    readonly id: '';
    project_id: '';
    is_live_clocking: false;
    date: '';
    start_time: '';
    end_time: '';
    duration: '';
    description: '';
};

type Project = {
    readonly id: string;
    name: string;
};

export const useStore = defineStore('store', {
    state: () => {
        return {
            projects: [
                {
                    id: uuidv4(),
                    name: 'Project 1',
                },
                {
                    id: uuidv4(),
                    name: 'Projet Deux',
                },
            ] as Project[],
            entries: [{}] as Entry[],
        };
    },
    actions: {
        addProject(project: Project) {
            this.projects.push(project);
        },
    },
    persist: {
        storage: persistedState.cookies,
    },
});
