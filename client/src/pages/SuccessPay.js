import React, { useEffect } from 'react'
import { checkPay } from '../redux/actions/userActions'
import { connect } from 'react-redux'
import { Container, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles({
    container: {
        paddingTop: 20
    },

})

const SuccessPay = ({ token, checkPay }) => {
    const classes = useStyles()

    useEffect(() => {
        checkPay(token)
    }, [checkPay, token])

    return (
        <Container className={classes.container}>
            <Typography>Проверка оплаты...</Typography>
        </Container>
    )
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
    }
}

const mapDispatchToProps = {
    checkPay
}

export default connect(mapStateToProps, mapDispatchToProps)(SuccessPay)