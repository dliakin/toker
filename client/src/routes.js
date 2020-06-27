import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Accaunts from './pages/Accaunts'
import AccauntDetail from './pages/AccauntDetail'
import AuthPage from './pages/AuthPage'
import Plans from './pages/Plans'
import User from './pages/User'
import Feed from './pages/Feed'
import NewDetail from './pages/NewDetail'
import SuccessPay from './pages/SuccessPay'

export const useRoutes = (isAuthenticated, needPay) => {
    if (isAuthenticated) {
        if (needPay) {
            return (
                <Switch>
                    <Route path="/plans" exact>
                        <Plans />
                    </Route>
                    <Route path="/success" exact>
                        <SuccessPay />
                    </Route>
                    <Redirect to="/plans" />
                </Switch>
            )
        } else {
            return (
                <Switch>
                    <Route path="/accaunts" exact>
                        <Accaunts />
                    </Route>
                    <Route path="/accaunt/:id">
                        <AccauntDetail />
                    </Route>
                    <Route path="/user" exact>
                        <User />
                    </Route>
                    <Route path="/feed" exact>
                        <Feed />
                    </Route>
                    <Route path="/new/:id" exact>
                        <NewDetail />
                    </Route>
                    <Route path="/plans" exact>
                        <Plans />
                    </Route>
                    <Redirect to="/accaunts" />
                </Switch>
            )
        }

    }
    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}