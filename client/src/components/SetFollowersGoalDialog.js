import React, { useState } from 'react'
import { Slide, Dialog, DialogContent, DialogTitle, TextField, DialogActions, Button } from '@material-ui/core';
import { setFollowersGoal } from '../redux/actions/accauntActions'
import { connect } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SetFollowersGoalDialog = ({ open, onClose, token, accaunt_id, setFollowersGoal }) => {

    const [goal, setGoal] = useState(0);

    const handleClose = () => {
        onClose()
    };

    const handleChange = (e) => {
        try {
            setGoal(e.target.value)
        } catch (e) {
            setGoal(0)
        }
    };

    const handleAdd = (e) => {
        try {
            setFollowersGoal(goal, accaunt_id, token)
            onClose();
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
            <DialogTitle id="form-dialog-title">Добавить цель</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="goal"
                    label="Количество подписчиков"
                    fullWidth
                    type="number"
                    pattern="[0-9]*"
                    onChange={handleChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Отмена
                    </Button>
                <Button onClick={handleAdd} color="primary">
                    Добавить
                    </Button>
            </DialogActions>
        </Dialog>
    )
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
        accaunt_id: state.accaunt.accaunt.id,
    }
}

const mapDispatchToProps = {
    setFollowersGoal
}

export default connect(mapStateToProps, mapDispatchToProps)(SetFollowersGoalDialog)
