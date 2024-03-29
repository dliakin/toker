import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, CardActions, Button, makeStyles, Container, CardHeader, LinearProgress } from '@material-ui/core'
import PlanApi from '../axios/plan'
import { connect, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom';
import { logout } from '../redux/actions/userActions'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20,
        marginBottom: 104,
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        padding: 0,
    },
    cardPricingTotal: {
        padding: 0
    },
    card: {
        marginBottom: 25,
    },
    cardContent: {
        padding: 10
    },
}));

const Plans = ({ token }) => {
    const [plans, setPlans] = useState()
    const dispatch = useDispatch()
    const classes = useStyles();
    let location = useLocation()

    useEffect(() => {
        try {
            async function fetchData() {
                const plans = await PlanApi.all(new URLSearchParams(location.search))
                setPlans(plans)
            }
            fetchData()
        } catch (error) {
            if (error.response.data.error && error.response.data.error.name === 'TokenExpiredError') {
                dispatch(logout())
            }
        }
    }, [location.search, dispatch])

    const clickPayHandler = async (id) => {
        const payload = await PlanApi.getPayUrl(id, new URLSearchParams(location.search), token)
        window.location = payload.payurl
    }

    if (plans) {
        return (
            <Container className={classes.container}>
                {plans.map((row) => (
                    <Card key={row.id} className={classes.card}>
                        <CardHeader
                            title={row.duration + (row.duration === 1 ? " МЕСЯЦ" : row.duration > 1 && row.duration < 5 ? " МЕСЯЦА" : " МЕСЯЦЕВ")}
                            subheader={row.subheader}
                            titleTypographyProps={{ align: 'center', }}
                            subheaderTypographyProps={{ align: 'center' }}
                            // action={row.name === 'Pro' ? <StarIcon /> : null}
                            className={classes.cardHeader}

                        />
                        <CardContent className={classes.cardContent}>
                            <div className={classes.cardPricing}>
                                <Typography component="h2" variant="h3" color="textPrimary" p={1}>
                                    {row.price / row.duration}
                                </Typography>
                                <Typography variant="h6" color="textSecondary" >
                                    {" руб/месяц"}
                                </Typography>
                            </div>
                            <div className={classes.cardPricingTotal}>
                                <Typography variant="subtitle1" align="center" >
                                    {row.price + " руб"}
                                </Typography>
                            </div>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" fullWidth color="secondary" target="_self" onClick={() => clickPayHandler(row.id)}>
                                {"ОПЛАТИТЬ НА " + row.duration + (row.duration === 1 ? " МЕСЯЦ" : row.duration > 1 && row.duration < 5 ? " МЕСЯЦА" : " МЕСЯЦЕВ")}
                            </Button>
                        </CardActions>
                    </Card>
                ))}
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

export default connect(mapStateToProps, null)(Plans)