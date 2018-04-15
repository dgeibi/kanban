export default function fetchClientData(req, res, next) {
  const initialState = {}
  if (req.isAuthenticated()) {
    const { email, username } = req.user
    initialState.user = {
      logined: true,
      info: {
        email,
        username,
      },
    }
  }
  req.initialState = initialState
  next()
}
