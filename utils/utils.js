const isBetween = (data, attribute, subTreeRoot) => isBetweenHelper(data, attribute, subTreeRoot, null, null)

function treeMin(node) {
  if (!node){
    return null
  }
  if (!node.left){
    return node
  }

  return treeMin(node.left)
}
function isBetweenHelper(data, attribute, subTreeRoot, previous, next){
  if (data > subTreeRoot[attribute] && !subTreeRoot.right){
    return [subTreeRoot, next]
  }
  if (data > subTreeRoot[attribute] && subTreeRoot.right){
    return isBetweenHelper(data, attribute, subTreeRoot.right, subTreeRoot, next)
  }
  if (data < subTreeRoot[attribute] && !subTreeRoot.left){
    return [previous, subTreeRoot]
  }
  if (data < subTreeRoot[attribute] && subTreeRoot.left){
    return isBetweenHelper(data, attribute, subTreeRoot.left, previous, subTreeRoot)
  }
  if (data  === subTreeRoot[attribute]) return [subTreeRoot, next]
}

const findStoreLocation = (key, tree) => (isBetween(key, 'key', tree)[1] ? isBetween(key, 'key', tree)[1] : treeMin(tree)).key
module.exports = findStoreLocation
