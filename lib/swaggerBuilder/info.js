const swaggerBase = require('./swaggerBase')

const info = module.exports = {}

info.build = function (customInfo = {}) {
  return Object.assign({}, swaggerBase, customInfo)
}
