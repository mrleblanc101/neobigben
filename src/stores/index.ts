import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import fileSaver from 'file-saver';
const { saveAs } = fileSaver;

export const useStore = defineStore('store', {
    state: () => {
        return {
            menuOpened: false,
            selectedDay: new Date().toLocaleDateString('en-CA'),
            weekObjective: '40:00',
            projects: [] as Project[],
            entries: [] as Entry[],
        };
    },
    getters: {
        todaysEntries(): Entry[] {
            const { $moment } = useNuxtApp();
            const entries = [...this.entries]
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

            const total = Object.values(this.weekSummary).reduce((acc: moment.Duration, day: string) => {
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
        weekSummary(): Summary {
            const { $moment } = useNuxtApp();

            const weekStart = $moment(this.selectedDay).startOf('week');
            const weekEnd = $moment(this.selectedDay).endOf('week');

            return this.entries
                .filter((e) => !e.is_creating)
                .filter((e) => $moment(e.date).isBetween(weekStart, weekEnd))
                .reduce(
                    (acc: Summary, e: Entry) => {
                        const day = $moment(e.date).locale('en').format('dddd').toLowerCase() as keyof Summary;
                        acc[day] = $moment
                            .duration(acc[day])
                            .add($moment.duration(e.duration as string))
                            .format('HH:mm', {
                                trim: false,
                            });

                        return acc;
                    },
                    {
                        sunday: '00:00',
                        monday: '00:00',
                        tuesday: '00:00',
                        wednesday: '00:00',
                        thursday: '00:00',
                        friday: '00:00',
                        saturday: '00:00',
                    } as Summary,
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
        weekSummaryByProjects(): [string, string][] {
            const { $moment } = useNuxtApp();

            const weekStart = $moment(this.selectedDay).startOf('week');
            const weekEnd = $moment(this.selectedDay).endOf('week');

            const projects = [...this.entries]
                .filter((e) => !e.is_creating)
                .filter((e) => $moment(e.date).isBetween(weekStart, weekEnd, 'day', '[]'))
                .reduce((acc: { [key: string]: string }, e: Entry) => {
                    const project = e.project as Project;

                    if (!acc[project.name]) {
                        acc[project.name] = e.duration;
                    } else {
                        acc[project.name] = $moment.duration(acc[project.name]).add(e.duration).format('HH:mm');
                    }
                    return acc;
                }, {});

            return Object.entries(projects).sort((a, b) => {
                return $moment.duration(b[1]).asMilliseconds() - $moment.duration(a[1]).asMilliseconds();
            });
        },
    },
    actions: {
        addEntry(entry: Entry) {
            this.entries.push({
                ...JSON.parse(JSON.stringify(entry)),
                id: uuidv4(),
            });
        },
        updateEntry(entry: Entry) {
            const index = this.entries.findIndex((e) => e.id === entry.id);
            this.entries[index] = JSON.parse(JSON.stringify(entry));
        },
        deleteEntry(entry: Entry) {
            const nuxtApp = useNuxtApp();
            const { t } = nuxtApp.$i18n;

            if (confirm(t('Êtes vous certain de vouloir supprimer cette entrée ?'))) {
                const index = this.entries.findIndex((e) => e.id === entry.id);
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
        downloadAndReset() {
            const nuxtApp = useNuxtApp();
            const { t } = nuxtApp.$i18n;

            const { $moment } = useNuxtApp();
            const data = {
                entries: this.entries,
                weekSummary: this.weekSummary,
                weekTotal: this.weekTotal,
            };

            var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            saveAs(blob, `semaine-${$moment().week()}.json`);

            setTimeout(() => {
                if (
                    confirm(
                        t(
                            'Voulez-vous réinitialisé votre feuille de temps ? Ceci remettera à zero votre entrées de temps, mais conservera vos projets.',
                        ),
                    )
                ) {
                    this.entries = [];
                }
            }, 100);
        },
    },
    persist: true,
});
