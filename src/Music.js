import React, { useEffect, useContext, useState } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { API, graphqlOperation  } from 'aws-amplify'
import { enrichTrack } from './graphql/queries';

import { TrackContext } from './App.js';


const Music = () => {
  const context = useContext(TrackContext);
  const [track, setTrack] = useState({})

  useEffect(() => {
    async function fetchEnrichedTrack(trackId) {
      try {
        //let trackId = ""
        //if (context.trackId !== "") {
        //  trackId = context.trackId
        //} else {
        //  const dailyTrackData = await API.graphql(graphqlOperation(getDailyTrack))
        //  trackId = dailyTrackData.data.getDailyTrack
        //}
        console.log(trackId)
        const enrichedTrack = await API.graphql(graphqlOperation(enrichTrack, {spotifyId: trackId}))
        console.log(enrichedTrack)

        setTrack(enrichedTrack.data.enrichTrack)
        context.setTrack(enrichedTrack.data.enrichTrack)
      } catch (err) { console.log('error fetching random track'); console.log(err) }
    }

    console.log("Running memo with " + context.trackId)
    fetchEnrichedTrack(context.trackId)
  }, [context.trackId])

  if (!track.trackName) {
    return (
      <div>
        <p>No Track</p>
      </div>
    )
  }

  return (
    <Container
      sx={{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}>

      <Stack
      sx={{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}>
        <Typography variant='h2' color="textPrimary">
          DAILY TRACK
        </Typography>
        <img src={track.imageUrl} alt="album art" height="300" width="300" />

        <Typography variant='p' color="textPrimary">
          <b>{track.trackName.toUpperCase()}</b>
          <br />
          {track.artistName.toLowerCase()}
        </Typography>
      </Stack>
    </Container>
  )
}

export default Music
