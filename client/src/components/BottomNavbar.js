import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import DateRangeIcon from '@material-ui/icons/DateRange'
import EqualizerIcon from '@material-ui/icons/Equalizer'
import { Link } from 'react-router-dom'
import { Toolbar } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    menuButton: {
        flexGrow: 1,
        color: 'inherit'
    },
}))

export default function BottomNavbar() {
    const classes = useStyles()

    return (
        <AppBar position="fixed" color="primary" className={classes.appBar}>
            <Toolbar>
                <IconButton component={Link} to="/dashboard" className={classes.menuButton}>
                    <DateRangeIcon />
                </IconButton>
                <IconButton component={Link} to="/accaunts" className={classes.menuButton}>
                    <EqualizerIcon />
                </IconButton>
                {/* <IconButton component={Link} to="/user" className={classes.menuButton}>
                    <AccountCircleIcon />
                </IconButton> */}
            </Toolbar>
        </AppBar>
    )
}