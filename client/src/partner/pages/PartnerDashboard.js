import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Container, LinearProgress, makeStyles, ListItem, ListItemText, List, TextField, ListItemSecondaryAction, Typography, Divider, Card, CardContent } from '@material-ui/core'
import PartnerApi from '../../axios/partner'
import { logout } from '../../redux/actions/userActions'

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
}))

const PartnerDashboard = ({ token }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [totalPaidOutSum, setTotalPaidOutSum] = useState(0)
    const [searchString, setSearchString] = useState("")

    useEffect(() => {

        async function fetchData() {
            try {
                const data = await PartnerApi.pays(token)
                console.log(data)
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
            )
        })
        console.log(filterData)
        return (
            <Container className={classes.container}>
                <Card className={classes.filtersCard}>
                    <CardContent className={classes.filtersContent}>
                        К выплате: {totalPaidOutSum} ₽
                    </CardContent>
                </Card>
                <TextField id="user-search" label="Поиск" type="search" variant="outlined" className={classes.search} onChange={handleChange} />

                <List >
                    {filterData.map((row) => (
                        <div key={`item_${row.id}`}>
                            <ListItem key={row.id}>
                                <ListItemText primary={row.email} secondary={row.date} />
                                <ListItemSecondaryAction className={classes.pays}>
                                    <Typography color={!row.paidOut ? "secondary" : "primary"}>{!row.paidOut ? "+" : ""}{row.paidOutSum} ₽</Typography>
                                    <Typography >{row.realSum} ₽</Typography>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider key={`divider_${row.id}`} />
                        </div >
                    ))}
                </List>
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