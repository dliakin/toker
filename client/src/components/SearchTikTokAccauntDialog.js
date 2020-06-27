import React, { useState } from 'react'
import { Slide, Dialog, DialogContent, DialogTitle, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, DialogActions, Button } from '@material-ui/core';
import AccauntApi from '../axios/accaunt'
import { addAccaunt } from '../redux/actions/accauntActions'
import { connect } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SearchTikTokAccauntDialog = ({ open, onClose, token, addAccaunt }) => {

    const [accaunt, setAccaunt] = useState(null);

    const handleClose = () => {
        onClose()
    };

    const handleChange = async (e) => {
        try {
            const accaunt = await AccauntApi.find(e.target.value);
            setAccaunt(accaunt)
        } catch (e) {
            setAccaunt(null)
        }
    };

    const handleAdd = async (e) => {
        try {
            addAccaunt(accaunt, token)
            setAccaunt(null)
            onClose()
        } catch (e) {

        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
            TransitionComponent={Transition}
        >
            <DialogTitle id="form-dialog-title">Добавить аккаунт</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Имя аккаунта"
                    fullWidth
                    onChange={handleChange} />
                {accaunt &&
                    <ListItem key={accaunt.uniqueId}>
                        <ListItemAvatar>
                            <Avatar
                                alt={accaunt.uniqueId}
                                src={accaunt.covers[0]}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={accaunt.uniqueId}
                            secondary={accaunt.nickName}
                        />
                    </ListItem>}
                {!accaunt && <div>Пользователь не найден..</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Отмена
                    </Button>
                <Button onClick={handleAdd} color="primary" >
                    Добавить
                    </Button>
            </DialogActions>
        </Dialog>
    )
}

const mapStateToProps = state => {
    return {
        token: state.user.token
    }
}

const mapDispatchToProps = {
    addAccaunt
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTikTokAccauntDialog)