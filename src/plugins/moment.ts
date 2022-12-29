import moment from 'moment';
import 'moment/dist/locale/fr-ca';
import momentDurationFormatSetup from 'moment-duration-format';

export default defineNuxtPlugin((nuxtApp) => {
    momentDurationFormatSetup(moment);
    moment.locale('fr-ca');
    return {
        provide: {
            moment,
        },
    };
});
