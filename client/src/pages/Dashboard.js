import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Container, makeStyles, LinearProgress, Card, Typography } from '@material-ui/core'
import { MuiPickersUtilsProvider, DatePicker, Day } from "@material-ui/pickers"
import DateFnsUtils from '@date-io/date-fns'
import { ru } from 'date-fns/locale'
import lightGreen from "@material-ui/core/colors/lightGreen";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import AccauntApi from '../axios/accaunt'
import { logout } from '../redux/actions/userActions'

const useStyles = makeStyles({
    container: {
        paddingTop: 20
    },
    helpText: {
        marginLeft:20
    }
})

const materialTheme = createMuiTheme({
    overrides: {
        MuiPickersDay: {
            daySelected: {
                backgroundColor: lightGreen["400"],
            },

        },
    },
});

const Dashboard = ({ token }) => {
    const classes = useStyles()
    const [videoDates, setVideoDates] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await AccauntApi.getVideoDates(token)
                setVideoDates(data)
            } catch (error) {
                console.log(error)
                if (error.response.data.error && error.response.data.error.name === 'TokenExpiredError') {
                    dispatch(logout())
                }
            }
        }
        fetchData()
    }, [token, dispatch])
    if (videoDates) {
        return (
            <Container className={classes.container}>
                <Card>
                    <ThemeProvider theme={materialTheme}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ru}>
                            <DatePicker
                                autoOk
                                variant="static"
                                readOnly="true"
                                disableFuture="true"
                                disableToolbar="true"
                                value={new Date()}
                                onChange={() => { }}
                                renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
                                    return <Day
                                        children={dayComponent.props.children}
                                        current={new Date().getTime() === day.getTime()}
                                        disabled={new Date().getTime() < day.getTime()}
                                        hidden={!isInCurrentMonth}
                                        selected={videoDates.includes(day.getTime())}
                                    />
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </ThemeProvider>
                    <Typography variant="body2" className={classes.helpText}>
                        🟢 - отмечены дни, когда вы выкладываете пост. Не пропускайте :)
                    </Typography>
                </Card>
            </Container>
        )
    } else {
        return (
            <LinearProgress />
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
    }
}

export default connect(mapStateToProps, null)(Dashboard)