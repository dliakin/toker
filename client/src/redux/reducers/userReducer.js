import { LOGIN, LOGOUT, REGISTER, UPDATE_USER_DATA, CHECK_PAY, NEED_PAY, SET_DEFAULT_ACCAUNT_ID, SET_WELCOME } from "../types"

const initialState = {
    userId: null,
    token: null,
    defaultAccauntId: null,
    isPartner: false,
    isAdmin: false,
    needPay: false,
    welcome: null,
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                userId: action.payload.userId,
                token: action.payload.token,
                email: action.payload.email,
                defaultAccauntId: action.payload.defaultAccauntId,
                isPartner: action.payload.isPartner,
                isAdmin: action.payload.isAdmin
            }
        case REGISTER:
            return {
                ...state,
                userId: action.payload.userId,
                token: action.payload.token,
                email: action.payload.email,
            }
        case LOGOUT:
            return { ...state, userId: null, token: null, email: null, defaultAccauntId: null, needPay: false, isPartner: false, isAdmin: false }
        case UPDATE_USER_DATA:
            return { ...state, email: action.email }
        case SET_DEFAULT_ACCAUNT_ID:
            return { ...state, defaultAccauntId: action.defaultAccauntId }
        case CHECK_PAY:
            return { ...state, needPay: action.payload.isPay }
        case NEED_PAY:
            return { ...state, needPay: true }
        case SET_WELCOME:
            return { ...state, welcome: action.flag }
        default: return state
    }
}