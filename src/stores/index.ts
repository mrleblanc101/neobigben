import { defineStore } from 'pinia';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    writeBatch,
    getDoc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { globalFirestoreOptions, firestoreDefaultConverter } from 'vuefire';
import type { UserCredential } from 'firebase/auth';

const addDefaultFields = {
    toFirestore(docData: DocumentData): DocumentData {
        return {
            created_at: serverTimestamp(),
            ...docData,
        }
    },
    fromFirestore: firestoreDefaultConverter.fromFirestore,
};

export const useIndexStore = defineStore('store', () => {
    const db = useFirestore();
    const authUser = useCurrentUser();
    const nuxtApp = useNuxtApp();
    const { $moment } = nuxtApp;
    const { t } = nuxtApp.$i18n;

    const selectedDay = ref($moment().format('YYYY-MM-DD'));
    const filter = useLocalStorage('filter', ref('daily'));
    const selectedTabIndex = useLocalStorage('selectedTabIndex', ref(0));
    const sort = useLocalStorage('sort', ref('name'));
    const user = useDocument<User>(
        computed(() => (authUser.value?.uid ? doc(collection(db, 'users'), authUser.value.uid) : null)),
    );
    const menuOpened = ref(false);
    const weekTarget = computed(() => user.value?.week_target || '40:00');

    const weekStart = computed(() => {
        return $moment(selectedDay.value).startOf('week').format('YYYY-MM-DD');
    });
    const weekEnd = computed(() => {
        return $moment(selectedDay.value).endOf('week').format('YYYY-MM-DD');
    });
    const projects = useCollection<Project>(
        computed(() => (authUser.value ? query(collection(db, 'projects'), where('user', '==', authUser.value.uid), orderBy('created_at')) : null)),
        {
            wait: true,
            ssrKey: 'projects',
        },
    );
    const bookmarks = useCollection<Bookmark>(
        computed(() => (authUser.value ? query(collection(db, 'bookmarks'), where('user', '==', authUser.value.uid), orderBy('created_at')) : null)),
        {
            wait: true,
            ssrKey: 'bookmarks',
        },
    );
    const entries = useCollection<Entry>(
        computed(() =>
            authUser.value
                ? query(
                      collection(db, 'entries'),
                      where('user', '==', authUser.value.uid),
                      where('date', '>=', weekStart.value),
                      where('date', '<=', weekEnd.value),
                  )
                : null,
        ),
        {
            wait: true,
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
        return $moment.duration(weekTarget.value).subtract($moment.duration(weekTotal.value)).format('HH:mm', {
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
        const isGoal = $moment.duration(time).asHours() === $moment.duration(weekTarget.value).asHours() / 5;
        const isOvertime = $moment.duration(time).asHours() > $moment.duration(weekTarget.value).asHours() / 5;
        const isBelow = $moment.duration(time).asHours() >= $moment.duration(weekTarget.value).asHours() / 5 - 0.5;

        if (isZero) {
            return 'text-gray-400 dark:text-gray-600';
        } else if (isOvertime) {
            return 'text-lime-500';
        } else if (isGoal) {
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
        await addDoc(collection(db, 'entries').withConverter(addDefaultFields), {
            ...entry,
            user: authUser.value!.uid,
            project: entry.project?.id ? doc(db, 'projects', entry.project.id) : null,
        });
    }
    async function updateEntry(entry: Entry) {
        await updateDoc(doc(db, 'entries', entry.id), {
            ...entry,
            project: entry.project?.id ? doc(db, 'projects', entry.project.id) : null,
        });
    }
    async function deleteEntry(entry: Entry, force = false) {
        if (force || confirm(t('Êtes vous certain de vouloir supprimer cette entrée ?'))) {
            await deleteDoc(doc(db, 'entries', entry.id));
        }
    }
    async function toggleEntrySynced(entry: Entry) {
        await updateDoc(doc(db, 'entries', entry.id), {
            is_synced: !entry.is_synced || true,
        });
    }
    async function addProject(option: Project) {
        const project = await addDoc(collection(db, 'projects').withConverter(addDefaultFields), {
            name: option.name,
            user: authUser.value!.uid,
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
    async function addBookmark(bookmark: Bookmark) {
        const addhttp = (url: string) => {
            if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
                url = "https://" + url;
            }
            return url;
        }

        await addDoc(collection(db, 'bookmarks').withConverter(addDefaultFields), {
            ...bookmark,
            url: addhttp(bookmark.url),
            user: authUser.value!.uid,
        });
    }
    async function deleteBookmark(bookmark: Bookmark, force = false) {
        if (force || confirm(t('Êtes vous certain de vouloir supprimer ce raccourci ?'))) {
            await deleteDoc(doc(db, 'bookmarks', bookmark.id));
        }
    }
    async function createUserInfo(result: UserCredential) {
        const docRef = doc(db, 'users', result.user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            await setDoc(docRef, {
                week_target: '40:00',
            });
        }
        await updateDoc(docRef, {
            display_name: result.user.displayName,
            email: result.user.email,
            photo_url: result.user.photoURL,
        })
    }
    async function updateWeekTarget(week_target: string) {
        await updateDoc(doc(db, 'users', authUser.value!.uid), {
            week_target,
        });
    }
    function $reset() {
        projects.value = [];
        bookmarks.value = [];
        entries.value = [];
        user.value = null;
    }

    return {
        // state
        user,
        menuOpened,
        selectedDay,
        filter,
        selectedTabIndex,
        sort,
        projects,
        entries,
        bookmarks,
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
        addBookmark,
        deleteBookmark,
        createUserInfo,
        updateWeekTarget,
        $reset,
    };
});
