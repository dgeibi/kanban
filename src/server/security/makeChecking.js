const makeChecking = ({ Model, paramKey, instKey, check, onFailure }) => (
  queryOpts = {}
) =>
  async function auth(req, res, next) {
    const inst = await Model.findById(req.params[paramKey], queryOpts)
    if (!await check(req, inst)) {
      if (typeof onFailure === 'function') {
        onFailure(req, res)
      } else {
        res.status(403).end()
      }
    } else {
      req[instKey] = inst
      next()
    }
  }

export default makeChecking
