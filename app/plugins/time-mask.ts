import type { Directive } from "vue";
import Inputmask from "inputmask";

// Hours 00–23, minutes 00–59: times of day, and durations, which stay under 24 hours
const timeMask = { regex: "(?:[01]\\d|2[0-3]):[0-5]\\d", placeholder: "HH:MM" };

/**
 * `v-time-mask` restricts an input to HH:MM between 00:00 and 23:59, showing the HH:MM slots while typing.
 * It serves both times of day and durations, as entries last less than 24 hours.
 * `v-time-mask.advance` moves on to the form's next field once the time is typed in full.
 */
const timeMaskDirective: Directive<HTMLInputElement, unknown, "advance"> = {
    mounted(el, binding) {
        Inputmask({ ...timeMask, showMaskOnHover: false }).mask(el);
        if (!binding.modifiers.advance) return;
        // The mask dispatches an input event for each typed character, while values set from code dispatch none:
        // a complete, focused field on input has just been typed in full. The form's own input handler, registered
        // before this one, has already taken the value. Waiting for Vue to render it (a microtask, done before the next
        // keystroke) lets the next field's Tab order follow the new value, e.g. Durée leaving it once Fin is set.
        el.addEventListener("input", () => {
            if (document.activeElement === el && el.inputmask?.isComplete()) nextTick(() => focusNextField(el));
        });
    },
    beforeUnmount(el) {
        Inputmask.remove(el);
    },
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("time-mask", timeMaskDirective);
});

declare module "vue" {
    interface GlobalDirectives {
        vTimeMask: typeof timeMaskDirective;
    }
}
