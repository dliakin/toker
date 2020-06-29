import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import { connect, useDispatch } from 'react-redux'
import { Container, Typography, Card, CardActionArea, CardHeader, CardContent, makeStyles, LinearProgress } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { loadNews } from '../redux/actions/feedActions'
import FeedApi from '../axios/feed'
import { logout } from '../redux/actions/userActions'

const useStyles = makeStyles({
    container: {
        paddingTop: 20
    },
    card: {
        marginBottom: '20px',
    },
})

const Feed = ({ token }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [news, setNews] = useState()

    useEffect(() => {

        async function fetchData() {
            try {
                const news = await FeedApi.all(token)
                setNews(news)
            } catch (error) {
                if (error.response.data.error && error.response.data.error.name === 'TokenExpiredError') {
                    dispatch(logout())
                }
            }
        }
        fetchData()
    }, [token, dispatch])

    return (
        <Container className={classes.container}>
            {news != null ?
                news.map((row) => (
                    <Card className={classes.card} key={row.id}>
                        <CardActionArea component={Link} to={`/new/${row.id}`}>
                            <CardHeader
                                title={row.title}
                                titleTypographyProps={{ variant: 'body2' }}
                                subheader={moment(row.createdAt).format('YYYY-MM-DD HH:mm')}
                            >
                            </CardHeader>
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {row.text.substring(0, 100)}...
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))
                : <LinearProgress />}
        </Container>
    )
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
    }
}

const mapDispatchToProps = {
    loadNews
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed)