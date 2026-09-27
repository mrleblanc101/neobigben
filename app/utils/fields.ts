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
