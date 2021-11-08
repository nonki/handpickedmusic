import React, { useEffect, useState  } from 'react'
import { API, graphqlOperation  } from 'aws-amplify'
import { randomTrack, getTrack } from './graphql/queries';

const Music = () => {
  const [track, setTrack] = useState([])

  useEffect(() => {
    fetchRandomTrack()
  }, [])

  async function fetchRandomTrack() {
    try {
      const randomTrackData = await API.graphql(graphqlOperation(randomTrack))
      const randomTrackId = randomTrackData.data.randomTrack
      const randomTrackObj = await API.graphql(graphqlOperation(getTrack, randomTrackId))
      setTrack(randomTrackObj)
    } catch (err) { console.log('error fetching random track'); console.log(err) }
  }

  return (
    <div>
      <p>{track.name}</p>
      <p>{track.id}</p>
    </div>
  )
}

export default Music
