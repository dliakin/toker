import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Container, Typography, makeStyles, LinearProgress, TableRow, TableCell, IconButton, Collapse, Table, TableHead, TableBody, TableContainer, Paper, Box } from '@material-ui/core'
import AdminApi from '../../axios/admin'
import { logout } from '../../redux/actions/userActions'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20,
        marginBottom: 104
    },
}))

const Dashboard = ({ token }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [open, setOpen] = React.useState(false)

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


    if (data) {
        console.log(data)
        return (
            <Container className={classes.container}>

                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow >
                                <TableCell />
                                <TableCell >id</TableCell>
                                <TableCell align="right">email</TableCell>
                                <TableCell align="right">Телефон</TableCell>
                                <TableCell align="right">Телеграм</TableCell>
                                <TableCell align="right">utm</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, i) => (
                                <React.Fragment key={`div_${i}`}>
                                    <TableRow key={`user_${row.id}`}>
                                        <TableCell>
                                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="right">{row.email}</TableCell>
                                        <TableCell align="right">{row.tel}</TableCell>
                                        <TableCell align="right">{(row.TelegramUser && row.TelegramUser.username) || row.telegramName}</TableCell>
                                        <TableCell align="right">{row.utm}</TableCell>
                                    </TableRow>
                                    <TableRow key={`pays_${row.id}`}>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={open} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Оплаты
                                            </Typography>
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>id</TableCell>
                                                                <TableCell>Дата</TableCell>
                                                                <TableCell align="right">Оплачено до</TableCell>
                                                                <TableCell align="right">Сумма</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {row.Pays.map((pay) => (
                                                                <TableRow key={`pay_${pay.id}`}>
                                                                    <TableCell component="th" scope="row">
                                                                        {pay.id}
                                                                    </TableCell>
                                                                    <TableCell>{pay.createdAt}</TableCell>
                                                                    <TableCell align="right">{pay.paidTo}</TableCell>
                                                                    <TableCell align="right">
                                                                        {pay.realSum}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment >
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

export default connect(mapStateToProps, null)(Dashboard)