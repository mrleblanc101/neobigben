/**
 * Keydown handler for a form: Backspace in an empty field moves to the end of the previous field.
 * A masked time field counts as empty while it only shows its HH:MM placeholder.
 * Bind it in the capture phase (`@keydown.capture`) so it sees the field before the mask handles the key.
 */
export function focusPreviousOnBackspace(event: KeyboardEvent) {
    const field = event.target;
    const form = event.currentTarget;
    if (event.key !== "Backspace" || !(form instanceof HTMLElement)) return;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

    const masked = "inputmask" in field;
    const empty = masked ? !/\d/.test(field.value) : field.value === "";
    if (!empty || field.selectionStart !== field.selectionEnd) return;

    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input:not([type=hidden]):not(:disabled), textarea:not(:disabled)")];
    const previous = fields[fields.indexOf(field) - 1];
    if (!previous) return;

    event.preventDefault();
    previous.focus();
    // Masked fields place the caret themselves on focus
    if (!("inputmask" in previous)) previous.setSelectionRange(previous.value.length, previous.value.length);
}
