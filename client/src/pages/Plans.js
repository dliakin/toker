import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, CardActions, Button, makeStyles, Container } from '@material-ui/core'
import PlanApi from '../axios/plan'
import { connect } from 'react-redux'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20
    },
    card: {
        maxWidth: 300,
        margin: '0 auto',
    },
    name: {
        color: 'rgb(36, 30, 18)',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '1rem',
        lineHeight: 1.5,
    },
    description: {
        color: 'rgb(112, 108, 100)',
        textAlign: 'center',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.5,
    },
    duration: {
        color: 'rgb(112, 108, 100)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '0.875rem',
        lineHeight: 1.5,
    },
    price: {
        color: 'rgb(36, 30, 18)',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '1.625rem',
        lineHeight: 1.25,
    },
    button: {
        fontWeight: 500,
        fontSize: '1rem',
        borderRadius: '9999px',
        textAlign: 'center',
    },
    cardactions: {
        display: 'block',
        textAlign: 'center',
    }
}));

const Plans = ({ token }) => {
    const [plans, setPlans] = useState()
    const classes = useStyles();

    useEffect(() => {
        try {
            async function fetchData() {
                const plans = await PlanApi.all(token)
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
                        <CardContent>
                            <Typography className={classes.name}>
                                {row.name}
                            </Typography>
                            <Typography className={classes.description}>
                                {row.description}
                            </Typography>
                            <Typography className={classes.price}>
                                {row.price}
                            </Typography>
                            <Typography className={classes.duration}>
                                {row.duration} месяц
                        </Typography>
                        </CardContent>
                        <CardActions className={classes.cardactions}>
                            <Button color="primary" variant="contained" className={classes.button} target="_self" href={row.url}>Купить</Button>
                        </CardActions>
                    </Card>))}
            </Container>
        )
    } else {
        return (
            <Container>
                <Typography>
                    На данный момент мест в клубе нет. Оставь свою почту, что бы не пропустить продажи
                </Typography>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
    }
}

export default connect(mapStateToProps, null)(Plans)