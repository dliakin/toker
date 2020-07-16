import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Accaunts from './pages/Accaunts'
import AccauntDetail from './pages/AccauntDetail'
import Plans from './pages/Plans'
import User from './pages/User'
import Feed from './pages/Feed'
import NewDetail from './pages/NewDetail'
import SuccessPay from './pages/SuccessPay'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Landing from './pages/Landing'
import Welcome from './pages/Welcome'
import Dashboard from './admin/pages/Dashboard'
import SuccessTg from './pages/SuccessTg'

export const useRoutes = (isAuthenticated, needPay, welcome) => {
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
        }
        else if (welcome === null || welcome === true) {
            return (
                <Switch>
                    <Route path="/welcome" exact>
                        <Welcome />
                    </Route>
                    <Route path="/tglink_ok" exact>
                        <SuccessTg />
                    </Route>
                    <Redirect to="/welcome" />
                </Switch>
            )
        }
        else {
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
                    <Route path="/welcome" exact>
                        <Welcome />
                    </Route>
                    <Route path="/admin/dashboard" exact>
                        <Dashboard />
                    </Route>
                    <Route path="/tglink_ok" exact>
                        <SuccessTg />
                    </Route>
                    <Redirect to="/accaunts" />
                </Switch>
            )
        }

    }
    return (
        <Switch>
            <Route path="/" exact>
                <Landing />
            </Route>
            <Route path="/signup" exact>
                <SignUp />
            </Route>
            <Route path="/signin" exact>
                <SignIn />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}