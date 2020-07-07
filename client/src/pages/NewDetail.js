import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import { Container, Typography, makeStyles, LinearProgress } from '@material-ui/core'
import ReactPlayer from 'react-player'
import Linkify from 'linkifyjs/react'
import AudioReactPlayer from '../components/AudioReactPlayer'
import FeedApi from '../axios/feed'
import { logout } from '../redux/actions/userActions'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20,
        marginBottom: 104
    },
    body: {
        textAlign: 'left',
        whiteSpace: 'pre-line'
    },
}))

const NewDetail = ({ token }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [newItem, setNewItem] = useState()
    const newId = useParams().id

    useEffect(() => {

        async function fetchData() {
            try {
                const newItem = await FeedApi.get(newId, token)
                setNewItem(newItem)
            } catch (error) {
                if (error.response.data.error && error.response.data.error.name === 'TokenExpiredError') {
                    dispatch(logout())
                }
            }
        }
        fetchData()
    }, [newId, token, dispatch])


    if (newItem) {
        return (
            <Container className={classes.container}>
                <Typography variant="h6" gutterBottom>
                    {newItem.title}
                </Typography>
                <Typography variant="body1" gutterBottom className={classes.body}>
                    <Linkify>{newItem.text}</Linkify>
                </Typography>
                {newItem.Files && newItem.Files.map((row) => {
                    if (row.mime_type.includes('video'))
                        return <ReactPlayer
                            url={row.url}
                            playing={false}
                            height="100%"
                            width="100%"
                            controls={true}
                            key={row.id}
                        />
                    else if (row.mime_type.includes('audio')) return <AudioReactPlayer url={row.url} key={row.id} />
                    else if (row.mime_type.includes('image')) return <img alt={row.title} width="100%" src={row.url} key={row.id} />
                    else return null
                })}

            </Container>
        )
    } else {
        return (
            <LinearProgress />
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
    }
}

export default connect(mapStateToProps, null)(NewDetail)