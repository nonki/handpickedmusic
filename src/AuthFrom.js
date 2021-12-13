import { Navigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'

import { API, graphqlOperation  } from 'aws-amplify'
import { authUser } from './graphql/queries';

import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const AuthFrom = () => {
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState()
  const [cookies, setCookie] = useCookies(['SPOTIFY_AUTH'])

  useEffect(() => {
    if (!code)
      return

    async function auth() {
      const authUserData = await API.graphql(graphqlOperation(authUser, { code: code, redirectUri: `${window.location.origin}/loginFrom` }))
      const authData = authUserData.data.authUser

      setCookie('SPOTIFY_AUTH', Buffer.from(JSON.stringify(authData)).toString("base64"), { path: '/', expires: new Date('2099') })
    }

    auth()
  }, [code])

  if (cookies.SPOTIFY_AUTH)
    return <Navigate to="/" replace={true} />

  if (searchParams.get("error")) {
    return <Navigate to="/error" replace={true} />
  }

  if (!code && searchParams.get("code")) {
    setCode(searchParams.get("code"))
  }

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

export default AuthFrom
