let createTree = require('functional-red-black-tree')
let chance = new require('chance')
let {zipObj, append, flatten, keysAndVals} =  require('ramda')
let md5hash = require('blueimp-md5')
var sha1 = require('sha1');
console.log(sha1('MURMUR').slice(0, 32))
console.log(md5hash('MURMUR'))
//let murmur = require('murmur3')
let hashfunctions = [md5hash, (node) => sha1(node).slice(0, 32) ]
// let enchmac = require('crypto-js')['hmac-sha1']

let nodes = new Set(['node1', 'node2', 'node3', 'node4'])
let words = [
  {key: "skip", value: "skip"}, {key: "flaky", value: "flaky"}, {key: "special", value: "special"},
  {key: "fuel", value: "fuel"}, {key: "cent", value: "cent"}, {key: "broad", value: "broad"}, {key: "slippery", value:"slippery"},
  {key: "previous", value: "previous"}, {key: "transport", value: "transport"},
  {key: "tame", value: "tame"}, {key: "hate", value: "hate"}, {key: "pin", value: "pin"}
]


let isBetween = (data, attribute, subTreeRoot) => isBetweenHelper(data, attribute, subTreeRoot, null, null)
let findStoreLocation = (key, tree) => (isBetween(key, 'key', tree)[1] ? isBetween(key, 'key', tree)[1] : treeMin(tree))
let findPrevious = (key, tree) => (isBetween(key, 'key', tree)[0] ?  isBetween(key, 'key', tree)[0] : treeMax(tree))
function treeMax(node){
  if (!node){
    return null
  }
  if (!node.right){
    return node
  }
  return treeMax(node)
}

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
    // if (previous ===  null || subTreeRoot[attribute] > previous[attribute]) return [subTreeRoot, next]
    // else return [previous,  next]
  }
  if (data > subTreeRoot[attribute] && subTreeRoot.right){
    return isBetweenHelper(data, attribute, subTreeRoot.right, subTreeRoot, next)
    // if (previous === null || subTreeRoot[attribute] > previous[attribute]){
    //   return isBetweenHelper(data, attribute, subTreeRoot.right, subTreeRoot, next)
    // }
    // else {
    //   return isBetweenHelper(data, attribute, subTreeRoot.right, previous, next)
    // }
  }
  if (data < subTreeRoot[attribute] && !subTreeRoot.left){
    return [previous, subTreeRoot]
    // if (next === null || subTreeRoot[attribute] < next[attribute]) return [previous, subTreeRoot]
    // else return [previous,  next]
  }
  if (data < subTreeRoot[attribute] && subTreeRoot.left){
    return isBetweenHelper(data, attribute, subTreeRoot.left, previous, subTreeRoot)
    //
    // if (next === null || subTreeRoot[attribute] < next[attribute]) {
    //   return isBetweenHelper(data, attribute, subTreeRoot.left, previous, subTreeRoot)
    // }
    // else {
    //   return isBetweenHelper(data, attribute, subTreeRoot.left, previous, next)
    // }
  }
  if (data  === subTreeRoot[attribute]) return [subTreeRoot, next]
}
function StableHash(nodeNames = nodes, dataHash = md5hash, hashFunctions = [(node) => sha1(node).slice(0, 32) ]){
  let nodeBucketNames = [...nodeNames].reduce((acc, node) => acc.concat([dataHash, ...hashFunctions].map((funct) => funct(node).toString())), [])
  this.nodes = new Set(nodeBucketNames)
  let treeOfHashedNodes = [...nodeBucketNames].reduce((tr, hashedNode) => tr.insert(hashedNode, hashedNode), createTree())
  let hashTable = [...this.nodes].reduce((acc, name) => (Object.assign(acc, {[name]: {}})), {})
  this.orderTree = treeOfHashedNodes
  this.hashTable = hashTable
  this.dataFindHash = dataHash
  this.dataInsertHashes = [this.dataFindHash, ...hashFunctions]
}

// StableHash.prototype._initializeNode(dataNode) = {
//
//
// }
StableHash.prototype._insertKeyVal = function(keyVal){
  console.log(this.dataInsertHashes)
  console.log('ORDER TREE', this.orderTree.root)
  this.dataInsertHashes.forEach(func => {
    console.log('KEY TO INSERT.', keyVal.key)
    console.log('HASHED KEY VAL', func(keyVal.key))
    let storeLocation = findStoreLocation(func(keyVal.key), this.orderTree.root)
    console.log('INSERT LOCATION, ', storeLocation)
    this.hashTable[storeLocation.key][keyVal.key] = keyVal.value
  })
}

StableHash.prototype.insertDataNode = function(dataNode) {
  if (this.nodes.has(dataNode)){
    throw Error(`Duplicate node entry: ${dataNode}`)
  }
  let nodeHashed = this.dataFindHash(dataNode)
  if (this.hashTable[nodeHashed]){
    throw Error(`Duplicate node entry: ${dataNode} maps to existing location ${this.dataFindHash(dataNode)}`)
  }
  console.log(dataNode, nodeHashed)
  this.nodes.add(dataNode)
  let previous = findPrevious(nodeHashed, this.orderTree.root)
  this.orderTree = this.orderTree.insert(nodeHashed)
  this.hashTable[nodeHashed] = {}
  console.log('previous of newly insserted', previous)
  let previousData = this.hashTable[previous]
  Object.keys(previousData).forEach(key => {
    if (findStoreLocation(key) === nodeHashed){
      this.hashTable[nodeHashed][key] = previousData[key]
      delete previousData[key]
    }
  })
}


//function(tr)
// Function.protototype.initilize(keyValArray){
//   keyValArray.forEach(({key, value}) => {
//     let hashedKey = this.dataHash(key)
//     this.storeHashes.forEach(store => )
//
//   })
// }
function usage(){
  let tree = createTree()
  let moo = [34, 5, 6, 23, 96, 0].reduce((tr, num) => tr.insert(num, num), tree)
  //console.log('minimum', treeMin(moo.root))
  // console.log(moo.root.right)
  console.log(isBetween(0, 'value', moo.root))
  console.log(isBetween(96, 'value', moo.root))
}


// function removeBucket(hashTable, nodeName){
//
// }
// function insertToHash(keyVal) {
//   nodes.forEach((node) =>  )
// }
function stableHash( nodesArgs = nodes){
  console.log(nodes)
  let nodeBucketNames = nodesArgs.reduce((acc, node) => acc.concat(...hashfunctions.map((funct) => funct(node).toString())), [])


  let tree = createTree()
  let treeOfHashedNodes = nodeBucketNames.reduce((tr, hashedNode) => tr.insert(hashedNode, hashedNode), tree)
  let hashTable = nodeBucketNames.reduce((acc, name) => (Object.assign(acc, {[name]: {}})), {})
  // let nodeBuckets = nodes.reduce((obj, node) => Object.assign(
  //   obj,
  //   hashfunctions.reduce((nodeBucket, funct) => Object.assign(nodeBucket, {[funct(node)]: []}),{ }),
  //   {}))
    //let buckets = nodes.reduce(node => hashfunctions.reduce((acc, func) => append(acc, func(node)), []))
    //  let hashedNodes = nodes.reduce((acc, node) => acc.concat(hashfunctions.map((func) => (func(node)))), [])

    // let hashedNodes = hashfunctions.reduce((acc, func) => acc.concat(nodes.map((node) => (func(node)))), [])
    // let hashTable = zipObj(hashedNodes, buckets)
    //  console.log(hashedWord)
    // console.log('BETWEEN', isBetween('1315e07dc5ecfdcec39f54ec16f564b9', 'key', treeOfHashedNodes.root))
    console.log(nodeBucketNames)
    console.log(hashTable)
    nodeBucketNames.forEach((name) => {console.log(hashTable[name])})
  //  console.log((hashTable))
    // console.log()
    // words.forEach(word => {
    //   console.log(md5hash(word))
    //   let nextNode =  isBetween(md5hash(word), 'key', treeOfHashedNodes.root)[1]
    //   let targetNodeKey =  nextNode ? nextNode.key : treeMin(treeOfHashedNodes.root).key
    //
    //   console.log(targetNodeKey)
    //  let targetNodeKey =  nextNode ? nextNode.key : treeMin(treeOfHashedNodes).key
    //  hashTable[targetNodeKey].push({word})
    // })
    // console.log(hashTable)
    // return hashTable
    console.log('exiting stableHash FUnc')
    return hashTable
  }
  //usage()//usage()
  //console.log(createTree())
  //
//  console.log('YEAH', stableHash())
  let newHashRing = new StableHash()
  // console.log(newHashRing.hashTable)
  // console.log(newHashRing.orderTreeNode)
  words.forEach(word => newHashRing._insertKeyVal(word))
//  newHashRing._insertKeyVal({key: '1537c37e949d9efa20d2958af309235c', value: '1537c37e949d9efa20d2958af309235c'})
  // console.log(findStoreLocation('9e21b2ee283109ab44b3ddeb56f9ed7a', newHashRing.orderTreeNode))

  console.log('New hash', newHashRing.hashTable)
  console.log(newHashRing.orderTree.root)

//  newHashRing.insertDataNode('nodeGoogle')

  //console.log(newHashRing.hashTable)

  module.exports = stableHash
