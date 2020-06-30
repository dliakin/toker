import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { accauntReducer } from './reducers/accauntReducer'
import { userReducer } from './reducers/userReducer'
import { systemReducer } from './reducers/systemReducer'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'

export default () => {

  const reducer = {
    accaunt: accauntReducer,
    user: userReducer,
    system: systemReducer,
  }

  const sagaMiddleware = createSagaMiddleware()

  const middleware = [...getDefaultMiddleware(), sagaMiddleware]

  const preloadedState = loadState()

  const store = configureStore({
    reducer,
    middleware,
    devTools: true,
    preloadedState,
  })

  store.subscribe(throttle(() => {
    saveState({
      user: store.getState().user,
    })
  }, 1000))
  sagaMiddleware.run(rootSaga)

  return store
}