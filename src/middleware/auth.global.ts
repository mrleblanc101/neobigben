export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser();
    const localeRoute = useLocaleRoute({ route: to });
    const localePath = useLocalePath({ route: to });

    if (to.name !== localeRoute('login')?.name && !user) {
        return navigateTo({
            path: localePath({ name: 'login' }),
        });
    }
    if (to.name === localeRoute('login')?.name && user) {
        return navigateTo({
            path: localePath({ name: 'index' }),
        });
    }
});
