import React from 'react'
import { Typography, Avatar, IconButton, makeStyles, useMediaQuery } from '@material-ui/core'
import { Delete } from '@material-ui/icons';

function QueuedSongList() {
    const greaterThanMedium = useMediaQuery(theme => theme.breakpoints.up('md'));

    const song = {
        title: 'dummy',
        artist: 'du',
        thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault_live.jpg?sqp=-oaymwEZCNACELwBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLBmBdHg7yVILELBl9RL_IUp5d2bwg'
    }

    return greaterThanMedium && ( 
        <div style={{ margin: '10px 0' }}>
            <Typography color="textSecondary" variant="button">
                QUEUE(5)
            </Typography>
            {Array.from({ length: 5 }, () => song).map((song, i) => (
                <QueuedSong key={i} song={song} />
            ))}
        </div>
    );
}

const useStyles = makeStyles({
    avatar: {
        width: 44,
        height: 44
    },
    text: {
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    container: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '50px auto 50px',
        gridGap: 12,
        alignItems: 'center',
        marginTop: 10
    },
    songInfoContainer: {
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    }
});

function QueuedSong({ song }) {
    const classes = useStyles();

    const { thumbnail, artist, title } = song;

    return (
        <div className={classes.container}>
            <Avatar src={thumbnail} alt="Song Thumbnail" className={classes.avatar}/>
            <div className={classes.songInfoContainer}>
                <Typography variant="subtitle2" className={classes.text}>{title}</Typography>
                <Typography variant="body2" color="textSecondary" className={classes.text}>{artist}</Typography>
            </div>
            <IconButton>
                <Delete color="error" />
            </IconButton>
        </div>
    );
}

export default QueuedSongList;