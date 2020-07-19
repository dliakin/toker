import React from 'react'
import { connect } from 'react-redux'
import { Container, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles({
    container: {
        paddingTop: 20
    },

})

const SuccessTg = () => {
    const classes = useStyles()

    return (
        <Container className={classes.container}>
            <Typography>Телеграм подключён.<br/>Можно закрыть это окно...</Typography>
        </Container>
    )
}



export default connect(null, null)(SuccessTg)