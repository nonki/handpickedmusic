import { useContext, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import { API, graphqlOperation  } from 'aws-amplify'
import { listTracks } from './graphql/queries';

import { TrackContext } from './App';

const Future = () => {
  const context = useContext(TrackContext)
  const [date, setDate] = useState(new Date())
  const [error, setError] = useState("")

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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Future Viewer"
            inputFormat="MM/dd/yyyy"
            value={date}
            onChange={(d) => setDate(d)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button variant='contained' color='secondary' onClick={() => preview()}>
        Preview
      </Button>
      { error !== "" && errorEl }
    </Stack>
  )
}

export default Future;
