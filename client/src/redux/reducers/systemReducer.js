import { SHOW_ALERT, HIDE_ALERT } from '../types'

const initialState = {
    alert: {
        open: false,
        msg: '',
        type: 'info',
    },
}

export const systemReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ALERT:
            return { ...state, alert: { open: true, msg: action.payload.msg, type: action.payload.type || 'info' } }
        case HIDE_ALERT:
            return { ...state, alert: { open: false, msg: '', type: 'info' } }
        default: return state
    }
}