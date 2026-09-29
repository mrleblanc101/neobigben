export interface ConfirmOptions {
    title: string;
    description?: string;
    confirmLabel?: string;
    /** Styles the confirm button as destructive */
    destructive?: boolean;
}

interface ConfirmRequest extends ConfirmOptions {
    resolve: (confirmed: boolean) => void;
}

/** Asks for confirmation through the app's shared `<ConfirmDialog>`; resolves to whether the user confirmed */
export function useConfirm() {
    const request = useState<ConfirmRequest | null>("confirm:request", () => null);

    function confirm(options: ConfirmOptions) {
        request.value?.resolve(false);
        return new Promise<boolean>((resolve) => {
            request.value = { ...options, resolve };
        });
    }

    function settle(confirmed: boolean) {
        request.value?.resolve(confirmed);
        request.value = null;
    }

    return { request, confirm, settle };
}
