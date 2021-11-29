import React, { useEffect, useState  } from 'react'
import { API, graphqlOperation  } from 'aws-amplify'
import { getDailyTrack, enrichTrack } from './graphql/queries';

const Music = () => {
  const [track, setTrack] = useState([])

  useEffect(() => {
    fetchEnrichedTrack()
  }, [])

  async function fetchEnrichedTrack() {
    try {
      const dailyTrackData = await API.graphql(graphqlOperation(getDailyTrack))
      const dailyTrackId = dailyTrackData.data.getDailyTrack
      const dailyEnrichedTrack = await API.graphql(graphqlOperation(enrichTrack, dailyTrackId))
      setTrack(dailyEnrichedTrack)
    } catch (err) { console.log('error fetching random track'); console.log(err) }
  }

  return (
    <div>
      <p>{track.trackName}</p>
      <p>{track.colorHex}</p>
      <p>{track.spotifyId}</p>
      <p>{track.artistName}</p>
      <p>{track.albumName}</p>
      <p>{track.previewUrl}</p>
    </div>
  )
}

export default Music
