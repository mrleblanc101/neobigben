import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useStore = defineStore('store', {
    state: () => {
        return {
            weeklyHours: '40:00',
            projects: [] as Project[],
            entries: [] as Entry[],
            // TODO: Sort by start_time
            // TODO: Add space between not subsequent timeslot
        };
    },
    getters: {
        remainingTime(): string {
            const { $moment } = useNuxtApp();

            const total = this.entries.reduce((acc, e: Entry) => {
                acc = $moment
                    .duration(acc)
                    .add($moment.duration(e.duration as string))
                    .format('HH:mm');

                return acc;
            }, '00:00');

            return $moment.duration(this.weeklyHours).subtract(total).format('HH:mm');
        },
    },
    actions: {
        addEntry(entry: Entry) {
            this.entries.push({
                ...entry,
                id: uuidv4(),
            });
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
