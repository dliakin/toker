import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Container, LinearProgress, makeStyles, ListItem, ListItemText, List, TextField, ListItemSecondaryAction, Typography, Divider, Card, CardContent } from '@material-ui/core'
import PartnerApi from '../../axios/partner'
import { logout } from '../../redux/actions/userActions'
import PullToRefresh from 'rmc-pull-to-refresh'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20,
        marginBottom: 104
    },
    search: {
        width: "100%"
    },
    pays: {
        textAlign: "right"
    },
    filtersCard: {
        marginBottom: 20
    },
    filtersContent: {
        padding: 16,
        "&:last-child": {
            paddingBottom: 16
        }
    },
    paidOut: {
        fontFamily: 'Roboto,Helvetica Neue,Arial,sans-serif',
    },
    realSum: {
        fontFamily: 'Roboto,Helvetica Neue,Arial,sans-serif',
    },
}))

const PartnerDashboard = ({ token }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = useState(false)
    const [data, setData] = useState()
    const [totalPaidOutSum, setTotalPaidOutSum] = useState(0)
    const [searchString, setSearchString] = useState("")

    useEffect(() => {

        async function fetchData() {
            try {
                const data = await PartnerApi.pays(token)
                setData(data.data)
                setTotalPaidOutSum(data.totalPaidOutSum)
            } catch (error) {
                if (error.response.data.error && error.response.data.error.name === 'TokenExpiredError') {
                    dispatch(logout())
                }
            }
        }
        fetchData()
    }, [token, dispatch])

    const handleChange = (e) => {
        try {
            setSearchString(e.target.value)
        } catch (e) {
            setSearchString("")
        }
    }

    if (data) {
        var filterData = data.filter(obj => {
            return (
                obj.email.toLowerCase().includes(searchString.toLowerCase())
                || (obj.from && obj.from.toLowerCase().includes(searchString.toLowerCase()))
            )
        })
        return (
            <Container className={classes.container}>
                <PullToRefresh
                    direction="down"
                    refreshing={refreshing}
                    onRefresh={async () => {
                        const data = await PartnerApi.pays(token)
                        setData(data.data)
                        setTotalPaidOutSum(data.totalPaidOutSum)
                        setRefreshing(true)
                        setTimeout(() => {
                            setRefreshing(false)
                        }, 1000);
                    }}
                    indicator={{ activate: <></>, deactivate: <></>, release: <LinearProgress />, finish: <></> }}
                    damping={150}
                >
                    <Card className={classes.filtersCard}>
                        <CardContent className={classes.filtersContent}>
                            <Typography display="inline">К выплате: </Typography>
                            <Typography className={classes.paidOut} display="inline" color="secondary">{totalPaidOutSum} ₽</Typography>
                        </CardContent>
                    </Card>
                    <TextField id="user-search" label="Поиск" type="search" variant="outlined" className={classes.search} onChange={handleChange} />

                    <List >
                        {filterData.map((row) => (
                            <div key={`item_${row.id}`}>
                                <ListItem key={row.id}>
                                    <ListItemText primary={row.email} secondary={`${row.date} ${row.from != null ? row.from : ""}`} />
                                    <ListItemSecondaryAction className={classes.pays}>
                                        <Typography className={classes.paidOut} color={!row.paidOut ? "secondary" : "primary"}>{!row.paidOut ? "+" : ""}{row.paidOutSum} ₽</Typography>
                                        <Typography className={classes.realSum} >{row.realSum} ₽</Typography>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider key={`divider_${row.id}`} />
                            </div >
                        ))}
                    </List>
                </PullToRefresh>
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

export default connect(mapStateToProps, null)(PartnerDashboard)