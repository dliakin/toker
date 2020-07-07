import { takeEvery, put, call } from 'redux-saga/effects'
import { LOAD_ACCAUNTS, LOAD_ACCAUNTS_API, ADD_ACCAUNT_API, ADD_ACCAUNT, GET_ACCAUNT_API, GET_ACCAUNT, SET_FOLLOWERS_GOAL_API, SET_FOLLOWERS_GOAL, DELETE_ACCAUNT_API, DELETE_ACCAUNT } from '../types'
import AccauntApi from '../../axios/accaunt'
import { safeSaga } from './safeSaga'

export const accauntSagaWatcher = [
    takeEvery(LOAD_ACCAUNTS_API, safeSaga(loadAccauntsSaga)),
    takeEvery(ADD_ACCAUNT_API, safeSaga(addAccauntSaga)),
    takeEvery(GET_ACCAUNT_API, safeSaga(getAccauntSaga)),
    takeEvery(SET_FOLLOWERS_GOAL_API, safeSaga(setFollowersGoalSaga)),
    takeEvery(DELETE_ACCAUNT_API, safeSaga(deleteAccauntSaga)),
]

function* loadAccauntsSaga(action) {
    const payload = yield call(loadAccaunts, action.payload)
    yield put({ type: LOAD_ACCAUNTS, payload })
}

function* addAccauntSaga(action) {
    const payload = yield call(addAccaunt, action.accaunt.uniqueId, action.token)
    if (payload) {
        yield put({ type: ADD_ACCAUNT, payload })
    }

}

function* getAccauntSaga(action) {
    const payload = yield call(getAccaunt, action.id, action.token)
    yield put({ type: GET_ACCAUNT, payload })
}

function* setFollowersGoalSaga(action) {
    const payload = yield call(setFollowersGoal, action.goal, action.id, action.token)
    yield put({ type: SET_FOLLOWERS_GOAL, payload })
}

function* deleteAccauntSaga(action) {
    yield call(deleteAccaunt, action.id, action.token)
    yield put({ type: DELETE_ACCAUNT, id: action.id })
}

async function loadAccaunts(token) {
    const data = await AccauntApi.all(token);
    return data
}

async function addAccaunt(uniqueId, token) {
    const data = await AccauntApi.add({ uniqueId }, token);
    return data
}

async function getAccaunt(id, token) {
    const data = await AccauntApi.get(id, token);
    return data
}

async function setFollowersGoal(goal, id, token) {
    const data = await AccauntApi.setGoal({ goal, id }, token);
    return data
}

async function deleteAccaunt(id, token) {
    const data = await AccauntApi.delete(id, token);
    return data
}