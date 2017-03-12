let createTree = require('functional-red-black-tree')
let md5hash = require('blueimp-md5')
var sha1 = require('sha1');


let nodes = new Set(['node1', 'node2', 'node3', 'node4'])
let words = [
  {key: "skip", value: "skip"}, {key: "flaky", value: "flaky"}, {key: "special", value: "special"},
  {key: "fuel", value: "fuel"}, {key: "cent", value: "cent"}, {key: "broad", value: "broad"}, {key: "slippery", value:"slippery"},
  {key: "previous", value: "previous"}, {key: "transport", value: "transport"},
  {key: "tame", value: "tame"}, {key: "hate", value: "hate"}, {key: "pin", value: "pin"}
]


let findStoreLocation = require('./utils/utils')

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


StableHash.prototype._insertKeyVal = function(keyVal){

  this.dataInsertHashes.forEach((func, index) => {
    //   console.log('KEY TO INSERT.', keyVal.key)
    // console.log('HASHED KEY VAL', func(keyVal.key))
    let storeLocation = findStoreLocation(func(keyVal.key), this.orderTree.root)
    //  console.log('INSERT LOCATION, ', storeLocation)
    this.hashTable[storeLocation][keyVal.key] = Object.assign(this.hashTable[storeLocation][keyVal.key] || {}, { [index]: keyVal.value })

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
  this.nodes.add(dataNode)
  let nextNode = findStoreLocation(nodeHashed, this.orderTree.root)
  this.orderTree = this.orderTree.insert(nodeHashed, nodeHashed)
  this.hashTable[nodeHashed] = {}
  let nextNodeData = this.hashTable[nextNode]
  console.log('REHASHING LOCALLY DATA,', nextNodeData)
  this.dataInsertHashes.forEach((func, index) => {
    Object.keys(nextNodeData).forEach(key => {
      if (nextNodeData[key] && nextNodeData[key][index]){
        let storeLocation = findStoreLocation(func(key), this.orderTree.root)
        if (storeLocation === nodeHashed){
          console.log('Gotta transfer,', key, func(key), findStoreLocation(func(key), this.orderTree.root))
          this.hashTable[storeLocation][key] = Object.assign(this.hashTable[storeLocation][key] || {}, { [index]: nextNodeData[key][index] })
          delete nextNodeData[key][index]
          if (!Object.keys(nextNodeData[key]).length) delete nextNodeData[key]
          console.log('After removal', nextNodeData )
        }
        else {
          console.log('wont transfer', key, func(key), findStoreLocation(func(key), this.orderTree.root))
        }
      }
    })
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

//usage()//usage()
//console.log(createTree())
//
//  console.log('YEAH', stableHash())
let newHashRing = new StableHash()
// console.log(newHashRing.hashTable)
// console.log(newHashRing.orderTreeNode)
words.forEach(word => newHashRing._insertKeyVal(word))
newHashRing._insertKeyVal({key: '1537c37e949d9efa20d2958af309235c', value: '1537c37e949d9efa20d2958af309235c'})
// console.log(findStoreLocation('9e21b2ee283109ab44b3ddeb56f9ed7a', newHashRing.orderTreeNode))

console.log('New hash', newHashRing.hashTable)
console.log(newHashRing.orderTree.root)

newHashRing.insertDataNode('nodeGoogle')

console.log('after insertion', newHashRing.hashTable)
//  console.log(newHashRing.orderTree.root)
//  console.log('FOCUSING', newHashRing.orderTree.root.left)
module.exports = StableHash
