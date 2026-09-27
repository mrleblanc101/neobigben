// inputmask ships without types: only what the time mask directive uses
declare module "inputmask" {
    interface InputmaskInstance {
        mask(el: HTMLElement): void;
        isComplete(): boolean;
        setValue(value: string): void;
    }

    global {
        interface HTMLElement {
            /** Set on elements the mask is applied to */
            inputmask?: InputmaskInstance;
        }
    }

    interface InputmaskStatic {
        (options: Record<string, unknown>): InputmaskInstance;
        remove(el: HTMLElement): void;
    }

    const Inputmask: InputmaskStatic;
    export default Inputmask;
}
