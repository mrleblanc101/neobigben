import Inputmask from "inputmask";

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            inputmask: Inputmask,
        }
    }
})
