let createTree = require('functional-red-black-tree')
let md5hash = require('blueimp-md5')

const assert = require('assert')


let findNextStoreLocation = require('./utils/utils')

function StableHash(nodeNames = [], hashFunctions = [md5hash]){
  let nodeBucketNames = [ ...nodeNames].reduce((acc, node) => acc.concat([...hashFunctions].map((funct) => funct(node).toString())), [])
  this.nodes = new Set(nodeBucketNames)
  let treeOfHashedNodes = [...nodeBucketNames].reduce((tr, hashedNode) => tr.insert(hashedNode, hashedNode), createTree())
  let hashTable = [...this.nodes].reduce((acc, name) => (Object.assign(acc, {[name]: {}})), {})
  this.orderTree = treeOfHashedNodes
  this.hashTable = hashTable
  this.dataInsertHashes = hashFunctions
}


StableHash.prototype._insertKeyValLocation = function(keyVal, index, storeLocation){
  this.hashTable[storeLocation][keyVal.key] = Object.assign(this.hashTable[storeLocation][keyVal.key] || {}, { [index]: keyVal.value })
}
StableHash.prototype.insertKeyValMultiple = function(keyVal){
  this.dataInsertHashes.forEach((func, index) => {
    let storeLocation = findNextStoreLocation(func(keyVal.key), this.orderTree.root)
    this._insertKeyValLocation(keyVal, index, storeLocation)
  })
}

StableHash.prototype.deleteDataNode = function(nodeHashedValue){
  if (!this.hashTable[nodeHashedValue]){
    throw Error('Store location does not exist')
  }
  else {
    let nodeData = this.hashTable[nodeHashedValue]
    let nextNode = findNextStoreLocation(nodeHashedValue, this.orderTree.root)
    this.dataInsertHashes.forEach((func, index) => {
      Object.keys(nodeData).forEach(key => {
        if (nodeData[key] && nodeData[key][index]){
          let current = findNextStoreLocation(func(key), this.orderTree.root)
          assert.equal(current, nodeHashedValue)
          let nextServerLocation = findNextStoreLocation(current, this.orderTree.root)
          assert.equal(nextServerLocation, nextNode)
          this.hashTable[nextServerLocation][key] = Object.assign(
            this.hashTable[nextServerLocation][key] || {},
            { [index]: nodeData[key][index] })
          delete nodeData[key][index]
          if (!Object.keys(nodeData[key]).length) delete nodeData[key]
        }
      })
    })
    assert.equal(Object.keys(nodeData).length, 0)
    delete this.hashTable[nodeHashedValue]
    this.orderTree = this.orderTree.remove(nodeHashedValue)
  
    //delete from tree of servers
  }
}

StableHash.prototype.insertDataNode = function(dataNode) {
  if (this.nodes.has(dataNode)){
    throw Error(`Duplicate node entry: ${dataNode}`)
  }
  let nodeHashed = this.dataInsertHashes[0](dataNode)
  if (this.hashTable[nodeHashed]){
    throw Error(`Duplicate node entry: ${dataNode} maps to existing location ${this.dataInsertHashes[0](dataNode)}`)
  }
  this.nodes.add(dataNode)
  let nextNode = findNextStoreLocation(nodeHashed, this.orderTree.root)
  this.orderTree = this.orderTree.insert(nodeHashed, nodeHashed)
  this.hashTable[nodeHashed] = {}
  let nextNodeData = this.hashTable[nextNode]
  this.dataInsertHashes.forEach((func, index) => {
    Object.keys(nextNodeData).forEach(key => {
      if (nextNodeData[key] && nextNodeData[key][index]){
        let storeLocation = findNextStoreLocation(func(key), this.orderTree.root)
        if (storeLocation === nodeHashed){
          this.hashTable[storeLocation][key] = Object.assign(
            this.hashTable[storeLocation][key] || {},
            { [index]: nextNodeData[key][index] })
          delete nextNodeData[key][index]
          if (!Object.keys(nextNodeData[key]).length) delete nextNodeData[key]
        }
      }
    })
  })
}
StableHash.prototype.find = function(key, index = 0){
  if (index >= this.dataInsertHashes.length){
    throw Error(`Index ${index} out of bounds`)
  }
  let hashValue = (this.dataInsertHashes[index](key))
  let serverLocation = findNextStoreLocation(hashValue, this.orderTree.root)

  return [serverLocation, this.hashTable[serverLocation][key][index]] || null
}

module.exports = StableHash
