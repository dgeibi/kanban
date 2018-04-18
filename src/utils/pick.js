const pick = (o, ks) => {
  const n = {}
  ks.forEach(k => {
    if (o.hasOwnProperty(k)) {
      n[k] = o[k]
    }
  })
  return n
}

export default pick