import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Container, LinearProgress, makeStyles, ListItem, ListItemText, List, TextField, Card, CardContent, Chip } from '@material-ui/core'
import AdminApi from '../../axios/admin'
import { logout } from '../../redux/actions/userActions'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20,
        marginBottom: 104
    },
    search: {
        width: "100%"
    },
    filtersCard: {
        marginTop: 20
    },
    filtersContent: {
        padding: 16,
        "&:last-child": {
            paddingBottom: 16
        }
    },
}))

const AdminDashboard = ({ token }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [searchString, setSearchString] = useState("")
    const [filters, setFilters] = useState({ pays: true, today: false })

    useEffect(() => {

        async function fetchData() {
            try {
                const data = await AdminApi.dashboard(token)
                setData(data)
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

    const handleClick = (name, value) => {
        setFilters({ ...filters, [name]: value })
    }


    if (data) {
        var filterData = data.filter(obj => {
            return (
                (!filters.pays || (filters.pays && !obj.paidTo.toLowerCase().includes("заявка")))
                && (obj.email.toLowerCase().includes(searchString.toLowerCase())
                    || obj.id.toString().toLowerCase().includes(searchString.toLowerCase())
                    || obj.paidTo.toLowerCase().includes(searchString.toLowerCase())
                    || (obj.tel && obj.tel.toLowerCase().includes(searchString.toLowerCase()))
                    || (obj.telegramUser && obj.telegramUser.toLowerCase().includes(searchString.toLowerCase()))
                    || (obj.utm && obj.utm.toLowerCase().includes(searchString.toLowerCase()))
                )
            )
        })
        console.log(filterData)
        return (
            <Container className={classes.container}>
                <TextField id="user-search" label="Поиск" type="search" variant="outlined" className={classes.search} onChange={handleChange} />
                <Card className={classes.filtersCard}>
                    <CardContent className={classes.filtersContent}>
                        <Chip
                            label="Оплаты"
                            onClick={() => handleClick("pays", !filters.pays)}
                            variant={filters.pays ? "default" : "outlined"}
                            color="secondary"
                            value={filters.pays}
                            className={classes.filter}
                        />
                    </CardContent>
                </Card>
                <List >
                    {filterData.map((row) => (
                        <ListItem key={row.id}>
                            <ListItemText primary={row.email} secondary={row.paidTo} />
                        </ListItem>
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

export default connect(mapStateToProps, null)(AdminDashboard)