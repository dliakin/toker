import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, CardActions, Button, makeStyles, Container, CardHeader, LinearProgress } from '@material-ui/core'
import PlanApi from '../axios/plan'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom';

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
    const classes = useStyles();
    let location = useLocation()

    useEffect(() => {
        try {
            async function fetchData() {
                const plans = await PlanApi.all(token,new URLSearchParams(location.search))
                setPlans(plans)
            }
            fetchData()
        } catch (error) {
            //Ничего не делаем
        }
    }, [token])

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
                            <Button variant="contained" fullWidth color="secondary" target="_self" href={row.url}>
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