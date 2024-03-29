import { takeEvery, put, call } from 'redux-saga/effects'
import { LOGIN_API, LOGIN, REGISTER, REGISTER_API, UPDATE_USER_DATA_API, UPDATE_USER_DATA, CHECK_PAY_API, CHECK_PAY, SET_DEFAULT_ACCAUNT_ID_API, SET_DEFAULT_ACCAUNT_ID } from '../types'
import AuthApi from '../../axios/auth'
import PayApi from '../../axios/plan'
import { safeSaga } from './safeSaga'

export const userSagaWatcher = [
    takeEvery(LOGIN_API, safeSaga(loginSaga)),
    takeEvery(REGISTER_API, safeSaga(registerSaga)),
    takeEvery(UPDATE_USER_DATA_API, safeSaga(updateUserDataSaga)),
    takeEvery(CHECK_PAY_API, safeSaga(checkPaySaga)),
    takeEvery(SET_DEFAULT_ACCAUNT_ID_API, safeSaga(setDefaultAccauntIdSaga)),
]

function* loginSaga(action) {
    const payload = yield call(login, action.form)
    yield put({ type: LOGIN, payload })
}

function* registerSaga(action) {
    const payload = yield call(register, action.form)
    yield put({ type: REGISTER, payload })
}

function* updateUserDataSaga(action) {
    yield call(updateUserData, action.form, action.token)
    yield put({ type: UPDATE_USER_DATA, email: action.form.email })
}

function* checkPaySaga(action) {
    const payload = yield call(checkPay, action.token)
    yield put({ type: CHECK_PAY, payload })
}

function* setDefaultAccauntIdSaga(action) {
    yield call(setDefaultAccauntId, action.accauntId, action.token)
    yield put({ type: SET_DEFAULT_ACCAUNT_ID, defaultAccauntId: action.accauntId })
}

async function register(form) {
    const data = await AuthApi.register({ ...form })
    return data
}

async function login(form) {
    const data = await AuthApi.login({ ...form })
    return data
}

async function updateUserData(form, token) {
    const data = await AuthApi.updateUserData({ ...form }, token)
    return data
}

async function checkPay(token) {
    const data = await PayApi.checkPay(token)
    return data
}

async function setDefaultAccauntId(accauntId, token) {
    const data = await AuthApi.setDefaultAccauntId({accauntId}, token)
    return data
}