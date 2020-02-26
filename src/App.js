import React from 'react';
import Header from './components/Header';
import AddSong from './components/AddSong';
import SongList from './components/SongList';
import SongPlayer from './components/SongPlayer';
import { Grid, useMediaQuery, Hidden } from '@material-ui/core';

import songReducer from './reducer';

export const SongContext = React.createContext({
  song: {
    artist: "PINKFONG",
    duration: 137,
    id: "d41469e5-e023-4a40-95c3-0061fa22efe5",
    thumbnail: "http://img.youtube.com/vi/XqZsoesa55w/0.jpg",
    title: "Baby Shark Dance | Sing and Dance! |",
    url: "https://www.youtube.com/watch?v=XqZsoesa55w"
  },
  isPlaying: false
});

function App() {
  const initialSongState = React.useContext(SongContext);
  const [state, dispatch] = React.useReducer(songReducer, initialSongState);

  const greaterThanMedium = useMediaQuery(theme => theme.breakpoints.up('md'));
  const greaterThanSm = useMediaQuery(theme => theme.breakpoints.up('sm'));

  return (
    <SongContext.Provider value={{state, dispatch}}>
      <Hidden only="xs">
        <Header />
      </Hidden>
      
      <Grid container spacing={3}>
        <Grid style={{
          paddingTop: greaterThanSm ? '80px' : 10
        }} item xs={12} md={7}>
          <AddSong />
          <SongList />
        </Grid>
        <Grid style={greaterThanMedium ? {
          position: 'fixed', 
          width: '100%',
          right: 0, 
          top: 70} : {
            position: 'fixed',
            left: 0,
            bottom: 0,
            width: '100%'
          }} item xs={12} md={5}>
          <SongPlayer />
        </Grid>
      </Grid>    
    </SongContext.Provider>
  );
}

export default App;
