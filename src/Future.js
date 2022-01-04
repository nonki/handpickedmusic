import { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import PickersDay from '@mui/lab/PickersDay';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { isSameDay } from 'date-fns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import { API, graphqlOperation  } from 'aws-amplify'
import { listTracks } from './graphql/queries';
import { deleteTrack as gqlDeleteTrack } from './graphql/mutations';

import { TrackContext } from './App';

const Future = () => {
  const context = useContext(TrackContext)
  const [date, setDate] = useState(new Date())
  const [error, setError] = useState("")
  const [scheduledDates, setScheduledDates] = useState([])
  const [unscheduledTracks, setUnscheduledTracks] = useState([])

  async function preview() {
    const shortDate = date.toISOString().split('T')[0]
    const scheduledList = await API.graphql(graphqlOperation(listTracks, { filter: {date: {eq: shortDate}} }))
    const items = scheduledList.data.listTracks.items
    if (items.length < 1) {
      setError("No entry for date " + shortDate)
      return
    }

    setError("")
    context.setTrackId(items[0].spotifyId)
  }

  async function loadAllSetDates() {
    const scheduledList = await API.graphql(graphqlOperation(listTracks, { filter: {date: {gt: ""}} }))
    const items = scheduledList.data.listTracks.items
    if (items.length < 1)
      return

    const dates = items.map((e) => new Date(e.date))
    setScheduledDates(dates)
  }

  async function loadAllUnsetMusic() {
    const unscheduledList = await API.graphql(graphqlOperation(listTracks, { filter: { not: {date: {gt: ""}} }}))
    const items = unscheduledList.data.listTracks.items
    setUnscheduledTracks(items)
  }

  useEffect(() => {
    loadAllSetDates()
    loadAllUnsetMusic()
  }, [date])

  const errorEl = <Typography variant='error'>
    {error}
    </Typography>

  const renderDay = (date, selectedDates, pickersDayProps) => {
    let disabled = true
    scheduledDates.forEach((e) => {
      if (isSameDay(date, e))
        disabled = false
    })

    return <PickersDay {...pickersDayProps} disabled={disabled} />
  }

  return (
    <Stack
      sx={{
        pt: 4,
      }}
      justifyContent="center"
      direction="row"
      spacing={2}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Future Viewer"
            inputFormat="MM/dd/yyyy"
            renderDay={renderDay}
            value={date}
            onChange={(d) => setDate(d)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button variant='contained' color='secondary' onClick={() => preview()}>
        Preview
      </Button>
      <Typography variant="p">
        {unscheduledTracks.length} tracks pending
      </Typography>
      <TracksList tracks={unscheduledTracks} />
      { error !== "" && errorEl }
    </Stack>
  )
}

const TracksList = ( props ) => {
  const { tracks } = props
  const context = useContext(TrackContext)

  async function deleteTrack(id) {
    console.log(`deleting track ${id}`)
    const deletedTracks = await API.graphql(graphqlOperation(gqlDeleteTrack, { input: {id: id} }))
    const deletedTrack = deletedTracks.data.deleteTrack
    if (deleteTrack)
      console.log(`deleted track ${deletedTrack.id} - ${deletedTrack.spotifyId}`)
  }

  const renderTrackRow = ( index, track ) => {
    const isSelected = (context.trackId === track.spotifyId)

    return (
      <ListItem
        key={index}
        secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={() => deleteTrack(track.id)}>
            <DeleteIcon />
          </IconButton>
        }
        component="div"
        disablePadding
      >
        <ListItemButton onClick={() => context.setTrackId(track.spotifyId)}>
          {isSelected &&
          <ListItemIcon>
            <PreviewIcon />
          </ListItemIcon>
          }
          <ListItemText inset={!isSelected} primary={`${track.spotifyId}`} />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <Box
      sx={{ width: '100%', height: 50, overflow: 'auto', maxWidth: 360  }}
    >
      <List>
        {tracks.map((track, index) => renderTrackRow(index, track))}
      </List>
    </Box>
  )
}

export default Future;
