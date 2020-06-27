import { LOGIN, LOGOUT, REGISTER, UPDATE_USER_DATA, CHECK_PAY,NEED_PAY } from "../types"

const initialState = {
    userId: null,
    token: null,
    needPay: false
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, userId: action.payload.userId, token: action.payload.token, email: action.payload.email }
        case REGISTER:
            return { ...state, userId: action.payload.userId, token: action.payload.token }
        case LOGOUT:
            return { ...state, userId: null, token: null }
        case UPDATE_USER_DATA:
            return { ...state, email: action.email }
        case CHECK_PAY:
            return { ...state, needPay: action.payload.isPay }
        case NEED_PAY:
            return { ...state, needPay: true }
        default: return state
    }
}