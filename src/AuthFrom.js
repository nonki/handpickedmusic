import { Navigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'

const AuthFrom = () => {
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState()
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token'])

  useEffect(() => {
    if (!code)
      return

    // GraphQL login?
  }, code)


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
