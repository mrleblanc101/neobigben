import type { Directive } from "vue";
import Inputmask from "inputmask";

// Hours 00–23, minutes 00–59: times of day, and durations, which stay under 24 hours
const timeMask = { regex: "(?:[01]\\d|2[0-3]):[0-5]\\d", placeholder: "HH:MM" };

/**
 * `v-time-mask` restricts an input to HH:MM between 00:00 and 23:59, showing the HH:MM slots while typing.
 * It serves both times of day and durations, as entries last less than 24 hours.
 * `v-time-mask.advance` moves on to the form's next field when a digit is typed into a time already typed in full,
 * with the caret at its end: that digit then starts the next field if it's another time.
 */
const timeMaskDirective: Directive<HTMLInputElement, unknown, "advance"> = {
    mounted(el, binding) {
        Inputmask({ ...timeMask, showMaskOnHover: false }).mask(el);
        if (!binding.modifiers.advance) return;
        // In the capture phase, to see the field before the mask adds the typed digit to it
        el.addEventListener("keydown", (event) => {
            const atEnd = el.selectionStart === el.value.length && el.selectionEnd === el.value.length;
            if (!/^\d$/.test(event.key) || event.ctrlKey || event.metaKey || event.altKey || !atEnd || !el.inputmask?.isComplete()) return;
            event.preventDefault();
            focusNextField(el);
            // The digit starts the next field when it's another time; the project or the note just get the focus
            const next = document.activeElement;
            if (!(next instanceof HTMLInputElement) || !next.inputmask) return;
            next.inputmask.setValue(event.key);
            next.dispatchEvent(new Event("input", { bubbles: true }));
            next.setSelectionRange(1, 1);
        }, { capture: true });
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
