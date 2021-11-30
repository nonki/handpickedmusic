import { useState, useContext } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Typography from '@mui/material/Typography';
import { TrackContext } from './App.js';

import { API, graphqlOperation  } from 'aws-amplify'
import { listTracks } from './graphql/queries';
import { createTrack } from './graphql/mutations';

const Upload = () => {
  const context = useContext(TrackContext)
  const [url, setUrl] = useState()
  const [error, setError] = useState("")
  const [date, setDate] = useState(new Date())
  const [schedule, setSchedule] = useState(false)
  const getId = (url) => {
    const parsedUrl = new URL(url)
    return parsedUrl.pathname.split("/").pop()
  }

  async function uploadTrack(id, date) {
    const tracksList = await API.graphql(graphqlOperation(listTracks, { filter: {spotifyId: {eq: id}} }))
    const items = tracksList.data.listTracks.items
    if (items.length > 0) {
      setError("Entry already exists")
      return
    }

    if (date !== null) {
      const scheduledList = await API.graphql(graphqlOperation(listTracks, { filter: {date: {eq: date}} }))
      const scheduledItems = scheduledList.data.listTracks.items
      if (scheduledItems.length > 0) {
        setError("Entry already exists for that date " + date)
        return
      }
    }

    console.log(`Uploading ${id} for date ${date}`)
    API.graphql(graphqlOperation(createTrack, {input: {spotifyId: id, date: date}}))
    setError("")
  }

  const preview = () => {
    context.setTrackId(getId(url))
    context.setPreview(true)
  }

  const submit = () => {
    uploadTrack(getId(url), schedule ? date.toISOString().split('T')[0] : null)
    context.setPreview(false)
    context.setTrackId("")
    setUrl("")
  }

  const submitButton = <Button variant='contained' color='secondary' onClick={() => submit()}>
      Submit
    </Button>

  const errorEl = <Typography variant='error'>{error}</Typography>

  return (
    <Stack
      sx={{
        pt: 4,
      }}
      justifyContent="center"
      direction="row"
      spacing={2}
    >
      <Input value={url} onChange={(e) => setUrl(e.target.value)} />
      <Checkbox
        color="secondary"
        checked={schedule}
        onChange={() => setSchedule(!schedule)}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Date"
            disabled={!schedule}
            inputFormat="MM/dd/yyyy"
            value={date}
            onChange={(d) => setDate(d)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button variant='contained' color='secondary' onClick={() => preview()}>
        Preview
      </Button>
      { context.preview && submitButton }
      { error !== "" && errorEl }
    </Stack>
  )
}

export default Upload
