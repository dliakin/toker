import { LOGIN_API, LOGOUT, REGISTER_API, UPDATE_USER_DATA_API, CHECK_PAY_API, SET_DEFAULT_ACCAUNT_ID_API, REGISTER, SET_WELCOME } from "../types"

export const login = (form) => ({
    type: LOGIN_API,
    form,
})

export const register = (form) => ({
    type: REGISTER_API,
    form,
})

export const registerDirect = (form) => ({
    type: REGISTER,
    payload: form,
})

export const logout = () => ({
    type: LOGOUT,
})

export const updateUserData = (form, token) => ({
    type: UPDATE_USER_DATA_API,
    form,
    token
})

export const checkPay = (token) => ({
    type: CHECK_PAY_API,
    token
})

export const setDefaultAccauntId = (accauntId, token) => ({
    type: SET_DEFAULT_ACCAUNT_ID_API,
    accauntId,
    token
})

export const setWelcome = (flag) => ({
    type: SET_WELCOME,
    flag
})