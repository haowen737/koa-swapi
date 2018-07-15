// const cat = require('./cat')
// const dog = require('./dog')

// module.exports = [
//   ...cat,
//   ...dog
// ]
const { Api } = require('../../built')

const catSchema = require('./cat')
const catController = require('../controller/cat')

const dogSchema = require('./dog')
const dogController = require('../controller/dog')

module.exports = [
  Api.schemas(catSchema).handler(catController),
  Api.schemas(dogSchema).handler(dogController),
]
