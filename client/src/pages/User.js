import React, { useState, useEffect } from 'react'
import { updateUserData } from '../redux/actions/userActions'
import { connect } from 'react-redux'
import { TextField, Container, Typography, Card, CardContent, CardActions, Button, makeStyles } from '@material-ui/core'
import AuthApi from '../axios/auth'
import TelegramLoginButton from 'react-telegram-login'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20,
    },
    sub: {
        marginTop: 20,
    },
}));

const User = ({ user, updateUserData }) => {
    const classes = useStyles()
    const [isEdit, setIsEdit] = useState(false);
    const [userData, setUserData] = useState(null);

    const [form, setForm] = useState({
        email: user.email, password: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const handleTelegramResponse = async response => {
        await AuthApi.telegramLogin(response, user.token)
        console.log(response)

    }

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await AuthApi.loadUserData(user.token)
                setUserData(data)
            } catch (error) {

            }
        }
        fetchData()
    }, [user])

    const saveHandler = async () => {
        try {
            setIsLoading(true);
            updateUserData(form, user.token)
            setIsEdit(false)
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    return (
        <Container className={classes.container}>
            <Card>
                <Typography>
                    Изменение данных
                </Typography>
                <CardContent>
                    <form>
                        <div>
                            <TextField
                                id="email"
                                name="email"
                                label="Введите Email"
                                value={form.email}
                                onChange={changeHandler}
                                disabled={!isEdit}
                            />
                        </div>
                        <div>

                            <TextField
                                id="password"
                                name="password"
                                label="Введите пароль"
                                value={form.password}
                                type="password"
                                autoComplete="off"
                                onChange={changeHandler}
                                disabled={!isEdit}
                            />
                        </div>
                    </form>
                </CardContent>
                <CardActions>
                    {!isEdit && <Button
                        disabled={isLoading}
                        onClick={() => setIsEdit(true)}
                    >
                        Редактировать
                    </Button>}
                    {isEdit && <Button
                        disabled={isLoading}
                        onClick={saveHandler}
                    >
                        Сохранить
                    </Button>}
                    {isEdit && <Button
                        disabled={isLoading}
                        onClick={() => setIsEdit(false)}
                    >
                        Отмена
                    </Button>}
                </CardActions>
            </Card>
            {userData && <Card className={classes.sub}>
                <Typography>
                    Подписка клуба
                </Typography>
                <CardContent>
                    <Typography>
                        Тариф: {userData.planName}
                    </Typography>
                    <Typography>
                        Доступ до: {userData.paidTo}
                    </Typography>
                </CardContent>
            </Card>}
            {userData && <Card className={classes.sub}>
                <Typography>
                    Доступ в телеграм
                </Typography>
                <CardContent>
                    {userData.tgUser ? <Typography>Логин в телеграм: {userData.tgUser}</Typography>
                        : <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="tokerteambot" />
                    }
                </CardContent>
            </Card>}
        </Container >
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = {
    updateUserData
}

export default connect(mapStateToProps, mapDispatchToProps)(User)