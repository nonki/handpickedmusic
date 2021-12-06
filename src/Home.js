import Music from './Music.js';
import Upload from './Upload.js';
import Future from './Future.js';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { useCookies } from 'react-cookie';
import { useLocation, useParams } from "react-router-dom";

const Home = () => {
  const [cookies] = useCookies(['admin'])

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        height: '100%',
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
      }}
    justifyContent="center">
      {cookies.admin && <Upload />}
      {cookies.admin && <Future />}
      <Container
        sx={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
        }}
      >
        <Music />
      </Container>
    </Box>
  )
}

export default Home
