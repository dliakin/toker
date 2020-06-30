import React, { useState, useEffect } from 'react'
import { Fab, List, ListItemAvatar, Avatar, ListItemText, makeStyles, ListItem, ListItemSecondaryAction, IconButton, Container } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Add as AddIcon } from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import StarIcon from '@material-ui/icons/Star'
import SearchTikTokAccauntDialog from '../components/SearchTikTokAccauntDialog'
import { connect } from 'react-redux'
import { loadAccaunts, clearAccaunt, deleteAccaunt } from '../redux/actions/accauntActions'

const useStyles = makeStyles((theme) => ({
    root: {

    },

    list: {
        width: '100%',
    },

    fab: {
        margin: 0,
        top: 'auto',
        // right: 20,
        // bottom: 70,
        left: 'auto',
        // position: 'fixed',
    }

}));

const Accaunts = ({ accaunts, loadAccaunts, token, defaultAccauntId, clearAccaunt, deleteAccaunt }) => {
    const [open, setOpen] = useState(false);
    const classes = useStyles()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false)
    };

    const handleDelete = (id) => () => {
        deleteAccaunt(id, token)
    };

    useEffect(() => {
        loadAccaunts(token)
        clearAccaunt()
    }, [loadAccaunts, clearAccaunt, token]);

    return (
        <Container className={classes.root}>
            <List className={classes.list}>
                {accaunts.map((row) => (
                    <ListItem key={row.uniqueId} component={Link} to={`/accaunt/${row.id}`} >
                        <ListItemAvatar>
                            <Avatar
                                alt={row.nickName}
                                src={row.cover}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={row.nickName}
                            secondary={row.uniqueId}
                        />
                        <ListItemSecondaryAction>
                            {row.id === defaultAccauntId ?
                                <IconButton edge="end" color="secondary">
                                    <StarIcon />
                                </IconButton>
                                :
                                <IconButton edge="end" aria-label="delete" onClick={handleDelete(row.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }

                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Fab className={classes.fab} color="secondary" aria-label="add" onClick={handleClickOpen}>
                <AddIcon />
            </Fab>
            {<SearchTikTokAccauntDialog open={open} onClose={handleClose} />}
        </Container>
    )
}

const mapStateToProps = state => {
    return {
        accaunts: state.accaunt.accaunts,
        token: state.user.token,
        defaultAccauntId: state.user.defaultAccauntId,
    }
}

const mapDispatchToProps = {
    loadAccaunts,
    clearAccaunt,
    deleteAccaunt
}

export default connect(mapStateToProps, mapDispatchToProps)(Accaunts)