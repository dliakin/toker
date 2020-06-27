import React from 'react'
import App from './App'
import { Provider } from 'react-redux'

const Root = ({ store }) => (
    // <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    // </React.StrictMode>
)

export default Root