import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useStore = defineStore('store', {
    state: () => {
        return {
            viewedDay: new Date().toLocaleDateString('en-CA'),
            weeklyHours: '40:00',
            projects: [] as Project[],
            entries: [] as Entry[],
        };
    },
    getters: {
        todaysEntries(): Entry[] {
            const { $moment } = useNuxtApp();
            const entries = this.entries
                .sort((a, b) => {
                    const startA = $moment(a.date + ' ' + a.start_time, 'YYYY-M-D HH:mm');
                    const startB = $moment(b.date + ' ' + b.start_time, 'YYYY-M-D HH:mm');
                    return startB.isBefore(startA) ? 1 : -1;
                })
                .filter((e) => $moment(this.viewedDay).isSame(e.date, 'day'));

            return entries;
        },
        remainingTime(): string {
            const { $moment } = useNuxtApp();

            const total = this.entries
                .filter((e) => !e.is_creating)
                .reduce((acc, e: Entry) => {
                    acc = $moment
                        .duration(acc)
                        .add($moment.duration(e.duration as string))
                        .format('HH:mm', {
                            trim: false,
                        });

                    return acc;
                }, '00:00');

            return $moment.duration(this.weeklyHours).subtract(total).format('HH:mm');
        },
        weeklySummary(): object {
            const { $moment } = useNuxtApp();

            return this.entries
                .filter((e) => !e.is_creating)
                .reduce(
                    (acc: string[], e: Entry) => {
                        const day = $moment(e.date).day();
                        acc[day] = $moment
                            .duration(acc[day])
                            .add($moment.duration(e.duration as string))
                            .format('HH:mm', {
                                trim: false,
                            });

                        return acc;
                    },
                    ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'],
                );
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
            let index = this.entries.findIndex((e) => e.id === entry.id);
            this.entries[index] = entry;
        },
        deleteEntry(entry: Entry) {
            if (confirm('Êtes vous certain de vouloir supprimer cette entrée ?')) {
                let index = this.entries.findIndex((e) => e.id === entry.id);
                this.entries.splice(index, 1);
            }
        },
        addProject(option: Project) {
            const project = {
                id: uuidv4(),
                name: option.name,
            };
            this.projects.push(project);
            return project;
        },
    },
    persist: {
        storage: persistedState.cookies,
    },
});
