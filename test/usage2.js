const StableHash = require('../stableHashing')
const sha1 = require('sha1')
const sha1Hash = (node) => sha1(node).slice(0, 32)
let md5hash = require('blueimp-md5')

let nodes = new Set(['node1', 'node2', 'node3'])
let words = [
  {key: "republican-healthcare-trump-pence-medicaid-indiana", value: "Each month, shots for her severe asthma cost $3,000."},
  {key: "cillian-murphy-it-is-getting-absurd-with-the-dumbing-down", value: "Though his modesty is sincere, it’s difficult to agree.  "},
  {key: "saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite", value: "In it, guest host Scarlett Johansson was a scientist presenting her new technology "},
  {key: "trump-immigration-sxsw-sanctuary-cities-philadelphia-santa-fe", value: "Both were concerned that there will be more attacks on their cities’ autonomy in the future."},
  {key: "ashley-biden-on-athleisure-and-why-her-father-would-make-a-fantastic-president", value: "The daughter of the former vice-president has brought her interest "},
  {key: "departing-obama-tearfully-shoos-away-loyal-drone-f-55100", value: "Stopping and turning around as he made his way across the South Lawn after "}
]

const newHashRing = new StableHash(nodes, [md5hash, sha1Hash])

words.forEach(word => newHashRing.insertKeyValMultiple(word))

console.log('New hash', newHashRing.hashTable)
console.log('====================')
console.log('Looking for aritcle - using hash function 0: saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')

console.log('Found it:', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[1])
console.log('In location', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[0])
console.log('====================')
console.log('Looking for aritcle - using hash function 1: saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')

console.log('Found it:', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite', 1)[1])
console.log('In location', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite', 1)[0])

console.log('====================')
console.log('INSERTING NEW NODE')
newHashRing.insertDataNode('nodeGoogle')

// //newHashRing.insertDataNode('nodeAmazonService')
console.log('====================')
console.log('AFTER INSERTION ')
console.log(newHashRing.hashTable)
console.log('====================')
console.log('Looking for aritcle - using hash function 0: saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')

console.log('Found it:', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[1])
console.log('In Location', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[0])
console.log('====================')
console.log('Looking for aritcle - using hash function 1: saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')

console.log('Found it:', (newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite', 1)[1]))
console.log('In location', (newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite', 1)[0]))
console.log('====================')
// console.log('DELETING NEW NODE')
// newHashRing.deleteDataNode('6c5cfc398823beff41df6200e78cb2d5')
// console.log(newHashRing.hashTable)
// //console.log(newHashRing.findViaHashFunction(0, 'saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite'))
//
// //  console.log(newHashRing.orderTree.root)
// //  console.log('FOCUSING', newHashRing.orderTree.root.left)
