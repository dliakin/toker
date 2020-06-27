import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import { Card, Grid, IconButton, Slider } from '@material-ui/core'
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import { styled } from '@material-ui/core/styles';

const MyGrid = styled(Grid)({
    margin: "0 20px 0 0"
});

class AudioReactPlayer extends Component {

    constructor(props) {
        super(props);
        this.state = { playing: false };
        this.state = { played: 0 };
        this.clickPlayOrPause = this.clickPlayOrPause.bind(this);
    }

    clickPlayOrPause() {
        this.setState({ playing: !this.state.playing });
    }

    handleSeekChange = (event, newValue) => {
        this.setState({ played: parseFloat(newValue) })
    }

    handleSeekMouseUp = (event, newValue) => {
        this.player.seekTo(parseFloat(newValue))
    }

    handleProgress = state => {
        this.setState(state)
    }

    ref = player => {
        this.player = player
    }

    render() {
        return (
            <Card>
                <Grid container spacing={2}>
                    <Grid item>
                        <IconButton onClick={this.clickPlayOrPause} fontSize="large" >
                            {!this.state.playing && <PlayCircleOutlineIcon />}
                            {this.state.playing && <PauseCircleOutlineIcon />}
                        </IconButton>
                    </Grid>
                    <MyGrid item xs >
                        <Slider
                            aria-labelledby="continuous-slider"
                            min={0}
                            max={0.999999}
                            step={0.000001}
                            value={this.state.played}
                            onChange={this.handleSeekChange}
                            onChangeCommitted={this.handleSeekMouseUp}

                        />
                    </MyGrid>
                </Grid>
                <ReactPlayer
                    ref={this.ref}
                    url={this.props.url}
                    hidden
                    playing={this.state.playing}
                    width="100%"
                    height="100%"
                    onProgress={this.handleProgress}
                />
            </Card>
        )
    }
}

export default AudioReactPlayer