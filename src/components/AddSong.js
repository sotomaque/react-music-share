import React from 'react';
import { TextField, 
        InputAdornment, 
        Button,
        Dialog, 
        DialogContent, 
        DialogTitle, 
        DialogActions, 
        makeStyles
} from '@material-ui/core';
import ReactPlayer from 'react-player';
import { Link, AddBoxOutlined } from '@material-ui/icons';
import SoundcloudPlayer from 'react-player/lib/players/SoundCloud';
import YoutubePlayer from 'react-player/lib/players/YouTube';
import { useMutation } from '@apollo/react-hooks';
import { ADD_SONG } from '../graphql/mutations';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    urlInput: {
        margin: theme.spacing(1)
    },
    addSongButton: {
        margin: theme.spacing(1)
    },
    dialog: {
        textAlign: 'center'
    },
    thumbnail: {
        width: '90%'
    }
}))

const DEFAULT_SONG = {
    duration: 0,
    title: '',
    artist: '',
    thumbnail: ''
}

function AddSong() {
    const classes = useStyles();
    const [addSong, { error }] = useMutation(ADD_SONG)
    const [url, setUrl] = React.useState('');
    const [playable, setPlayable] = React.useState(false);
    const [dialog, setDialog] = React.useState(false);
    const [song, setSong] = React.useState(DEFAULT_SONG)

    React.useEffect(() => {
        const isPlayable = SoundcloudPlayer.canPlay(url) || YoutubePlayer.canPlay(url);
        setPlayable(isPlayable);
    }, [url])

    function handleChangeSong(event) {
        const { name, value } = event.target;
        setSong(prevSong => ({
            ...prevSong,
            [name]: value
        }));
    }
    function handleCloseDialog() {
        setDialog(false);
    }

    async function handleEditSong({ player }) {
        const nestedPlayer = player.player.player;
        let songData;
        if (nestedPlayer.getVideoData) {
            songData = getYoutubeInfo(nestedPlayer);
        } else if (nestedPlayer.getCurrentSound) {
            songData = await getSoundCloudInfo(nestedPlayer);
        }
        setSong({...songData, url});
    }

    async function handleAddSong() {
        try {
            const { url, thumbnail, duration, title, artist } = song;
            await addSong({
                variables: {
                    url: url.length > 0 ? url : null,
                    thumbnail: thumbnail.length > 0 ? thumbnail : null,
                    duration: duration > 0 ? duration : null,
                    title: title.length > 0 ? title : null,
                    artist: artist.length > 0 ? artist : null
                }
            })
            handleCloseDialog();
            setSong(DEFAULT_SONG);
            setUrl('');
        } catch (error) {
            console.error("ERROR ADDING SONG ", error)
        }
        
    }

    function getYoutubeInfo(player) {
        const duration = player.getDuration();
        const { title, video_id, author } = player.getVideoData();
        const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
        return {
            duration,
            title,
            artist: author,
            thumbnail
        }
    }

    function getSoundCloudInfo(player) {
        return new Promise ((resolve, reject) => {
            player.getCurrentSound(songData => {
                if (songData) {
                    resolve({
                        duration: Number(songData.duration / 1000), 
                        title: songData.title,
                        artist: songData.user.username,
                        thumbnail: songData.artwork_url.replace('-large', '-t500x500')
                    })

                    reject(new Error("failed to fetch soundcloud data")); 
                    setTimeout(() => resolve("…")); 
                }
            })
        })
        
    }

    function handleInputError(field) {
        return error?.graphQLErrors[0]?.extensions?.path.includes(field)
    }

    const { thumbnail, title, artist } = song;

    return (
        <div className={classes.container}>
            <Dialog 
                open={dialog}
                onClose={handleCloseDialog}
                className={classes.dialog}
            >
                <DialogTitle>Edit Song</DialogTitle>
                <DialogContent>
                    <img 
                        className={classes.thumbnail}
                        alt="song thumbnail" 
                        src={thumbnail} />
                    <TextField
                        value={title}
                        onChange={handleChangeSong}
                        margin="dense"
                        name="title"
                        label="Title"
                        fullWidth
                        error={handleInputError('title')}
                        helperText={handleInputError('title') && "Fill out field"}
                    />
                    <TextField
                        value={artist}
                        onChange={handleChangeSong}
                        margin="dense"
                        name="artist"
                        label="Artist"
                        fullWidth
                        error={handleInputError('artist')}
                        helperText={handleInputError('artist') && "Fill out field"}
                    />
                    <TextField
                        value={thumbnail}
                        onChange={handleChangeSong}
                        margin="dense"
                        name="thumbnail"
                        label="Thumbnail"
                        fullWidth
                        error={handleInputError('thumbnail')}
                        helperText={handleInputError('thumbnail') && "Fill out field"}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleAddSong} variant="outlined" color="primary">Add Song</Button>
                </DialogActions>
            </Dialog>
            <TextField 
                className={classes.urlInput}
                onChange={e => setUrl(e.target.value)}
                value={url}
                placeholder="Add Youtube or Soundcloud URL"
                type="url"
                fullWidth
                margin="normal"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Link />
                        </InputAdornment>
                    )
                }} 
            />
            <Button
                disabled={!playable}
                className={classes.addSongButton}
                variant="contained"
                color="primary"
                endIcon={<AddBoxOutlined/>}
                onClick={() => setDialog(true)}
            >Add</Button>
            <ReactPlayer url={url} hidden onReady={handleEditSong} />
        </div>
    );
}


export default AddSong;