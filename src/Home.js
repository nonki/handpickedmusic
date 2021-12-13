import Music from './Music.js';
import Upload from './Upload.js';
import Future from './Future.js';
import RequireAuth from './RequireAuth';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { useCookies } from 'react-cookie';

const Home = () => {
  const [cookies] = useCookies(['admin'])

  return (
    <Box>
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
        <RequireAuth>
          <Music />
        </RequireAuth>
      </Container>
    </Box>
  )
}

export default Home
