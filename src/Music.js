import React, { useEffect, useContext, useState } from 'react'
import { format } from 'date-fns';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { API, graphqlOperation  } from 'aws-amplify'
import { getDailyTrack, enrichTrack } from './graphql/queries';

import { TrackContext } from './App.js';
import Player from './Player';

import { useCookies } from 'react-cookie'

const Music = () => {
  const [cookies] = useCookies(['SPOTIFY_AUTH'])
  const context = useContext(TrackContext);
  const [track, setTrack] = useState({})

  useEffect(() => {
    async function fetchEnrichedTrack(trackId) {
      try {
        if (trackId === "") {
          const dailyTrackData = await API.graphql(graphqlOperation(getDailyTrack))
          trackId = dailyTrackData.data.getDailyTrack
        }

        console.log(trackId)
        console.log(cookies.SPOTIFY_AUTH)
        const enrichedTrack = await API.graphql(graphqlOperation(enrichTrack, {spotifyId: trackId, tokenData: cookies.SPOTIFY_AUTH}))
        console.log(enrichedTrack)

        setTrack(enrichedTrack.data.enrichTrack)
        context.setTrack(enrichedTrack.data.enrichTrack)
      } catch (err) { console.log('error fetching random track'); console.log(err) }
    }

    console.log("Running memo with " + context.trackId)
    fetchEnrichedTrack(context.trackId)
  }, [context.trackId])

  if (!track.trackName)
    return <Fade
      in={true}
      timeout={2000}
    >
      <CircularProgress color="inherit" />
    </Fade>

  const period = format(new Date(), "B").split(' ').pop().toLowerCase()
  const day = format(new Date(), "eeee").toLowerCase()

  return (
    <Container>
      <Fade
        in={true}
        timeout={3000} >
        <Stack
          sx={{
            alignItems: 'center',
          }}
        >
          <Typography variant='h2' color="textPrimary">
            {`радио милица`.toLowerCase()}
          </Typography>
          <Typography sx={{pb: 4}} variant='p' color="textPrimary">
            {`a song handpicked for you to enjoy on this cosy ${day} ${period}`.toLowerCase()}
          </Typography>

          <img src={track.imageUrl} alt="album art" height="300" width="300" />

          <Player url={track.previewUrl} />


          <Typography variant='p' color="textPrimary" sx={{ pb: 4, pt: 4 }}>
            <b>{track.trackName.toUpperCase()}</b>
            <br />
            {track.artistName.toLowerCase()}
          </Typography>
          <Link href={track.externalUrl} color="textPrimary" underline="hover">
            OPEN IN SPOTIFY
          </Link>
        </Stack>
      </Fade>
    </Container>
  )
}

export default Music
