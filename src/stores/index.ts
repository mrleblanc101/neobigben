import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useStore = defineStore('store', {
    state: () => {
        return {
            projects: [] as Project[],
            entries: [] as Entry[],
        };
    },
    actions: {
        addEntry(entry: Entry) {
            this.entries.push({
                ...entry,
                id: uuidv4(),
            });
            console.log(this.entries);
        },
        updateEntry(entry: Entry) {
            let item = this.entries.find((e) => e.id === entry.id);
            item = entry;
        },
        deleteEntry(entry: Entry) {
            let index = this.entries.findIndex((e) => e.id === entry.id);
            this.entries.splice(index, 1);
        },
        addProject(option: Project) {
            const project = {
                id: uuidv4(),
                name: option.name,
            };
            this.projects.push(project);
            return project;
        },
        removeEntry(id: string) {},
    },
    persist: {
        storage: persistedState.cookies,
    },
});
