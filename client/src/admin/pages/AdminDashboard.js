import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Container, LinearProgress, makeStyles, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core'
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
    cell: {
        paddingRight: 2,
        paddingLeft: 2,
    },
    tablecontainer: {
        marginTop: 20
    },
}))

const AdminDashboard = ({ token }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [searchString, setSearchString] = useState("")

    useEffect(() => {

        async function fetchData() {
            try {
                const data = await AdminApi.pays(token)
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

    if (data) {
        var filterData = data.filter(obj => {
            return (
                obj.email.toLowerCase().includes(searchString.toLowerCase())
                || obj.id.toString().toLowerCase().includes(searchString.toLowerCase())
                || obj['Pays.createdAt'].toLowerCase().includes(searchString.toLowerCase())
                || (obj.utm && obj.utm.toLowerCase().includes(searchString.toLowerCase())
                )
            )
        })
        console.log(filterData)
        return (
            <Container className={classes.container}>
                <TextField id="user-search" label="Поиск" type="search" variant="outlined" className={classes.search} onChange={handleChange} />

                <TableContainer component={Paper} className={classes.tablecontainer}>
                    <Table size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" className={classes.cell}>Id</TableCell>
                                <TableCell align="left" className={classes.cell}>Email</TableCell>
                                <TableCell align="left" className={classes.cell}>Дата</TableCell>
                                <TableCell align="right" className={classes.cell}>Сумма</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterData.map((row) => (
                                <TableRow key={`${row.id}_${row['Pays.id']}`}>
                                    <TableCell align="left" className={classes.cell}>{row.id}</TableCell>
                                    <TableCell align="left" className={classes.cell}>{row.email}</TableCell>
                                    <TableCell align="left" className={classes.cell}>{row['Pays.createdAt']}</TableCell>
                                    <TableCell align="right" className={classes.cell}>{row['Pays.realSum']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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