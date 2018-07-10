// const cat = require('./cat')
// const dog = require('./dog')

// module.exports = [
//   ...cat,
//   ...dog
// ]
const { api } = require('../../built')

const catSchema = require('./cat')
const catController = require('../controller/cat')

const dogSchema = require('./dog')
const dogController = require('../controller/dog')

module.exports = [
  api.schemas(catSchema).handler(catController),
  api.schemas(dogSchema).handler(dogController),
]
