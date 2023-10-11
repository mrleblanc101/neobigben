import { defineStore } from 'pinia';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import type { QueryDocumentSnapshot, SnapshotOptions, DocumentData } from 'firebase/firestore';
import { firestoreDefaultConverter } from 'vuefire';

export const useIndexStore = defineStore('store', () => {
    const db = useFirestore();
    const user = useCurrentUser();
    const nuxtApp = useNuxtApp();
    const { $moment } = nuxtApp;
    const { t } = nuxtApp.$i18n;

    const dateConverter = {
        toFirestore(entry: Entry): DocumentData {
            delete entry.id;
            return {
                ...entry,
                date: $moment(entry.date).startOf('day').toDate(),
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): DocumentData {
            const data = firestoreDefaultConverter.fromFirestore(snapshot)!;
            data.date = $moment(data.date.toDate()).format('YYYY-MM-DD');
            return data;
        },
    };

    const selectedDay = ref(new Date().toLocaleDateString('en-CA'));
    const filter = useLocalStorage('filter', ref('daily'));
    const selectedTabIndex = useLocalStorage('selectedTabIndex', ref(0));
    const sort = useLocalStorage('sort', ref('name'));
    const weekObjective = useLocalStorage('weekObjective', ref('40:00'));
    const menuOpened = ref(false);

    const weekStart = computed(() => {
        return $moment(selectedDay.value).startOf('week').toDate();
    });
    const weekEnd = computed(() => {
        return $moment(selectedDay.value).endOf('week').toDate();
    });
    const projects = useCollection<Project>(
        computed(() => (user.value ? query(collection(db, 'projects'), where('user', '==', user.value?.uid)) : null)),
        {
            ssrKey: 'projects',
        },
    );
    const priorities = useCollection<Priority>(
        computed(() => (user.value ? query(collection(db, 'priorities'), where('user', '==', user.value?.uid)) : null)),
        {
            ssrKey: 'priorities',
        },
    );
    const entries = useCollection<Entry>(
        computed(() =>
            user.value
                ? query(
                      collection(db, 'entries').withConverter(dateConverter),
                      where('user', '==', user.value?.uid),
                      where('date', '>=', weekStart.value),
                      where('date', '<=', weekEnd.value),
                  )
                : null,
        ),
        {
            ssrKey: 'entries',
        },
    );

    const todaysEntries = computed((): Entry[] => {
        return [...entries.value]
            .sort((a, b) => {
                const startA = $moment(a.date + ' ' + a.start_time, 'YYYY-M-D HH:mm');
                const startB = $moment(b.date + ' ' + b.start_time, 'YYYY-M-D HH:mm');
                return startB.isBefore(startA) ? 1 : -1;
            })
            .filter((e) => $moment(selectedDay.value).isSame(e.date, 'day'));
    });
    const weekTotal = computed((): string => {
        const total = Object.values(weekSummary.value).reduce((acc: moment.Duration, day: string) => {
            acc = $moment.duration(acc).add($moment.duration(day));
            return acc;
        }, $moment.duration());
        return $moment.duration(total).format('HH:mm', {
            trim: false,
        });
    });
    const weekRemaining = computed((): string => {
        return $moment.duration(weekObjective.value).subtract($moment.duration(weekTotal.value)).format('HH:mm', {
            trim: false,
        });
    });
    const weekSummary = computed((): Summary => {
        return entries.value
            .filter((e) => !e.is_creating)
            .reduce(
                (acc: Summary, e: Entry) => {
                    const day = $moment(e.date).locale('en').format('dddd').toLowerCase() as keyof Summary;
                    acc[day] = $moment.duration(acc[day]).add($moment.duration(e.duration)).format('HH:mm', {
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
    const weeklySummaryByProjects = computed((): [string, string][] => {
        const projects = [...entries.value]
            .filter((e) => !e.is_creating)
            .reduce((acc: { [key: string]: string }, e: Entry) => {
                const project = e.project;

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
        const projects = [...entries.value]
            .filter((e) => !e.is_creating)
            .filter((e) => $moment(e.date).isSame(selectedDay.value))
            .reduce((acc: { [key: string]: string }, e: Entry) => {
                const project = e.project;

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
        // TODO: Sort by creation date
        const p = projects.value.map((p): [Project, number] => [p, projectEntriesTotal(p)]);
        if (sort.value === 'name') {
            return p.sort((a, b) => {
                return a[0].name.localeCompare(b[0].name);
            });
        }
        return p;
    });
    const isLiveClockingEntry = computed((): boolean => {
        return !!entries.value.find((e) => e.is_live_clocking);
    });
    const isCreatingEntry = computed((): boolean => {
        return !!entries.value.find((e) => e.is_creating);
    });
    const canCreateEntry = computed((): boolean => {
        return !isLiveClockingEntry.value && !isCreatingEntry.value;
    });

    const weekSummaryColors = (time: string): string => {
        const isZero = $moment.duration(time).asHours() === 0;
        const isOvertime = $moment.duration(time).asHours() >= $moment.duration(weekObjective.value).asHours() / 5;
        const isBelow = $moment.duration(time).asHours() >= $moment.duration(weekObjective.value).asHours() / 5 - 0.5;

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
    const projectEntriesTotal = (project: Project) => {
        return entries.value.filter((e) => e?.project?.id === project.id).length;
    };

    async function addEntry(entry: Entry) {
        await addDoc(collection(db, 'entries').withConverter(dateConverter), {
            ...entry,
            user: user.value?.uid,
            project: entry.project?.id ? doc(db, 'projects', entry.project.id) : null,
        });
    }
    async function updateEntry(entry: Entry) {
        await updateDoc(doc(db, 'entries', entry.id), {
            ...entry,
            project: entry.project?.id ? doc(db, 'projects', entry.project.id) : null,
            date: $moment(entry.date).startOf('day').toDate(),
        });
    }
    async function deleteEntry(entry: Entry, force = false) {
        if (force || confirm(t('Êtes vous certain de vouloir supprimer cette entrée ?'))) {
            await deleteDoc(doc(db, 'entries', entry.id));
        }
    }
    async function toggleEntrySynced(entry: Entry) {
        await updateDoc(doc(db, 'entries', entry.id), {
            is_synced: !entry.is_synced ?? true,
        });
    }
    async function addProject(option: Project) {
        const project = await addDoc(collection(db, 'projects'), {
            name: option.name,
            user: user.value?.uid,
        });
        return { id: project.id, name: option.name };
    }
    async function deleteProject(project: Project) {
        if (confirm(t('Êtes vous certain de vouloir supprimer ce projet ?'))) {
            const projectRef = doc(db, 'projects', project.id);
            const { promise: linkedEntriesPromise } = await useCollection<Entry>(
                query(collection(db, 'entries'), where('project', '==', projectRef)),
                {
                    once: true,
                    wait: true,
                    ssrKey: 'projectEntries',
                },
            );
            const batch = writeBatch(db);
            const linkedEntries = await linkedEntriesPromise.value;
            if (linkedEntries.length > 0) {
                if (
                    confirm(
                        t(
                            "Cela entrainera la supression de l'entrée liée, êtes-vous certain de vouloir continuer ? | Cela entrainera la supression des {n} entrées liées, êtes-vous certain de vouloir continuer ?",
                            linkedEntries.length,
                        ),
                    )
                ) {
                    linkedEntries.forEach((entry) => {
                        batch.delete(doc(db, 'entries', entry.id));
                    });
                    await batch.commit();
                    await deleteDoc(projectRef);
                }
            } else {
                await deleteDoc(projectRef);
            }
        }
    }
    async function addPriority(name: string) {
        await addDoc(collection(db, 'priorities'), {
            name,
            completed: false,
            user: user.value?.uid,
        });
    }
    async function deletePriority(priority: Priority, force = false) {
        if (force || confirm(t('Êtes vous certain de vouloir supprimer cette priorité ?'))) {
            await deleteDoc(doc(db, 'priorities', priority.id));
        }
    }
    function deleteCompletedPriorities() {
        const completed = priorities.value.filter((p: Priority) => p.completed);

        if (completed.length !== 0) {
            if (confirm(t('Êtes vous certain de vouloir supprimer les priorités complétées ?'))) {
                completed.forEach((p) => deletePriority(p, true));
            }
        } else {
            alert(t('Aucune priorité complétée à supprimer'));
        }
    }
    function $reset() {
        projects.value = [];
        priorities.value = [];
        entries.value = [];
    }

    return {
        // state
        user,
        menuOpened,
        selectedDay,
        filter,
        selectedTabIndex,
        sort,
        weekObjective,
        projects,
        entries,
        priorities,
        // getters
        weekStart,
        weekEnd,
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
        // actions
        addEntry,
        updateEntry,
        deleteEntry,
        toggleEntrySynced,
        addProject,
        deleteProject,
        addPriority,
        deletePriority,
        deleteCompletedPriorities,
        $reset,
    };
});
