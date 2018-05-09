export default middlewares => (req, res, next) => {
  middlewares.reduceRight(
    (_next, fn) => e => {
      if (e) {
        next(e)
      } else {
        try {
          fn(req, res, _next)
        } catch (err) {
          next(err)
        }
      }
    },
    next
  )()
}
