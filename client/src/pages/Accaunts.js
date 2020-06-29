import React, { useState, useEffect } from 'react'
import { Fab, List, ListItemAvatar, Avatar, ListItemText, makeStyles, ListItem, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Add as AddIcon } from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import SearchTikTokAccauntDialog from '../components/SearchTikTokAccauntDialog'
import { connect } from 'react-redux'
import { loadAccaunts, clearAccaunt, deleteAccaunt } from '../redux/actions/accauntActions'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: 128
    },

    fab: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 70,
        left: 'auto',
        position: 'fixed',
    }

}));

const Accaunts = ({ accaunts, loadAccaunts, token, clearAccaunt, deleteAccaunt }) => {
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
        <>
            <List className={classes.root}>
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
                            <IconButton edge="end" aria-label="delete" onClick={handleDelete(row.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Fab className={classes.fab} color="secondary" aria-label="add" onClick={handleClickOpen}>
                <AddIcon />
            </Fab>
            {<SearchTikTokAccauntDialog open={open} onClose={handleClose} />}
        </>
    )
}

const mapStateToProps = state => {
    return {
        accaunts: state.accaunt.accaunts,
        token: state.user.token,
    }
}

const mapDispatchToProps = {
    loadAccaunts,
    clearAccaunt,
    deleteAccaunt
}

export default connect(mapStateToProps, mapDispatchToProps)(Accaunts)