import React, { useState, useEffect } from 'react'
import { updateUserData, setDefaultAccauntId, setWelcome } from '../redux/actions/userActions'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { TextField, Container, Typography, Card, CardContent, Button, makeStyles, Paper, MobileStepper, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core'
import AuthApi from '../axios/auth'
import TelegramLoginButton from 'react-telegram-login'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import SearchTikTokAccauntDialog from '../components/SearchTikTokAccauntDialog'
import ReactPlayer from 'react-player'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20,
    },
    card: {
        marginBottom: 20,
    },
    header: {
        marginBottom: 20,
    },
    content: {
        marginBottom: 20,
    },
    helpText: {
        marginTop: 20,
    }
}))

const stepsHeaders = [
    {
        label: 'Добро пожаловать!'
    },
    {
        label: 'Привяжите Телеграм'
    },
    {
        label: 'Добавьте аккаунт ТикТок'
    },
    {
        label: 'Введите новый пароль'
    },
    {
        label: 'Добавьте на рабочий стол'
    },
]

const Welcome = ({ user, accaunts, setDefaultAccauntId, updateUserData, setWelcome }) => {
    const classes = useStyles()
    const history = useHistory()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        email: user.email, password: '', password_repeat: ''
    })
    const [error, setError] = useState({ show: false, text: '' })

    const [activeStep, setActiveStep] = useState(0)
    const maxSteps = 5

    const handleNext = async () => {
        if (activeStep === 1 && user.defaultAccauntId) {
            setActiveStep((prevActiveStep) => prevActiveStep + 2)
            return
        }
        if (activeStep === 2) {
            await setDefaultAccauntId(accaunts[accaunts.length - 1].id, user.token)
        }
        if (activeStep === 3) {
            if (form.password !== form.password_repeat) {
                setError({ show: true, text: 'Пароли не совпадают' })
                return
            }
            if (form.password !== "") {
                await updateUserData(form, user.token)
            }
        }
        if (activeStep === 4) {
            setWelcome(false)
            history.push('/accaunts')
            return
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        if (activeStep === 3 && user.defaultAccauntId) {
            setActiveStep((prevActiveStep) => prevActiveStep - 2)
            return
        }
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleTelegramResponse = async response => {
        const data = await AuthApi.telegramLogin(response, user.token)
        setUserData({ ...userData, tgUser: data.tgUser })
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const changeHandler = event => {
        setError({ show: false, text: '' })
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await AuthApi.loadUserData(user.token)
                setUserData(data)
                if (data.tgUser && user.defaultAccauntId) {
                    setWelcome(false)
                    history.push('/accaunts')
                    return
                }
            } catch (error) {

            }
        }
        setLoading(true)
        fetchData()
        setLoading(false)
    }, [user, history, setWelcome])

    useEffect(() => {

        setWelcome(true)
    }, [setWelcome])

    return (
        <Container className={classes.container}>
            <Paper square elevation={0} className={classes.header}>
                <Typography className={classes.header}>{stepsHeaders[activeStep].label}</Typography>
            </Paper>
            <div className={classes.content}>
                {activeStep === 0 &&
                    <Typography>Я рада приветствовать вас в нашем клубе TOKER TEAM. Для завершения регистрации нужно выполнить несколько шагов.<br /><br />Нажимайте далее</Typography>
                }
                {activeStep === 1 ?
                    userData.tgUser ? <Typography>Логин в телеграм: {userData.tgUser}</Typography>
                        : <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="tokerteambot" />
                    : <></>
                }
                {activeStep === 2 &&
                    <Button variant="contained" onClick={handleClickOpen}>{accaunts[accaunts.length - 1] ? "Изменить" : "Добавить"}</Button>
                }
                {activeStep === 2 && accaunts[accaunts.length - 1] &&
                    <ListItem key={accaunts[accaunts.length - 1].uniqueId}>
                        <ListItemAvatar>
                            <Avatar
                                alt={accaunts[accaunts.length - 1].uniqueId}
                                src={accaunts[accaunts.length - 1].cover}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={accaunts[accaunts.length - 1].uniqueId}
                            secondary={accaunts[accaunts.length - 1].nickName}
                        />
                    </ListItem>
                }
                {activeStep === 3 && <Card className={classes.card}>
                    <CardContent>
                        <form>
                            <TextField
                                id="password"
                                name="password"
                                label="Пароль"
                                value={form.password}
                                type="password"
                                autoComplete="off"
                                onChange={changeHandler}
                            />
                            <TextField
                                id="password_repeat"
                                name="password_repeat"
                                label="Ещё раз пароль"
                                value={form.password_repeat}
                                type="password"
                                autoComplete="off"
                                error={error.show}
                                helperText={error.text}
                                onChange={changeHandler}
                            />
                        </form>
                    </CardContent>
                </Card>}
                {activeStep === 4 && <ReactPlayer
                    url="https://dashacher.ru/app2.mp4"
                    playing={false}
                    height="480px"
                    width="100%"
                    controls={true}
                />}
            </div>
            <MobileStepper
                steps={maxSteps}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={
                            // activeStep === maxSteps - 1
                            loading
                            || !userData
                            /*|| (activeStep === 1 && userData && !userData.tgUser)*/
                            || (activeStep === 2 && !accaunts[accaunts.length - 1])
                        }
                    >
                        {activeStep === maxSteps - 1 ? 'Завершить' : 'Далее'}
                        {activeStep !== maxSteps - 1 && <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0 || loading}>
                        <KeyboardArrowLeft />
                         Назад
                    </Button>
                }
            />
            <Typography className={classes.helpText}>Если у вас что-то не получается, пожалуйста напишите в  телеграм <a href="https://t.me/dlyakin" target="_blank">@dlyakin</a></Typography>
            {<SearchTikTokAccauntDialog open={open} onClose={handleClose} />}
        </Container >
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
        accaunts: state.accaunt.accaunts,
    }
}

const mapDispatchToProps = {
    setDefaultAccauntId,
    updateUserData,
    setWelcome,
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)