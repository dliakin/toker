import { SHOW_ALERT, HIDE_ALERT } from "../types"

export const showAlert = (msg) => ({
    type: SHOW_ALERT,
    payload: msg,
})

export const hideAlert = () => ({
    type: HIDE_ALERT,
})