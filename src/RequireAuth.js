import { useCookies } from 'react-cookie';
import { Navigate, useSearchParams } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const [cookies] = useCookies(['access_token', 'refresh_token'])
  //const [searchParams] = useSearchParams()

  if (!cookies.access_token && !cookies.refresh_token)
    return <Navigate to="/login" replace={true} />

  return children
}

export default RequireAuth
