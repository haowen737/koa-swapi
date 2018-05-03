const Joi = require('joi')
const j2s = require('joi-to-swagger')
const { cloneDeep } = require('lodash')

const swaggerBase = require('./swaggerBase')
const validTarget = ['query', 'params', 'body']

const _parseJoi = function(joiTarget) {
  const parsedTarget = {}
  validTarget.forEach(t => {
    const targets = joiTarget[t]
    if (targets) {
      const schema = Joi.object().keys({ ...targets })
      const { swagger } = j2s(schema)
      parsedTarget[t] = swagger
    }
  })
  return parsedTarget
}

const _parseTag = function(tags = []) {
  const parsedTags = []
  tags.forEach(t   => {
    const tag = {}
    tag.name = t
    parsedTags.push(tag)
  })
  return parsedTags
}

const _parseParameters = function (params) {
  return []
}

const pathMelter = module.exports = {}
// TODO: 格式化json {paths: {route: {method: {}}}
pathMelter.build = function(specList) {
  const paths = []
  const parameters = []
  const _spec = {}
  specList.forEach((spec, index) => {
    const specCopy = cloneDeep(spec)
    const { validate } = specCopy
    const cur = {}
    cur[specCopy.method] = {}
    cur[specCopy.method].summary = specCopy.summary || ''
    cur[specCopy.method].description = specCopy.description || ''
    cur[specCopy.method].tags = specCopy.tags || []

    _spec[specCopy.path] = _spec[specCopy.path] || {}
    
    Object.assign(_spec[specCopy.path], cur)

    // const _parameters = _parseParameters(validate)

    cur[specCopy.method].parameters = validate
  })
  paths.push(_spec)
  
  return paths
}

// pathMelter.build = function(desc) {
//   const descCopy = cloneDeep(desc)
//   const descriptor = swaggerBase
  
//   descriptor.info.description = descCopy.description
//   descriptor.info.version = descCopy.version
//   descriptor.info.title = descCopy.title
//   descriptor.info.termsOfService = descCopy.termsOfService

//   descriptor.paths = descCopy.paths
//   descriptor.tags = descCopy.tags
  
//   return descriptor
// }