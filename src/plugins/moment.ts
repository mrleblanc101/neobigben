import moment from 'moment';
import 'moment/locale/fr';
import momentDurationFormatSetup from 'moment-duration-format';

export default defineNuxtPlugin((nuxtApp) => {
    moment.locale('fr');
    console.log(moment.locale());
    momentDurationFormatSetup(moment);
    return {
        provide: {
            moment,
        },
    };
});
