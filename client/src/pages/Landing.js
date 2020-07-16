import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Paper, List, ListItem, ListItemIcon, ListItemText, IconButton, AppBar, Toolbar } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'
import Carousel from 'react-material-ui-carousel'
import { useLocation } from 'react-router-dom'
import InstagramIcon from '@material-ui/icons/Instagram'
import PlanApi from '../axios/plan'
import CheckoutDialog from '../components/CheckoutDialog'
import { Link } from 'react-router-dom'

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   )
// }

const useStyles = makeStyles((theme) => ({

  '@global': {
    body: {
      backgroundColor: '#000000',
    }
  },
  imgcarousel: {
    backgroundColor: '#000000',
  },
  img: {
    maxWidth: 720,
  },
  root: {
    backgroundColor: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    color: '#ffffff',
    fontFamily: 'Roboto,Arial,sans-serif',
    fontWeight: 600,
    letterSpacing: '2.5px',
    fontSize: '14px',
    textAlign: 'center',
    paddingTop: 30,
  },
  title: {
    color: '#ffffff',
    fontFamily: 'Roboto,Arial,sans-serif',
    fontWeight: 600,
    fontSize: '28px',
    textAlign: 'center',
    lineHeight: 1.23,
    paddingTop: 30,
  },
  text: {
    color: '#ffffff',
    fontFamily: 'Roboto,Arial,sans-serif',
    textAlign: 'left',
    paddingTop: 30,
    fontSize: '20px',
  },
  textCenter: {
    color: '#ffffff',
    fontFamily: 'Roboto,Arial,sans-serif',
    textAlign: 'center',
  },
  oldprice: {
    color: 'rgb(254, 47, 87)',
    fontFamily: 'Roboto,Arial,sans-serif',
    fontWeight: 600,
    fontSize: '46px',
    textAlign: 'center',
    lineHeight: 1.23,
    paddingTop: 30,
    paddingBottom: 30,
    textDecoration: 'line-through',
    textDecorationColor: '#ffffff',
    textDecorationThickness: '3px',
  },
  buttonOne: {
    textAlign: 'center',
    fontWeight: 700,
    paddingLeft: 50,
    paddingRight: 50,
    color: '#ffffff',
    border: '3px solid #ffffff',
    backgroundColor: '#fe2f57',
    borderRadius: 30,
    fontSize: 16,
    boxSizing: 'content-box',
    marginTop: 30,
  },
  buttonOneLabel: {
    padding: "10px 0px"
  },
  carousel: {
    marginTop: 30,
  },
  carouselalt: {
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: 'Roboto,Arial,sans-serif',
    fontSize: '18px',
    textAlign: 'center',
  },
  list: {
    color: '#ffffff',
  },
  listitem: {
    color: '#ffffff',
  },
  listitemicon: {
    color: 'rgb(0, 223, 200)',
  },
  listitemicon2: {
    color: 'rgb(254, 47, 87)'
  },
  listitemprimary: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: 300,
  },
  listitemsecondary: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: 300,
  },

  //Plans
  cardHeader: {
    color: 'rgb(254, 47, 87)',
    fontSize: '28px',
    textTransform: 'uppercase',
    fontFamily: 'Roboto,Arial,sans-serif',
    fontWeight: 600,
  },
  cardPricing: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPricingText: {
    color: 'rgb(255, 255, 255)',
    fontSize: '40px',
    marginBottom: '0px',
    fontFamily: 'Roboto,Arial,sans-serif',
    fontWeight: 600,
  },
  cardPricingTotal: {
    padding: 0,
    color: '#ffffff',
  },
  card: {
    border: '1px solid #00dfc8',
    borderRadius: '9px',
    backgroundColor: '#000000',
    margin: 20,
  },
  cardContent: {
    padding: 10
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },
  appbar: {
    backgroundColor: '#000000',
  }
}))


const items = [
  {
    alt: "Чат со всеми участниками клуба. Обратная связь по роликам. Мотивация. Окружение.",
    src: "/img/1.webp",
  },
  {
    alt: "Собственное приложение для аналитики аккаунта. Поможет определить, когда выкладывать пост и отслеживать результаты",
    src: "/img/2.webp",
  },
  {
    alt: "Канал с новостями, лайфхаками, туториалами, хештегами. Все, что поможет тебе быстрее набирать подписчиков.",
    src: "/img/3.webp",
  },
  {
    alt: "2,5 часа вебинара с самой полезной информацией по ТикТок. Как снимать, что снимать, как зарабатывать.",
    src: "/img/4.webp",
  }
]

const items2 = [
  {
    alt: "Эти видео сняты благодаря информации в клубе",
    src: "/img/21.png",
  },
  {
    alt: "Эти видео сняты благодаря информации в клубе",
    src: "/img/22.png",
  },
  {
    alt: "Эти видео сняты благодаря информации в клубе",
    src: "/img/23.png",
  },
  {
    alt: "Эти видео сняты благодаря информации в клубе",
    src: "/img/24.png",
  }
]

const list1items = [
  {
    primary: "Для предпринимателей и экспертов",
    secondary: "Возможность найти клиентов бесплатно",
  },
  {
    primary: "Для действующих блогеров",
    secondary: "Переводи аудиторию в Инстаграм и YouTube",
  },
  {
    primary: "Для всех тех, кто хочет стать блогером без вложений",
  },
  {
    primary: "Для всех тех, кто ищет дополнительный заработок",
  },
  {
    primary: "Для тех, кто хочет работать и путешествовать",
  },
  {
    primary: "Для тех, кому хочется признания и известности",
  },
]

const list2items = [
  {
    primary: "Смотри лекции по ТикТоку, Телеграм Канал с трендами",
  },
  {
    primary: "Используй лайфхаки",
  },
  {
    primary: "Используй приложение для отслеживания статистики",
  },
  {
    primary: "Задавай вопросы в закрытом чате",
  },
  {
    primary: "СНИМАЙ!",
  },
]

function Project(props) {
  const classes = useStyles()
  return (
    <Paper
      className={classes.imgcarousel}
      elevation={10}
    >
      <img alt={props.item.alt} height="320px" src={props.item.src} key={props.item.alt} />
      <Typography className={props.className}>
        {props.item.alt}
      </Typography>
    </Paper>
  )
}

export default function Landing() {
  const classes = useStyles()
  const location = useLocation()

  const [plans, setPlans] = useState()
  const [plan, setPlan] = useState(null)
  const [open, setOpen] = useState(false)

  const handleClickOpen = (index) => {
    setPlan(plans[index])
    setOpen(true)
  }

  const handleClose = (value) => {
    setOpen(false)
  }

  useEffect(() => {
    try {
      async function fetchData() {
        const plans = await PlanApi.all(new URLSearchParams(location.search))
        setPlans(plans)
      }
      fetchData()
    } catch (error) {
      //Ничего не делаем
    }
  }, [location.search])

  return (
    <Container className={classes.root}>
      <CssBaseline />
      <AppBar className={classes.appbar} position="static">
        <Toolbar>
          <div className={classes.toolbarButtons}>
            <Button color="secondary" variant="contained" component={Link} to="/signin"  >Вход</Button>
          </div>
        </Toolbar>
      </AppBar>
      <Typography component="h2" className={classes.subtitle}>
        ДАША ЧЕР
      </Typography>
      <Typography component="h1" className={classes.title}>
        ЗАКРЫТЫЙ КЛУБ<br />TOKER TEAM
      </Typography>
      <Button
        href="#plans"
        variant="contained"
        classes={{
          root: classes.buttonOne,
          label: classes.buttonOneLabel,
        }}
      >
        Получить доступ в клуб
      </Button>
      <Typography component="h2" className={classes.title}>
        Что входит в клуб
      </Typography>
      <Carousel
        className={classes.carousel}
        autoPlay={true}
        timer={500}
        animation={"fade"}
        indicators={true}
        timeout={500}
        navButtonsAlwaysVisible={true}

      >
        {
          items.map((item, index) => {
            return <Project item={item} key={index} className={classes.carouselalt} />
          })
        }
      </Carousel>
      <Typography component="h2" className={classes.title}>
        Для кого
      </Typography>
      <List className={classes.list}>
        {list1items.map((item, index) => {
          return <ListItem className={classes.listitem} alignItems="flex-start" key={index}>
            <ListItemIcon className={classes.listitemicon}>
              <DoneIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.listitemprimary,
                secondary: classes.listitemsecondary,
              }}
              primary={item.primary}
              secondary={item.secondary ? item.secondary : null}
            />
          </ListItem>
        })}
      </List>
      <Typography component="h2" className={classes.title}>
        Почему это готовая инструкция по раскрутке
      </Typography>
      <List className={classes.list}>
        {list2items.map((item, index) => {
          return <ListItem className={classes.listitem} alignItems="flex-start" key={index}>
            <ListItemIcon className={classes.listitemicon2}>
              <DoneIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.listitemprimary,
                secondary: classes.listitemsecondary,
              }}
              primary={item.primary}
              secondary={item.secondary ? item.secondary : null}
            />
          </ListItem>
        })}
      </List>
      <Typography component="h2" className={classes.title}>
        Почему это работает
      </Typography>
      <Carousel
        className={classes.carousel}
        autoPlay={true}
        timer={500}
        animation={"fade"}
        indicators={true}
        timeout={500}
        navButtonsAlwaysVisible={true}

      >
        {
          items2.map((item, index) => {
            return <Project item={item} key={index} className={classes.carouselalt} />
          })
        }
      </Carousel>
      <Typography component="h2" className={classes.title}>
        Уже через месяц
      </Typography>
      <img alt="+115к подписчиков через месяц" width="100%" src="/img/IMG_73A7D7D0BE27-1.jpeg" className={classes.img} />
      <Typography component="h2" className={classes.title}>
        Хочешь также?
      </Typography>
      <Button
        href="#plans"
        variant="contained"
        classes={{
          root: classes.buttonOne,
          label: classes.buttonOneLabel,
        }}
      >
        Вступить в клуб
      </Button>
      <Typography component="h2" className={classes.title}>
        Почему сейчас
      </Typography>
      <Typography variant="body2" className={classes.text}>
        Алгоритмы поменяются через месяц и с большой вероятностью ты не сможешь раскрутиться, если отложишь это решение.
        <br /><br />
        Если ты сейчас не решишься, то...
        <br /><br />
        Ничего не изменится.
        Ты упустишь возможность, о которой будешь жалеть.
      </Typography>
      <Typography component="h2" className={classes.title} id="plans">
        Стоимость курса с доступом в клуб
      </Typography>
      {/* <Typography component="h2" className={classes.oldprice}>
        1390 руб/мес
      </Typography> */}
      {plans &&
        <Grid container alignItems="flex-end">
          {plans.map((row, index) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card key={row.id} className={classes.card}>
                <CardHeader
                  title={"КУРС + " + row.duration + (row.duration === 1 ? " МЕСЯЦ" : row.duration > 1 && row.duration < 5 ? " МЕСЯЦА" : " МЕСЯЦЕВ") + " КЛУБА"}
                  titleTypographyProps={{ align: 'center', }}
                  className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                  <div className={classes.cardPricing}>
                    <Typography className={classes.cardPricingText}>
                      {row.price + row.fee + " руб"}
                    </Typography>
                  </div>
                  <div className={classes.cardPricingTotal}>
                    <Typography >
                      {row.fee + " + " + row.price / row.duration + " руб/мес"}
                    </Typography>
                  </div>
                </CardContent>
                <CardActions>
                  <Button variant="contained" fullWidth color="secondary" onClick={() => handleClickOpen(index)}>
                    {"ОПЛАТИТЬ НА " + row.duration + (row.duration === 1 ? " МЕСЯЦ" : row.duration > 1 && row.duration < 5 ? " МЕСЯЦА" : " МЕСЯЦЕВ")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      }
      <Typography component="h2" className={classes.title}>
        Контакты
      </Typography>
      <img alt="Котакты Даша Чер" width="160px" src="/img/ava500.png" className={classes.img} />
      <Typography component="h2" color="secondary" >
        DASHA CHER
      </Typography>
      <Typography variant="caption" className={classes.textCenter}>
        Основатель клуба
      </Typography>
      <br /><br />
      <Typography component="h2" className={classes.textCenter} >
        <b>Телефон:</b> +7 (916) 189 41 43
      </Typography>
      <Typography component="h2" className={classes.textCenter}>
        <b>E-mail:</b> info@dashacher.ru
      </Typography>
      <IconButton aria-label="instagram" color="secondary" href="https://www.instagram.com/dasha_cher/" target="_blank">
        <InstagramIcon fontSize="large" />
      </IconButton>
      {plan && <CheckoutDialog open={open} onClose={handleClose} plan={plan} />}
    </Container>
  )
}