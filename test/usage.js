const StableHash = require('../stableHashing')


let nodes = new Set(['node1', 'node2', 'node3'])
let words = [
  {key: "republican-healthcare-trump-pence-medicaid-indiana", value: "Each month, shots for her severe asthma cost $3,000."},
  {key: "cillian-murphy-it-is-getting-absurd-with-the-dumbing-down", value: "Though his modesty is sincere, it’s difficult to agree.  "},
  {key: "saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite", value: "In it, guest host Scarlett Johansson was a scientist presenting her new technology "},
  {key: "trump-immigration-sxsw-sanctuary-cities-ladelphia-santa-fe", value: "Both were concerned that there will be more attacks on their cities’ autonomy in the future."},
  {key: "ashley-biden-on-athleisure-and-why-her-father-would-make-a-fantastic-pres", value: "The daughter of the former vice-president has brought her interest "},
  {key: "snow-storm-blizzard-forecast-tue", value: "Maybe you thought you were going to get through this winter without too much rough weather "}
]
const newHashRing = new StableHash(nodes)

words.forEach(word => newHashRing.insertKeyValMultiple(word))
console.log('New hash', newHashRing.hashTable)
console.log('====================')
console.log('Looking for aritcle : saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')

console.log('Found it:', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[1])
console.log('In location', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[0])
console.log('====================')

console.log('INSERTING NEW NODE')
newHashRing.insertDataNode('nodeGoogle')

// //newHashRing.insertDataNode('nodeAmazonService')
console.log('====================')
console.log('AFTER INSERTION ')
console.log(newHashRing.hashTable)
console.log('====================')
console.log('Looking for aritcle : saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')

console.log('Found it:', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[1])
console.log('In Location', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[0])
console.log('====================')
console.log('DELETING NEW NODE')

newHashRing.deleteDataNode('6c5cfc398823beff41df6200e78cb2d5')
console.log('AFTER DELETION ')
console.log(newHashRing.hashTable)
console.log('====================')
console.log('Looking for aritcle : saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')

console.log('Found it:', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[1])
console.log('In Location', newHashRing.find('saturday-night-live-scarlett-johansson-gives-political-jokes-some-bite')[0])
