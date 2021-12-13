import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const [cookies] = useCookies(['SPOTIFY_AUTH'])

  if (!cookies.SPOTIFY_AUTH)
    return <Navigate to="/login" replace={true} />

  return children
}

export default RequireAuth
