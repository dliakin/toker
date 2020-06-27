import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { connect } from 'react-redux'
import { hideAlert } from '../redux/actions/systemActions'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    snackbar: {
        paddingBottom: 56
    },
})

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const AlertDialog = ({ alert, hideAlert }) => {
    const classes = useStyles()
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        hideAlert()
    };

    return (
        <Snackbar open={alert.open} autoHideDuration={3000} className={classes.snackbar}>
            <Alert severity={alert.type} onClose={handleClose} >{alert.msg}</Alert>
        </Snackbar>
    )
}

const mapStateToProps = state => {
    return {
        alert: state.system.alert
    }
}

const mapDispatchToProps = {
    hideAlert,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialog)