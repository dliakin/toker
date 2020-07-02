import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { makeStyles, Container, Button } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { Link } from 'react-router-dom'
import SystemApi from '../axios/system'

const useStyles = makeStyles({
    root: {
        padding: 0,
        marginBottom: 56,
        position: "fixed",
        bottom: 0,
    },
    alert: {
        fontSize: "0.75rem"
    }
})



const AlertDialog = ({ token }) => {
    const classes = useStyles()
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const alert = await SystemApi.getBottomALert(token)
                console.log("getBottomALert: ", alert)
                setAlert(alert)
            } catch (error) {

            }
        }

        const interval = setInterval(() => {
            fetchData()
        }, 3600000)
        
        return () => clearInterval(interval)
    })

    if (alert) {
        return (
            <Container className={classes.root}>
                <Alert
                    className={classes.alert}
                    severity={alert.type}
                    action={
                        alert.action && <Button
                            size="small"
                            variant="outlined"
                            component={Link}
                            onClick={() => setAlert(null)}
                            to={alert.action.link}
                        >
                            {alert.action.text}
                        </Button>
                    }
                >
                    {alert.message}
                </Alert>
            </Container>
        )
    } else {
        return (
            <></>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
    }
}

export default connect(mapStateToProps, null)(AlertDialog)