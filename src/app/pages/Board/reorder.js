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
      [source.droppableId]: {
        [key]: reordered,
      },
    }
  }

  const from = [...data[source.droppableId][key]]
  const to = [...data[destination.droppableId][key]]

  const target = from[source.index]
  from.splice(source.index, 1)
  to.splice(destination.index, 0, target)

  return {
    [source.droppableId]: {
      [key]: from,
    },
    [destination.droppableId]: {
      [key]: to,
    },
  }
}
