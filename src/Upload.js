import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { TrackContext } from './App.js';

const Upload = () => {
  const [url, setUrl] = useState()
  const getId = (url) => {
    const parsedUrl = new URL(url)
    return parsedUrl.pathname.split("/").pop()
  }

  const context = useContext(TrackContext);

  return (
    <Box>
      <Input value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button variant='contained' color='secondary' onClick={() => context.setTrackId(getId(url))}>
        Preview
      </Button>
    </Box>
  )
}

export default Upload
