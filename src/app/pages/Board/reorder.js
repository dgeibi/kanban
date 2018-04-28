export const reorder = (arr, startIndex, endIndex) => {
  const result = Array.from(arr)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const reorderInner = ({ data, source, destination, key }) => {
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(
      data[source.droppableId][key],
      source.index,
      destination.index
    )
    return {
      [source.droppableId]: reordered,
    }
  }

  const current = [...data[source.droppableId][key]]
  const next = [...data[destination.droppableId][key]]

  const target = current[source.index]
  current.splice(source.index, 1)
  next.splice(destination.index, 0, target)

  return {
    [source.droppableId]: current,
    [destination.droppableId]: next,
  }
}
