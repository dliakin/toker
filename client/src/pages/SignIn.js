import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { login } from '../redux/actions/userActions'
import { connect } from 'react-redux'
import { Link as RLink } from 'react-router-dom'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://toker.team/">
                Toker Team
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

const SignIn = ({ login }) => {
    const classes = useStyles()

    const [form, setForm] = useState({ email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async (e) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            login({ ...form })
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Вход
        </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
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
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={form.password}
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
                        Войти
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item xs>
                            <Link component={RLink} to="/reset" variant="body2">
                                {"Забыли пароль? Восстановить."}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RLink} to="/#plans" variant="body2">
                                Нет аккаунта? Выбрать тариф
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    )
}

const mapDispatchToProps = {
    login,
}

export default connect(null, mapDispatchToProps)(SignIn)