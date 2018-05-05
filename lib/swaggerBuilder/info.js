const swaggerBase = require('./swaggerBase')
const defaultSetting = require('../defaults')

const info = module.exports = {}

info.build = function (customInfo = {}) {
  return Object.assign({}, swaggerBase, defaultSetting, customInfo)
}
