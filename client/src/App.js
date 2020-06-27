import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes';
import TopNavbar from './components/TopNavbar';
import { useSelector } from 'react-redux'
import AlertDialog from './components/AlertDialog';
import BottomNavbar from './components/BottomNavbar';

function App() {
  const token = useSelector(state => state.user.token)
  const isAuthenticated = !!token
  const needPay = useSelector(state => state.user.needPay)
  const routes = useRoutes(isAuthenticated, needPay)

  return (
    <>
      <Router >
        {isAuthenticated && <TopNavbar />}
        <div>
          {routes}
        </div>
        {isAuthenticated && <BottomNavbar />}
      </Router>
      <AlertDialog />
    </>
  );
}

export default App;
