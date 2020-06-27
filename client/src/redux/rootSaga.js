import { accauntSagaWatcher } from './sagas/accauntSagas';
import { userSagaWatcher } from './sagas/userSagas';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  try {
    yield all([
      ...accauntSagaWatcher,
      ...userSagaWatcher,
    ])
  } catch (error) {
    console.log("Root Error", error.response)
  }

}