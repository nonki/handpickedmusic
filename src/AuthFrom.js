import { Navigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'

import { API, graphqlOperation  } from 'aws-amplify'
import { authUser } from './graphql/queries';

const AuthFrom = () => {
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState()
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token'])

  useEffect(() => {
    if (!code)
      return

    async function auth() {
      const authUserData = await API.graphql(graphqlOperation(authUser, { code: code, redirectUri: "http://localhost:3000/loginFrom" }))
      const { accessToken, refreshToken, expiry } = authUserData.data.authUser
      const expiryDate = new Date(expiry)
      setCookie('access_token', accessToken, { path: '/', expires: expiryDate })
      setCookie('refresh_token', refreshToken, { path: '/', expires: new Date('2099') })
    }

    auth()
  }, [code])

  if (cookies.access_token)
    return <Navigate to="/" replace={true} />

  if (searchParams.get("error")) {
    return <Navigate to="/error" replace={true} />
  }

  if (!code && searchParams.get("code")) {
    setCode(searchParams.get("code"))
  }

  return (
    <div>
      <p>
        Logging you in
      </p>
    </div>
  )
}

export default AuthFrom
