/**
 * Keydown handler for a form: Backspace in an empty time field (Durée, Fin) moves to the end of the previous time field.
 * Only masked time fields take part; a time field counts as empty while it only shows its HH:MM placeholder.
 * Bind it in the capture phase (`@keydown.capture`) so it sees the field before the mask handles the key.
 */
export function focusPreviousOnBackspace(event: KeyboardEvent) {
    const field = event.target;
    const form = event.currentTarget;
    if (event.key !== "Backspace" || !(form instanceof HTMLElement) || !(field instanceof HTMLInputElement)) return;
    if (!("inputmask" in field) || /\d/.test(field.value) || field.selectionStart !== field.selectionEnd) return;

    const timeFields = [...form.querySelectorAll<HTMLInputElement>("input:not(:disabled)")].filter(input => "inputmask" in input);
    const previous = timeFields[timeFields.indexOf(field) - 1];
    if (!previous) return;

    event.preventDefault();
    // Masked fields place the caret themselves on focus
    previous.focus();
}

/** Focuses the field after this one in its form, placing the caret at the end; fields left out of the Tab order are skipped */
export function focusNextField(field: HTMLInputElement | HTMLTextAreaElement) {
    const form = field.closest("form");
    if (!form) return;
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input:not([type=hidden]):not(:disabled), textarea:not(:disabled)")]
        .filter(input => input === field || input.tabIndex >= 0);
    const next = fields[fields.indexOf(field) + 1];
    if (!next) return;
    next.focus();
    // Masked fields place the caret themselves on focus
    if (!("inputmask" in next)) next.setSelectionRange(next.value.length, next.value.length);
}
