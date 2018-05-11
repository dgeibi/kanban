const prependEntry = (entry, delta) => {
  if (typeof entry === 'function') {
    return () => Promise.resolve(entry()).then(x => prependEntry(x, delta))
  }
  delta = Array.isArray(delta) ? delta : [delta]
  if (typeof entry === 'object' && !Array.isArray(entry)) {
    const entryClone = {}
    Object.keys(entry).forEach(key => {
      entryClone[key] = delta.concat(entry[key])
    })
    return entryClone
  }
  return delta.concat(entry)
}

module.exports = prependEntry
