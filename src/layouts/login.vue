<template>
    <header class="fixed top-0 z-40 w-full border-b bg-stone-50 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex h-16 items-center justify-between px-4 lg:px-8">
            <button
                type="button"
                class="-m-2 flex rounded p-2 text-2xl font-black ring-primary-200 focus:outline-none focus:ring dark:ring-slate-600"
            >
                <Logo />
            </button>
        </div>
    </header>
    <main class="flex min-h-screen pt-16">
        <slot></slot>
    </main>
</template>
