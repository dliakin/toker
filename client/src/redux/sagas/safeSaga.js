import { put } from 'redux-saga/effects';
import { SHOW_ALERT, LOGOUT, NEED_PAY } from '../types';

export function safeSaga(func) {
    return function* (args) {
        try {
            yield* func(args);
        } catch (error) {
            console.log(error)
            if (error.response && error.response.status && error.response.status === 402) {
                yield put({ type: NEED_PAY })
            }
            else if (error.response && error.response.status && error.response.status === 401) {
                yield put({ type: LOGOUT })
            }
            else if (error.response && error.response.data.message) {
                yield put({ type: SHOW_ALERT, payload: { msg: error.response.data.message, type: 'error' } })
            } else {
                yield put({ type: SHOW_ALERT, payload: { msg: 'Что-то пошло не так. Попробуйте ещё раз', type: 'error' } })
            }
        }
    }
}