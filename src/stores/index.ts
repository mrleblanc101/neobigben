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
            priorities: [] as Priority[],
            filter: 'daily',
            selectedTabIndex: 0,
            sort: 'entries',
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
        weeklySummaryByProjects(): [string, string][] {
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
                        acc[project.name] = $moment.duration(acc[project.name]).add(e.duration).format('HH:mm', {
                            trim: false,
                        });
                    }
                    return acc;
                }, {});

            return Object.entries(projects).sort((a, b) => {
                return $moment.duration(b[1]).asMilliseconds() - $moment.duration(a[1]).asMilliseconds();
            });
        },
        dailySummaryByProjects(): [string, string][] {
            const { $moment } = useNuxtApp();

            const projects = [...this.entries]
                .filter((e) => !e.is_creating)
                .filter((e) => $moment(e.date).isSame(this.selectedDay))
                .reduce((acc: { [key: string]: string }, e: Entry) => {
                    const project = e.project as Project;

                    if (!acc[project.name]) {
                        acc[project.name] = e.duration;
                    } else {
                        acc[project.name] = $moment.duration(acc[project.name]).add(e.duration).format('HH:mm', {
                            trim: false,
                        });
                    }
                    return acc;
                }, {});

            return Object.entries(projects).sort((a, b) => {
                return $moment.duration(b[1]).asMilliseconds() - $moment.duration(a[1]).asMilliseconds();
            });
        },
        sortedProjects(): [Project, number][] {
            const projects = [...this.projects].map((p): [Project, number] => [p, this.projectEntriesTotal(p)]);
            if (this.sort === 'name') {
                return projects.sort((a, b) => {
                    return a[0].name.localeCompare(b[0].name);
                });
            }
            if (this.sort === 'entries') {
                return projects
                    .sort((a, b) => {
                        return a[0].name.localeCompare(b[0].name);
                    })
                    .sort((a, b) => {
                        return b[1] - a[1];
                    });
            }
            return projects;
        },
        projectEntriesTotal(): Function {
            return (project: Project) => this.entries.filter((e) => e?.project?.id === project.id).length;
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
        deleteEntry(entry: Entry, force = false) {
            const nuxtApp = useNuxtApp();
            const { t } = nuxtApp.$i18n;
            const index = this.entries.findIndex((e) => e.id === entry.id);

            if (force) {
                this.entries.splice(index, 1);
            } else {
                if (confirm(t('??tes vous certain de vouloir supprimer cette entr??e ?'))) {
                    this.entries.splice(index, 1);
                }
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
        deleteProject(project: Project) {
            const nuxtApp = useNuxtApp();
            const { t } = nuxtApp.$i18n;

            if (confirm(t('??tes vous certain de vouloir supprimer ce projet ?'))) {
                const index = this.projects.findIndex((e) => e.id === project.id);
                this.projects.splice(index, 1);
                const linkedEntries = this.projectEntriesTotal(project);

                if (linkedEntries > 0) {
                    if (
                        confirm(
                            t(
                                "Voulez-vous supprimer l'entr??e reli??e ? | Voulez-vous supprimer les {n} entr??es reli??es ?",
                                linkedEntries,
                            ),
                        )
                    ) {
                        this.entries
                            .filter((e) => e.project.id === project.id)
                            .forEach((e) => this.deleteEntry(e, true));
                    }
                }
            }
        },
        addPriority(name: string) {
            const project = {
                id: uuidv4(),
                name,
                completed: false,
            };
            this.priorities.push(project);
            return project;
        },
        deletePriority(priority: Priority, force = false) {
            const nuxtApp = useNuxtApp();
            const { t } = nuxtApp.$i18n;
            const index = this.priorities.findIndex((e) => e.id === priority.id);

            if (force) {
                this.priorities.splice(index, 1);
            } else {
                if (confirm(t('??tes vous certain de vouloir supprimer cette priorit?? ?'))) {
                    this.priorities.splice(index, 1);
                }
            }
        },
        deleteCompletedPriorities() {
            const nuxtApp = useNuxtApp();
            const { t } = nuxtApp.$i18n;
            const completed = this.priorities.filter((p: Priority) => p.completed);

            if (completed.length !== 0) {
                if (confirm(t('??tes vous certain de vouloir supprimer les priorit??s compl??t??es ?'))) {
                    completed.forEach((p) => this.deletePriority(p, true));
                }
            } else {
                // TODO: Use sweetalert or something like that
                alert(t('Aucune priorit?? compl??t??e ?? supprimer'));
            }
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
            saveAs(blob, `semaine-${$moment(this.selectedDay).week()}.json`);

            setTimeout(() => {
                if (
                    confirm(
                        t(
                            'Voulez-vous r??initialis?? votre feuille de temps ? Ceci remettera ?? zero votre entr??es de temps, mais conservera vos projets.',
                        ),
                    )
                ) {
                    this.entries = [];
                }
                this.priorities = [];
            }, 100);
        },
    },
    persist: true,
});
