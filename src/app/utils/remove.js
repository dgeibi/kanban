export default function remove(node) {
  if (node.remove) {
    node.remove()
  } else if (node.parentNode !== null) {
    node.parentNode.removeChild(node)
  }
}
