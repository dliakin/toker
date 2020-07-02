import React, { useState, useEffect } from 'react'
import { updateUserData, setDefaultAccauntId } from '../redux/actions/userActions'
import { loadAccaunts } from '../redux/actions/accauntActions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { TextField, Container, Typography, Card, CardContent, CardActions, Button, makeStyles, InputLabel, Select, MenuItem } from '@material-ui/core'
import AuthApi from '../axios/auth'
import TelegramLoginButton from 'react-telegram-login'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20,
    },
    sub: {
        marginTop: 20,
    },
    select: {
        minWidth: 120,
    },
}));

const User = ({ user, updateUserData, accaunts, loadAccaunts, setDefaultAccauntId }) => {
    const classes = useStyles()
    const [isEdit, setIsEdit] = useState(false)
    const [userData, setUserData] = useState(null)

    const [form, setForm] = useState({
        email: user.email, password: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const handleTelegramResponse = async response => {
        const data = await AuthApi.telegramLogin(response, user.token)
        setUserData({ ...userData, tgUser: data.tgUser })

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
        loadAccaunts(user.token)
    }, [user, loadAccaunts])

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

    const handleChange = async (event) => {
        if (event.target.value !== -1)
            await setDefaultAccauntId(event.target.value, user.token)
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
                <CardActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/plans"
                    >
                        Продлить
                    </Button>
                </CardActions>
            </Card>}
            {userData && <Card className={classes.sub}>
                <Typography>
                    Телеграм
                </Typography>
                <CardContent>
                    {userData.tgUser ? <Typography>Логин в телеграм: {userData.tgUser}</Typography>
                        : <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="tokerteambot" />
                    }
                </CardContent>
            </Card>}
            {userData && <Card className={classes.sub}>
                <Typography>
                    Аккаунт ТикТока
                </Typography>
                <CardContent>
                    <InputLabel id="tiktok-id">TikTok</InputLabel>
                    <Select
                        labelId="tiktok-id-label"
                        id="tiktok-id-select"
                        value={user.defaultAccauntId || -1}
                        onChange={handleChange}
                        className={classes.select}
                    >
                        {!user.defaultAccauntId && <MenuItem value={-1} key={-1}>Выберите аккаунт</MenuItem>}
                        {accaunts.map((row) => (
                            <MenuItem value={row.id} key={row.id}>{row.uniqueId}</MenuItem>
                        ))}

                    </Select>
                </CardContent>
            </Card>}
        </Container >
    )
}

const mapStateToProps = state => {
    return {
        accaunts: state.accaunt.accaunts,
        user: state.user,
    }
}

const mapDispatchToProps = {
    updateUserData,
    loadAccaunts,
    setDefaultAccauntId,
}

export default connect(mapStateToProps, mapDispatchToProps)(User)