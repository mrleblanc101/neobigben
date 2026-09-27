import type { Directive } from "vue";
import Inputmask from "inputmask";

// Hours 00–23, minutes 00–59
const clockMask = { regex: "(?:[01]\\d|2[0-3]):[0-5]\\d", placeholder: "HH:MM" };
// Hours 00–99, minutes 00–59
const durationMask = { mask: "99:M9", definitions: { M: { validator: "[0-5]" } }, placeholder: "HH:MM" };

/**
 * `v-time-mask` restricts an input to a valid HH:MM time of day and shows the __:__ slots while typing.
 * `v-time-mask:duration` allows hours above 23.
 */
const timeMask: Directive<HTMLInputElement> = {
    mounted(el, binding) {
        Inputmask({ ...(binding.arg === "duration" ? durationMask : clockMask), showMaskOnHover: false }).mask(el);
    },
    beforeUnmount(el) {
        Inputmask.remove(el);
    },
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("time-mask", timeMask);
});

declare module "vue" {
    interface GlobalDirectives {
        vTimeMask: typeof timeMask;
    }
}
