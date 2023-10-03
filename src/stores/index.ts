import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import fileSaver from 'file-saver';
const { saveAs } = fileSaver;
import { collection, addDoc } from 'firebase/firestore'


export const useStore = defineStore('store', () => {
    const db = useFirestore()

    const menuOpened = ref(false);
    const selectedDay = ref(new Date().toLocaleDateString('en-CA'));
    const filter = ref('daily');
    const selectedTabIndex = ref(0);
    const sort = ref('entries');
    const weekObjective = ref('40:00');
    const projects = useCollection<Project>(collection(db, 'projects'));
    const entries = useCollection<Entry>(collection(db, 'entries'));
    const priorities = useCollection<Priority>(collection(db, 'priorities'));

    const todaysEntries = computed((): Entry[] => {
        const { $moment } = useNuxtApp();
        return [...entries.value]
            .sort((a, b) => {
                const startA = $moment(a.date + ' ' + a.start_time, 'YYYY-M-D HH:mm');
                const startB = $moment(b.date + ' ' + b.start_time, 'YYYY-M-D HH:mm');
                return startB.isBefore(startA) ? 1 : -1;
            })
            .filter((e) => $moment(selectedDay.value).isSame(e.date, 'day'));

    });
    const weekTotal = computed((): string => {
        const { $moment } = useNuxtApp();

        const total = Object.values(weekSummary.value).reduce((acc: moment.Duration, day: string) => {
            acc = $moment.duration(acc).add($moment.duration(day));
            return acc;
        }, $moment.duration());
        return $moment.duration(total).format('HH:mm', {
            trim: false,
        });
    });
    const weekRemaining = computed((): string => {
        const { $moment } = useNuxtApp();

        return $moment.duration(weekObjective.value).subtract($moment.duration(weekTotal.value)).format('HH:mm', {
            trim: false,
        });
    });
    const weekSummary = computed((): Summary => {
        const { $moment } = useNuxtApp();

        const weekStart = $moment(selectedDay.value).startOf('week');
        const weekEnd = $moment(selectedDay.value).endOf('week');

        return entries.value
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
    });
    const weekSummaryColors = computed((): Function => {
        return (time: string): string => {
            const { $moment } = useNuxtApp();

            const isZero = $moment.duration(time).asHours() === 0;
            const isOvertime =
                $moment.duration(time).asHours() >= $moment.duration(weekObjective.value).asHours() / 5;
            const isBelow =
                $moment.duration(time).asHours() >= $moment.duration(weekObjective.value).asHours() / 5 - 0.5;

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
    });
    const weeklySummaryByProjects = computed((): [string, string][] => {
        const { $moment } = useNuxtApp();

        const weekStart = $moment(selectedDay.value).startOf('week');
        const weekEnd = $moment(selectedDay.value).endOf('week');

        const projects = [...entries.value]
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
    });
    const dailySummaryByProjects = computed((): [string, string][] => {
        const { $moment } = useNuxtApp();

        const projects = [...entries.value]
            .filter((e) => !e.is_creating)
            .filter((e) => $moment(e.date).isSame(selectedDay.value))
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
    });
    const sortedProjects = computed((): [Project, number][] => {
        const p = [...projects.value].map((p): [Project, number] => [p, projectEntriesTotal.value(p)]);
        if (sort.value === 'name') {
            return p.sort((a, b) => {
                return a[0].name.localeCompare(b[0].name);
            });
        }
        if (sort.value === 'entries') {
            return p
                .sort((a, b) => {
                    return a[0].name.localeCompare(b[0].name);
                })
                .sort((a, b) => {
                    return b[1] - a[1];
                });
        }
        return p;
    });
    const projectEntriesTotal = computed((): Function => {
        return (project: Project) => entries.value.filter((e) => e?.project?.id === project.id).length;
    });
    const isLiveClockingEntry = computed((): boolean => {
        return !!entries.value.find(e => e.is_live_clocking);
    });
    const isCreatingEntry = computed((): boolean => {
        return !!entries.value.find(e => e.is_creating);
    });
    const canCreateEntry = computed((): boolean => {
        return !isLiveClockingEntry.value && !isCreatingEntry.value;
    });

    async function addEntry(entry: Entry) {
        await addDoc(collection(db, "entries"), {
            ...entry
        });
    };
    function updateEntry(entry: Entry) {
        const index = entries.value.findIndex((e) => e.id === entry.id);
        entries.value[index] = JSON.parse(JSON.stringify(entry));
    };
    function deleteEntry(entry: Entry, force = false) {
        const nuxtApp = useNuxtApp();
        const { t } = nuxtApp.$i18n;
        const index = entries.value.findIndex((e) => e.id === entry.id);

        if (force) {
            entries.value.splice(index, 1);
        } else {
            if (confirm(t('Êtes vous certain de vouloir supprimer cette entrée ?'))) {
                entries.value.splice(index, 1);
            }
        }
    };
    function toggleEntrySynced(id: string) {
        const entry = entries.value.find((e) => e.id === id);
        if(entry) {
            entry.is_synced = !entry.is_synced ?? true;
        }
    };
    async function addProject(option: Project) {
        const project = await addDoc(collection(db, "projects"), {
            name: option.name,
        });
        return {id: project.id, name: option.name};
    };
    function deleteProject(project: Project) {
        const nuxtApp = useNuxtApp();
        const { t } = nuxtApp.$i18n;

        if (confirm(t('Êtes vous certain de vouloir supprimer ce projet ?'))) {
            const index = projects.value.findIndex((e) => e.id === project.id);
            projects.value.splice(index, 1);
            const linkedEntries = projectEntriesTotal.value(project);

            if (linkedEntries > 0) {
                if (
                    confirm(
                        t(
                            "Voulez-vous supprimer l'entrée reliée ? | Voulez-vous supprimer les {n} entrées reliées ?",
                            linkedEntries,
                        ),
                    )
                ) {
                    entries.value
                        .filter((e) => e.project.id === project.id)
                        .forEach((e) => deleteEntry(e, true));
                }
            }
        }
    };
    async function addPriority(name: string) {
        await addDoc(collection(db, "priorities"), {
            name,
            completed: false,
        });
    };
    function deletePriority(priority: Priority, force = false) {
        const nuxtApp = useNuxtApp();
        const { t } = nuxtApp.$i18n;
        const index = priorities.value.findIndex((e) => e.id === priority.id);

        if (force) {
            priorities.value.splice(index, 1);
        } else {
            if (confirm(t('Êtes vous certain de vouloir supprimer cette priorité ?'))) {
                priorities.value.splice(index, 1);
            }
        }
    };
    function deleteCompletedPriorities() {
        const nuxtApp = useNuxtApp();
        const { t } = nuxtApp.$i18n;
        const completed = priorities.value.filter((p: Priority) => p.completed);

        if (completed.length !== 0) {
            if (confirm(t('Êtes vous certain de vouloir supprimer les priorités complétées ?'))) {
                completed.forEach((p) => deletePriority(p, true));
            }
        } else {
            alert(t('Aucune priorité complétée à supprimer'));
        }
    };
    function downloadAndReset() {
        const nuxtApp = useNuxtApp();
        const { t } = nuxtApp.$i18n;

        const { $moment } = useNuxtApp();
        const data = {
            entries: entries.value,
            weekSummary: weekSummary.value,
            weekTotal: weekTotal.value,
        };

        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        saveAs(blob, `semaine-${$moment(selectedDay.value).week()}.json`);

        setTimeout(() => {
            if (
                confirm(
                    t(
                        'Voulez-vous réinitialisé votre feuille de temps ? Ceci remettera à zero votre entrées de temps, mais conservera vos projets.',
                    ),
                )
            ) {
                entries.value = [];
            }
            priorities.value = [];
        }, 100);
    };

    return {
        menuOpened,
        selectedDay,
        filter,
        selectedTabIndex,
        sort,
        weekObjective,
        projects,
        entries,
        priorities,
        //
        todaysEntries,
        weekTotal,
        weekRemaining,
        weekSummary,
        weekSummaryColors,
        weeklySummaryByProjects,
        dailySummaryByProjects,
        sortedProjects,
        projectEntriesTotal,
        isLiveClockingEntry,
        isCreatingEntry,
        canCreateEntry,
        //
        addEntry,
        updateEntry,
        deleteEntry,
        toggleEntrySynced,
        addProject,
        deleteProject,
        addPriority,
        deletePriority,
        deleteCompletedPriorities,
        downloadAndReset,
    }
});
