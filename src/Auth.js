import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';

const Auth = () => {
  const params = {
    response_type: 'code',
    client_id: "f1d6391593e2415eb3a406c080ea84e1",
    scope: "user-read-email",
    redirect_uri: `${window.location.origin}/loginFrom`,
  }

  const queryParams = new URLSearchParams(params)

  window.location = `https://accounts.spotify.com/authorize?${queryParams.toString()}`

  return (
    <Container
      sx={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
      }}
    >
      <Fade
        in={true}
        timeout={2000}
      >
        <CircularProgress color="inherit" />
      </Fade>
    </Container>
  )
}

export default Auth
