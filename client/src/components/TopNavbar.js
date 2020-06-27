import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { useHistory, useLocation } from 'react-router-dom'
import { logout } from '../redux/actions/userActions'
import { connect } from 'react-redux';
import { AccountCircle } from '@material-ui/icons'
import { Menu, MenuItem } from '@material-ui/core'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}))



const TopNavbar = ({ logout }) => {
    const classes = useStyles()
    const history = useHistory()
    let location = useLocation()
    const [anchorEl, setAnchorEl] = useState(null)
  
    const isMenuOpen = Boolean(anchorEl);

    const logoutHandler = event => {
        logout()
        history.push('/')
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
      }

    const menuId = 'primary-search-account-menu'
    const renderMenu = (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} to="/user" onClick={handleMenuClose}>Профиль</MenuItem>
          <MenuItem onClick={logoutHandler}>Выйти</MenuItem>
        </Menu>
      )

    let headerText = ''
    if (location) {
        switch (location.pathname) {
            case '/feed':
                headerText = 'Лента'
                break
            case '/accaunts':
                headerText = 'Аккаунты'
                break
            case '/user':
                headerText = 'Настройки'
                break
            default:
                headerText = ''
                break
        }
    }
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" className={classes.title}>
                        {headerText}
                    </Typography>
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    {/* <Button color="inherit" onClick={logoutHandler}>Выйти</Button> */}
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    );
}

const mapDispatchToProps = {
    logout
}

export default connect(null, mapDispatchToProps)(TopNavbar)