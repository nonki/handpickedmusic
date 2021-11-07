import React, { useEffect, useState  } from 'react'
import { API, graphqlOperation  } from 'aws-amplify'
import { listArtists } from './graphql/queries';

const Music = () => {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    fetchArtists()
  }, [])

  async function fetchArtists() {
    try {
      const artistData = await API.graphql(graphqlOperation(listArtists))
      const artists = artistData.data.listArtists.items
      setArtists(artists)
    } catch (err) { console.log('error fetching artists'); console.log(err) }
  }

  return (
    <div>
      {
        artists.map((artist, index) => (
          <div key={artist.id ? artist.id : index}>
            <p>{artist.spotifyId}</p>
          </div>
        ))
      }
    </div>
  )
}

export default Music
