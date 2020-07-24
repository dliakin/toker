import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Container, LinearProgress, makeStyles, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Link } from '@material-ui/core'
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
    noTgLink: {
        color: "red"
    },
    tgLink: {
        color: "blue"
    }
}))

const AdminDashboard = ({ token }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [filterData, setFilterData] = useState()

    useEffect(() => {

        async function fetchData() {
            try {
                const data = await AdminApi.pays(token)
                setData(data)
                setFilterData(data)
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
            const searchString = e.target.value
            const tempFilterData = data.filter(obj => {
                return (
                    obj.email.toLowerCase().includes(searchString.toLowerCase())
                    || obj.id.toString().toLowerCase().includes(searchString.toLowerCase())
                    || obj.createdAt.toLowerCase().includes(searchString.toLowerCase())
                    || (obj.utm && obj.utm.toLowerCase().includes(searchString.toLowerCase())
                    )
                )
            })
            setFilterData(tempFilterData)
        } catch (e) {
            setFilterData(data)
        }
    }

    if (filterData) {
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
                                <TableCell align="left" className={classes.cell}>Сумма</TableCell>
                                <TableCell align="left" className={classes.cell}>Дата Оплаты</TableCell>
                                <TableCell align="left" className={classes.cell}>Доступ До</TableCell>
                                <TableCell align="left" className={classes.cell}>From</TableCell>
                                <TableCell align="left" className={classes.cell}>Ref</TableCell>
                                <TableCell align="left" className={classes.cell}>Телефон</TableCell>
                                <TableCell align="left" className={classes.cell}>Телеграм</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterData.map((row) => (
                                <TableRow key={`${row.id}_${row.payId}`}>
                                    <TableCell align="left" className={classes.cell}>{row.id}</TableCell>
                                    <TableCell align="left" className={classes.cell}>{row.email}</TableCell>
                                    <TableCell align="left" className={classes.cell}>{row.realSum}</TableCell>
                                    <TableCell align="left" className={classes.cell}>{row.createdAt}</TableCell>
                                    <TableCell align="left" className={classes.cell}>{row.paidTo}</TableCell>
                                    <TableCell align="left" className={classes.cell}>{row.from}</TableCell>
                                    <TableCell align="left" className={classes.cell}>{row.ref}</TableCell>
                                    <TableCell align="left" className={classes.cell}>{row.tel}</TableCell>
                                    <TableCell align="left" className={classes.cell}>
                                        {row.telegramCotected
                                            ? <div className={classes.tgLink}>{
                                                row.telegram.username
                                                    ? <Link href={`https://t.me/${row.telegram.username}`} >
                                                        @{row.telegram.username}
                                                    </Link>
                                                    : row.telegram.first_name || row.telegram.last_name
                                                        ? `${row.telegram.first_name !== null ? row.telegram.first_name : ''} ${row.telegram.last_name !== null ? row.telegram.last_name : ''}`
                                                        : row.telegramName
                                                            ? row.telegramName
                                                            : 'Привязан'
                                            }</div>
                                            : <div className={classes.noTgLink}>{
                                                row.telegramName
                                                    ? row.telegramName
                                                    : 'Не привязан'
                                            }</div>
                                        }
                                    </TableCell>
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