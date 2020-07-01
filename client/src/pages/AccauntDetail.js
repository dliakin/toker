import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import PullToRefresh from 'rmc-pull-to-refresh'
import { LinearProgress, Box, Grid, Typography, Avatar, Link, makeStyles, IconButton, Container, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import numeral from 'numeral'
import { getAccaunt } from '../redux/actions/accauntActions'
import SetFollowersGoalDialog from '../components/SetFollowersGoalDialog'

const useStyles = makeStyles((theme) => ({
    container: {
        textAlign: 'center',
        marginBottom: 104
    },
    nickname: {
        paddingLeft: "36%"
    },
    editNicknameGrid: {
        textAlign: "right"
    },
    editNickname: {
        padding: "5px 0px"
    },
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        margin: "0 auto",
    },
    currentStatsGrid: {
        marginTop: "5px"
    },
    paperGoal: {
        padding: "10px 5px 0px 5px"
        , marginTop: "5px"
    },
    progress: {
        height: "25px"
    },
    dataTable: {
        marginTop: "5px"
    }
}));

const AccauntDetail = ({ accaunt, token, getAccaunt }) => {
    const classes = useStyles()
    const [refreshing, setRefreshing] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [open, setOpen] = useState(false);
    const accauntId = useParams().id

    useEffect(() => {
        getAccaunt(accauntId, token)
    }, [getAccaunt, accauntId, token])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    if (accaunt) {
        return (
            <Container className={classes.container}>
                <PullToRefresh
                    direction="down"
                    refreshing={refreshing}
                    onRefresh={async () => {
                        getAccaunt(accauntId, token)
                        setRefreshing(true)
                        setTimeout(() => {
                            setRefreshing(false)
                        }, 1000);
                    }}
                    indicator={{ activate: <></>, deactivate: <></>, release: <LinearProgress />, finish: <></> }}
                    damping={150}
                >
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={9}>
                                <Typography variant="h5" className={classes.nickname}>
                                    {accaunt.nickName}
                                </Typography>
                            </Grid>
                            <Grid item xs={3} className={classes.editNicknameGrid}>
                                <IconButton aria-label="delete" className={classes.editNickname} onClick={handleClickOpen}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Avatar alt={accaunt.nickName} src={accaunt.cover} className={classes.avatar} />
                        <Link target="_blank" href={`https://www.tiktok.com/@${accaunt.uniqueId}/`} variant="caption" gutterBottom color="textSecondary">
                            @{accaunt.uniqueId}
                        </Link>
                    </Box>
                    <Grid container spacing={3} className={classes.currentStatsGrid}>
                        <Grid item xs>
                            <Paper>
                                <Typography variant="h6" >
                                    {numeral(accaunt.fans).format("0,0")}
                                    <span style={{
                                        fontSize: "12px",
                                        verticalAlign: "middle",
                                        color: "green"
                                    }}>
                                         (+{accaunt.fans-accaunt.data[0].fans})
                                    </span>
                                </Typography>
                                <Typography variant="body2" >
                                    подписчиков
                        </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs>
                            <Paper>
                                <Typography variant="h6" >
                                    {numeral(accaunt.heart).format("0,0")}
                                </Typography>
                                <Typography variant="body2" >
                                    лайков
                        </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    {accaunt['accauntExtra.goal'] &&
                        <Paper className={classes.paperGoal}>
                            <Box display="flex" alignItems="center">
                                <Box minWidth={35}>
                                    <Typography variant="body2" color="textSecondary">{numeral(accaunt['accauntExtra.goal_start_fans']).format("0[.]0a")}</Typography>
                                </Box>
                                <Box width="100%" mr={1} ml={1}>
                                    <LinearProgress variant="determinate" value={Math.floor((accaunt.fans - accaunt['accauntExtra.goal_start_fans']) * 100 / (accaunt['accauntExtra.goal'] - accaunt['accauntExtra.goal_start_fans']))} className={classes.progress} />
                                </Box>
                                <Box minWidth={35}>
                                    <Typography variant="body2" color="textSecondary">{numeral(accaunt['accauntExtra.goal']).format("0[.]0a")}</Typography>
                                </Box>
                            </Box>
                            <Typography variant="subtitle1" color="textSecondary">{Math.floor((accaunt.fans - accaunt['accauntExtra.goal_start_fans']) * 100 / (accaunt['accauntExtra.goal'] - accaunt['accauntExtra.goal_start_fans']))}% (осталось {numeral(accaunt['accauntExtra.goal'] - accaunt.fans).format("0[.]0a")})</Typography>
                        </Paper>}
                    <TableContainer component={Paper} className={classes.dataTable}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Дата</TableCell>
                                    <TableCell align="center">~</TableCell>
                                    <TableCell align="center">Всего</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {accaunt.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.date}>
                                        <TableCell align="left">{row.date}</TableCell>
                                        <TableCell align="center">{row.delta}</TableCell>
                                        <TableCell align="center">{row.fans}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[]}
                        component="div"
                        count={accaunt.data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                    />
                </PullToRefresh>
                {<SetFollowersGoalDialog open={open} onClose={handleClose} />}
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
        accaunt: state.accaunt.accaunt,
        token: state.user.token,
    }
}

const mapDispatchToProps = {
    getAccaunt
}

export default connect(mapStateToProps, mapDispatchToProps)(AccauntDetail)