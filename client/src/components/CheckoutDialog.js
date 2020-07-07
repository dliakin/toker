import React, { useState } from 'react'
import { Dialog, Typography, Button, makeStyles, List, ListItem, ListItemText, Grid, TextField, Divider } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import { registerDirect } from '../redux/actions/userActions'
import PlanApi from '../axios/plan'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: theme.spacing(1, 0),
    },
    title: {
        marginTop: theme.spacing(2),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    dialogTitle: {
        fontSize: '22px',
        fontFamily: 'Roboto,Arial,sans-serif',
        fontWeight: 600,
    }
}))

const CheckoutDialog = (props) => {
    const classes = useStyles()
    let location = useLocation()

    const { onClose, plan, open, registerDirect } = props

    const [form, setForm] = useState({ name: '', tel: '', email: '', telegram: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({ name: false, tel: false, email: false, telegram: false })

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
        setError({ ...error, [event.target.name]: false })
    }

    const registerHandler = async (e) => {
        try {
            e.preventDefault()
            if (form.name === "") {
                setError({ ...error, name: true })
                return
            }

            if (form.tel === "") {
                setError({ ...error, tel: true })
                return
            }
            if (form.email === "") {
                setError({ ...error, email: true })
                return
            }
            if (form.telegram === "") {
                setError({ ...error, telegram: true })
                return
            }
            setIsLoading(true)
            const payload = await PlanApi.get(plan.id, form, new URLSearchParams(location.search))
            console.log(payload)
            window.location = payload.payurl
            if (payload.user) {
                registerDirect(payload.user)
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <Dialog
            maxWidth="sm"
            fullWidth={true}
            onClose={handleClose}
            open={open}
        >
            <MuiDialogTitle><Typography className={classes.dialogTitle}>Оформить доступ в клуб</Typography></MuiDialogTitle>
            <MuiDialogContent>
                <List disablePadding>
                    <ListItem className={classes.listItem} key={plan.id}>
                        <ListItemText primary={plan.name} secondary={plan.description} />
                        <Typography variant="body2">{plan.price} руб</Typography>
                    </ListItem>
                </List>
                <Divider />
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Имя"
                                name="name"
                                autoComplete="name"
                                error={error.name}
                                value={form.name}
                                onChange={changeHandler}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="tel"
                                label="Телефон"
                                name="tel"
                                type="tel"
                                autoComplete="tel"
                                error={error.tel}
                                value={form.tel}
                                onChange={changeHandler}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                type="email"
                                error={error.email}
                                autoComplete="email"
                                value={form.email}
                                onChange={changeHandler}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="telegram"
                                label="Ник в Телеграм"
                                id="telegram"
                                error={error.telegram}
                                value={form.telegram}
                                onChange={changeHandler}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={registerHandler}
                        disabled={isLoading}
                    >
                        Оплатить
                    </Button>
                </form>
            </MuiDialogContent>
        </Dialog>
    );
}

const mapDispatchToProps = {
    registerDirect,
}

export default connect(null, mapDispatchToProps)(CheckoutDialog)