import { useCookies } from 'react-cookie'
import { useEffect } from 'react'

import { API, graphqlOperation  } from 'aws-amplify'
import { authUser } from './graphql/queries';

const Auth = () => {
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token'])

  useEffect(() => {
    if (cookies.access_token || !cookies.refresh_token)
      return

    async function auth() {
      const authUserData = await API.graphql(graphqlOperation(authUser, { refreshToken: cookies.refresh_token, redirectUri: "http://localhost:3000/loginFrom" }))
      const { accessToken, refreshToken, expiry } = authUserData.data.authUser
      const expiryDate = new Date(expiry)
      setCookie('access_token', accessToken, { path: '/', expires: expiryDate })

      if (refreshToken)
        setCookie('refresh_token', refreshToken, { path: '/', expires: new Date('2099') })
    }

    auth()
  })

  if (!cookies.access_token && cookies.refresh_token) {
    return <div><p>WAITING</p></div>
  }

  const params = {
    response_type: 'code',
    client_id: "f1d6391593e2415eb3a406c080ea84e1",
    scope: "user-read-email",
    redirect_uri: "http://localhost:3000/loginFrom",
  }

  const queryParams = new URLSearchParams(params)

  window.location = `https://accounts.spotify.com/authorize?${queryParams.toString()}`

  return (
    <div>
      <p>
        Not authed
      </p>
    </div>
  )
}

export default Auth
