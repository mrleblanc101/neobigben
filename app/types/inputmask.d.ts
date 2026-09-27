// inputmask ships without types: only what the time mask directive uses
declare module "inputmask" {
    interface InputmaskInstance {
        mask(el: HTMLElement): void;
    }

    interface InputmaskStatic {
        (options: Record<string, unknown>): InputmaskInstance;
        remove(el: HTMLElement): void;
    }

    const Inputmask: InputmaskStatic;
    export default Inputmask;
}
