let createTree = require('functional-red-black-tree')
let md5hash = require('blueimp-md5')
var sha1 = require('sha1');
const assert = require('assert')


let nodes = new Set(['node1', 'node2', 'node3'])
let words = [
  {key: "republican-healthcare-trump-pence-medicaid-indiana", value: "Each month, shots for her severe asthma cost $3,000."},
  {key: "cillian-murphy-it-is-getting-absurd-with-the-dumbing-down", value: "Though his modesty is sincere, it’s difficult to agree.  "},
  {key: "saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite", value: "In it, guest host Scarlett Johansson was a scientist presenting her new technology "},
  {key: "trump-immigration-sxsw-sanctuary-cities-philadelphia-santa-fe", value: "Both were concerned that there will be more attacks on their cities’ autonomy in the future."},
  // {key: "broad", value: "broad"}, {key: "slippery", value:"slippery"},
  {key: "ashley-biden-on-athleisure-and-why-her-father-would-make-a-fantastic-president", value: "The daughter of the former vice-president has brought her interest "},
  // {key: "sarah-weddington-roe-v-wade-lawyer-legalise-abortion-america-donald-trump", value: "Austin is one of the more liberal towns in Texas, though the state itself is barely liberal. Most people I know strongly expected Hillary to win. But I’d been on a panel a few weeks before where a man had said:"},
  // {key: "helpful-man-saves-woman-effort-telling-idea-boss-h-55501", value: "In an unprompted act of generosity from one coworker to another, Spryte Logistics employee Ben Graham reportedly took the initiative to share one of Emily Fehrman’s ideas with their boss on Friday, saving her the time and effort of doing it herself."},
  // {key: "tips-handling-office-conflict-55505", value: "If you witness an altercation unfolding, quickly gauge the likeliest victor before jumping in to defend them."},
  // {key: "how-keep-your-personal-information-secure-55506", value: "Monitor your credit card statements to make sure the only unusual purchases are the ones you made on Amazon while drunk."},
  {key: "departing-obama-tearfully-shoos-away-loyal-drone-f-55100", value: "Stopping and turning around as he made his way across the South Lawn after "}
]


let findNextStoreLocation = require('./utils/utils')

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


StableHash.prototype._insertKeyValLocation = function(keyVal, index, storeLocation){
  this.hashTable[storeLocation][keyVal.key] = Object.assign(this.hashTable[storeLocation][keyVal.key] || {}, { [index]: keyVal.value })
}
StableHash.prototype._insertKeyValMultiple = function(keyVal){

  this.dataInsertHashes.forEach((func, index) => {
    let storeLocation = findNextStoreLocation(func(keyVal.key), this.orderTree.root)
    this._insertKeyValLocation(keyVal, index, storeLocation)
    //  this.hashTable[storeLocation][keyVal.key] = Object.assign(this.hashTable[storeLocation][keyVal.key] || {}, { [index]: keyVal.value })

  })
}

StableHash.prototype.deleteDataNode = function(nodeHashedValue){
  if (!this.hashTable[nodeHashedValue]){
    throw Error('Store location does not exist')
  }
  else {
    let nodeData = this.hashTable[nodeHashedValue]
    let nextNode = findNextStoreLocation(nodeHashedValue, this.orderTree.root)
    //let nextNodeData = this.hashTable[nextNode]
    this.dataInsertHashes.forEach((func, index) => {
      Object.keys(nodeData).forEach(key => {
        if (nodeData[key] && nodeData[key][index]){
          let current = findNextStoreLocation(func(key), this.orderTree.root)
          assert.equal(current, nodeHashedValue)
          let nextServerLocation = findNextStoreLocation(current, this.orderTree.root)
          assert.equal(nextServerLocation, nextNode)
          this.hashTable[nextServerLocation][key] = Object.assign(this.hashTable[nextServerLocation][key] || {}, { [index]: nodeData[key][index] })
          delete nodeData[key][index]
          if (!Object.keys(nodeData[key]).length) delete nodeData[key]
        }
      })
    })
    assert.equal(Object.keys(nodeData).length, 0)
  }
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
  let nextNode = findNextStoreLocation(nodeHashed, this.orderTree.root)
  this.orderTree = this.orderTree.insert(nodeHashed, nodeHashed)
  this.hashTable[nodeHashed] = {}
  let nextNodeData = this.hashTable[nextNode]
  this.dataInsertHashes.forEach((func, index) => {
    Object.keys(nextNodeData).forEach(key => {
      if (nextNodeData[key] && nextNodeData[key][index]){
        let storeLocation = findNextStoreLocation(func(key), this.orderTree.root)
        if (storeLocation === nodeHashed){
          this.hashTable[storeLocation][key] = Object.assign(this.hashTable[storeLocation][key] || {}, { [index]: nextNodeData[key][index] })
          delete nextNodeData[key][index]
          if (!Object.keys(nextNodeData[key]).length) delete nextNodeData[key]
        }
      }
    })
  })
}
StableHash.prototype.findViaHashFunction = function(index, key){
  if (index >= this.dataInsertHashes.length){
    throw Error(`Index ${index} out of bounds`)
  }
  return this.hashTable[this.hashFunctions[index](key)][key][index] || null
}
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
words.forEach(word => newHashRing._insertKeyValMultiple(word))
//newHashRing._insertKeyValMultiple({key: '1537c37e949d9efa20d2958af309235c', value: '1537c37e949d9efa20d2958af309235c'})
// console.log(findNextStoreLocation('9e21b2ee283109ab44b3ddeb56f9ed7a', newHashRing.orderTreeNode))

console.log('New hash', newHashRing.hashTable)
//console.log(newHashRing.orderTree.root)

newHashRing.insertDataNode('nodeGoogle')
//newHashRing.insertDataNode('nodeAmazonService')
console.log('after insertion', newHashRing.hashTable)
newHashRing.deleteDataNode('6c5cfc398823beff41df6200e78cb2d5')
//  console.log(newHashRing.orderTree.root)
//  console.log('FOCUSING', newHashRing.orderTree.root.left)
module.exports = StableHash
