import React, { useState } from 'react'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { login, register } from '../redux/actions/userActions'
import { connect } from 'react-redux';

const AuthPage = ({ login, register }) => {

    const [form, setForm] = useState({
        email: '', password: ''
    })
    const [isLoading, setIsLoading] = useState(false)



    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            setIsLoading(true);
            register({ ...form })
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    const loginHandler = async () => {
        try {
            setIsLoading(true);
            login(form)
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <Typography>
                Токет Club
                </Typography>
            <Card>
                <CardContent>
                    <Typography>
                        Авторизация
                    </Typography>
                    <form>
                        <div>
                            <TextField
                                id="email"
                                name="email"
                                label="Введите Email"
                                value={form.email}
                                onChange={changeHandler}
                            />
                        </div>
                        <div>
                            <TextField
                                id="password"
                                name="password"
                                label="Введите пароль"
                                value={form.password}
                                type="password"
                                autoComplete="on"
                                onChange={changeHandler}
                            />
                        </div>
                    </form>
                </CardContent>
                <CardActions>
                    <Button
                        disabled={isLoading}
                        onClick={loginHandler}
                    >
                        Войти
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={registerHandler}
                    >
                        Регистрация
                    </Button>
                </CardActions>
            </Card>
        </Container>
    )
}

const mapDispatchToProps = {
    login,
    register,
}

export default connect(null, mapDispatchToProps)(AuthPage)