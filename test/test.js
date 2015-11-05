var compare = require('../')

var before = require('./before')
var after = require('./after')

console.log(JSON.stringify(compare(before, after), null, 2))
