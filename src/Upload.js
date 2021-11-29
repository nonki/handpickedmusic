import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { TrackContext } from './App.js';

import { API, graphqlOperation  } from 'aws-amplify'
import { listTracks } from './graphql/queries';
import { createTrack } from './graphql/mutations';

const Upload = () => {
  const context = useContext(TrackContext)
  const [url, setUrl] = useState()
  const [error, setError] = useState("")
  const getId = (url) => {
    const parsedUrl = new URL(url)
    return parsedUrl.pathname.split("/").pop()
  }

  async function uploadTrack(id) {
    const tracksList = await API.graphql(graphqlOperation(listTracks, { filter: {spotifyId: {eq: id}} }))
    const items = tracksList.data.listTracks.items
    if (items.length > 0) {
      setError("Entry already exists")
      return
    }

    API.graphql(graphqlOperation(createTrack, {input: {spotifyId: id}}))
    setError("")
  }

  const preview = () => {
    context.setTrackId(getId(url))
    context.setPreview(true)
  }

  const submit = () => {
    uploadTrack(getId(url))
    context.setPreview(false)
    context.setTrackId("")
    setUrl("")
  }

  const submitButton = <Button variant='contained' color='secondary' onClick={() => submit()}>
      Submit
    </Button>

  const errorEl = <Typography variant='error'>{error}</Typography>

  return (
    <Box>
      <Input value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button variant='contained' color='secondary' onClick={() => preview()}>
        Preview
      </Button>
      { context.preview && submitButton }
      { error !== "" && errorEl }
    </Box>
  )
}

export default Upload
