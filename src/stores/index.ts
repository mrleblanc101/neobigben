import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useStore = defineStore('store', {
    state: () => {
        return {
            selectedDay: new Date().toLocaleDateString('en-CA'),
            weekObjective: '40:00',
            projects: [
                {
                    id: uuidv4(),
                    name: 'Libéo - Interne',
                },
            ] as Project[],
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
                .filter((e) => $moment(this.selectedDay).isSame(e.date, 'day'));

            return entries;
        },
        weekTotal(): string {
            const { $moment } = useNuxtApp();

            const total = this.weekSummary.reduce((acc: moment.Duration, day: string) => {
                acc = $moment.duration(acc).add($moment.duration(day));
                return acc;
            }, $moment.duration());
            return $moment.duration(total).format('HH:mm', {
                trim: false,
            });
        },
        weekRemaining(): string {
            const { $moment } = useNuxtApp();

            return $moment.duration(this.weekObjective).subtract($moment.duration(this.weekTotal)).format('HH:mm', {
                trim: false,
            });
        },
        weekSummary(): string[] {
            const { $moment } = useNuxtApp();

            const weekStart = $moment(this.selectedDay).startOf('week');
            const weekEnd = $moment(this.selectedDay).endOf('week');

            return this.entries
                .filter((e) => !e.is_creating)
                .filter((e) => $moment(e.date).isBetween(weekStart, weekEnd))
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
        weekSummaryColors(): Function {
            return (time: string): string => {
                const { $moment } = useNuxtApp();

                const isZero = $moment.duration(time).asHours() === 0;
                const isOvertime =
                    $moment.duration(time).asHours() >= $moment.duration(this.weekObjective).asHours() / 5;
                const isBelow =
                    $moment.duration(time).asHours() >= $moment.duration(this.weekObjective).asHours() / 5 - 0.5;

                if (isZero) {
                    return 'text-gray-400 dark:text-gray-600';
                } else if (isOvertime) {
                    return 'text-green-500';
                } else if (isBelow) {
                    return 'text-yellow-500';
                } else {
                    return 'text-red-500';
                }
            };
        },
        weekSummaryByProjects(): { [key: string]: string } {
            const { $moment } = useNuxtApp();

            const weekStart = $moment(this.selectedDay).startOf('week');
            const weekEnd = $moment(this.selectedDay).endOf('week');

            return this.entries
                .filter((e) => !e.is_creating)
                .filter((e) => $moment(e.date).isBetween(weekStart, weekEnd))
                .reduce((acc: { [key: string]: string }, e: Entry) => {
                    const project = e.project as Project;

                    if (!acc[project.name]) {
                        acc[project.name] = e.duration;
                    } else {
                        acc[project.name] = $moment.duration(acc[project.name]).add(e.duration).format('HH:mm');
                    }
                    return acc;
                }, {});
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
