import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes';
import TopNavbar from './components/TopNavbar';
import { useSelector } from 'react-redux'
import AlertDialog from './components/AlertDialog';
import BottomNavbar from './components/BottomNavbar';
import AlertBottomPannel from './components/AlertBottomPannel';

function App() {
  const token = useSelector(state => state.user.token)
  const isAuthenticated = !!token
  const needPay = useSelector(state => state.user.needPay)
  const welcome = useSelector(state => state.user.welcome)
  const routes = useRoutes(isAuthenticated, needPay, welcome)

  return (
    <>
      <Router >
        {isAuthenticated && <TopNavbar />}
        {routes}
        {isAuthenticated && <AlertBottomPannel />}
        {isAuthenticated && <BottomNavbar />}
      </Router>
      <AlertDialog />
    </>
  );
}

export default App;
