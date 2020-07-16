import React, { useState, useEffect } from 'react'
import { setWelcome } from '../redux/actions/userActions'
import { connect, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, Typography, Button, makeStyles, Paper, MobileStepper } from '@material-ui/core'
import AuthApi from '../axios/auth'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import SearchTikTokAccauntDialog from '../components/SearchTikTokAccauntDialog'
import { NEED_PAY } from '../redux/types'

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
        label: 'Добавьте на рабочий стол'
    },
    {
        label: 'Введите новый пароль'
    },
    {
        label: 'Добавьте на рабочий стол'
    },
]

const Welcome = ({ user, setWelcome }) => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const [activeStep, setActiveStep] = useState(0)
    const maxSteps = 2

    const handleNext = async () => {
        if (activeStep === 1) {
            setWelcome(false)
            history.push('/accaunts')
            return
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleClose = () => {
        setOpen(false)
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
                if (error.response.status === 402) {
                    dispatch({ type: NEED_PAY })
                }
            }
        }
        setLoading(true)
        fetchData()
        setLoading(false)
    }, [user, history, setWelcome, dispatch])

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
                {activeStep === 1 &&
                    <Typography>
                        Чат нашего клуба находится в Телеграм, для того что-бы получить доступ - напишите нашему боту. Нажмите на ссылку ниже:
                       <br />
                        <Button variant="contained" color="primary" href={`https://t.me/tokerteambot?start=${user.userId}`} target="_blank" rel="noopener noreferrer">
                            Получить доступ
                        </Button>
                    </Typography>
                }
                {/* {activeStep === 2 &&
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
                            /><br />
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
                </Card>} */}
                {/* {activeStep === 2 && <ReactPlayer
                    url="https://dashacher.ru/app2.mp4"
                    playing={false}
                    height="480px"
                    width="100%"
                    controls={true}
                />} */}
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
                            //|| (activeStep === 2 && !accaunts[accaunts.length - 1])
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
            <Typography className={classes.helpText}>Если у вас что-то не получается, пожалуйста напишите в  телеграм <a href="https://t.me/dlyakin" target="_blank" rel="noopener noreferrer">@dlyakin</a></Typography>
            {<SearchTikTokAccauntDialog open={open} onClose={handleClose} />}
        </Container >
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = {
    setWelcome,
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)