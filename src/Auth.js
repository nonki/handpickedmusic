const Auth = () => {
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
