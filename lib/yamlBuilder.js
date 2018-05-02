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

const yamlBuilder = module.exports = {}
// TODO: 格式化json {paths: {route: {method: {}}}
yamlBuilder.buildSpec = function(specList) {
  const paths = []
  const parsedTags = []
  const _spec = {}
  specList.forEach((spec, index) => {
    const specCopy = cloneDeep(spec)
    const { validate, tags } = specCopy

    // const _spec = {}
    const cur = {}
    cur[specCopy.method] = {}
    cur.summary = specCopy.summary
    cur.description = specCopy.description
    cur.parameters = specCopy.parameters

    _spec[specCopy.path] = cur

    console.log('specCopy', specCopy)
  })
  return { paths, tags: parsedTags }
}

yamlBuilder.build = function(desc) {
  const descCopy = cloneDeep(desc)
  const descriptor = swaggerBase
  
  descriptor.info.description = descCopy.description
  descriptor.info.version = descCopy.version
  descriptor.info.title = descCopy.title
  descriptor.info.termsOfService = descCopy.termsOfService

  descriptor.paths = descCopy.apis
  descriptor.tags = descCopy.tags
  
  return descriptor
}