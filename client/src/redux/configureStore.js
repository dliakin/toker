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

  const sagaMiddleware = createSagaMiddleware({
    //TODO Глобальная обработка ошибок
    // onError: (error) => {
    //   console.log("Saga Error", error.response)
    //   if (error.response.status && error.response.status === 402) {
    //     store.dispatch({ type: NEED_PAY })
    //   }
    //   else if (error.response.status && error.response.status === 401) {
    //     store.dispatch({ type: LOGOUT })
    //   }
    //   else if (error.response.data.message) {
    //     store.dispatch({ type: SHOW_ALERT, payload: { msg: error.response.data.message, type: 'error' } })

    //   } else {
    //     store.dispatch({ type: SHOW_ALERT, payload: { msg: 'Что-то пошло не так. Попробуйте ещё раз', type: 'error' } })
    //   }
    // }
  })

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