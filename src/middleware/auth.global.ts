export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser();
    const getRouteBaseName = useRouteBaseName({ route: to });
    const localePath = useLocalePath({ route: to });

    const { auth = true } = to.meta as { auth: boolean | 'guest' };
    if (auth === 'guest' && user && getRouteBaseName(to) !== 'index') {
        return navigateTo({
            path: localePath({ name: 'index' }),
        });
    }
    if (auth === true && !user && getRouteBaseName(to) !== 'login') {
        return navigateTo({
            path: localePath({ name: 'login' }),
        });
    }
});
