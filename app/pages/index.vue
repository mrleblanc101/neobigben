<template>
    <div class="flex min-h-svh flex-col">
        <TrackerAppHeader />
        <div class="grid flex-1 items-start lg:grid-cols-[minmax(0,1fr)_clamp(300px,30vw,360px)]">
            <main class="flex min-w-0 flex-col gap-4 p-6">
                <TrackerDayToolbar />
                <TrackerEntriesTable />
            </main>
            <TrackerSidePanel class="border-t lg:sticky lg:top-14 lg:min-h-[calc(100svh-3.5rem)] lg:border-t-0 lg:border-l" />
        </div>
        <TrackerEntryDialog />
    </div>
</template>
