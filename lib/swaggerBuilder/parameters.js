const j2s = require('joi-to-swagger')
const Hoek = require('hoek')

const { get } = require('lodash')

const parameters = module.exports = {}

parameters.build = function (route) {
  console.log('route', route)
  const {
    pathParams,
    queryParams,
    payloadParams
  } = route
  const pathParamsStructure = pathParams
    ? parameters._getSwaggerStructures(pathParams, 'path')
    : {}
  const queryParamsStructure = queryParams
    ? parameters._getSwaggerStructures(queryParams, 'query')
    : {}
  const payloadParamsStructure = payloadParams
    ? parameters._getSwaggerStructures(payloadParams, 'payload')
    : {}

//   console.log('pathParamsStructure', pathParamsStructure, 
// 'queryParamsStructure', queryParamsStructure, 
// 'payloadParamsStructure', payloadParamsStructure, )

  return {
    pathParams: pathParamsStructure,
    queryParams: queryParamsStructure,
    payloadParams: payloadParamsStructure
  }
}

parameters._getSwaggerStructures = function (schema, type) {
  const out = []
  for(const key in schema) {
    if (schema.hasOwnProperty(key)) {
      const structures = parameters._getDefault(key, type)
      const element = schema[key]

      const { swagger } = j2s(schema)

      const description = get(swagger, `properties.${key}.description`)
      const required = get(swagger, `properties.${key}.required`)

      structures.description = description
      structures.required = required

      out.push({ ...structures, schema: swagger })
    }
  }
  return out
}

parameters._getDefault = function (key, inType) {
  return {
    in: inType,
    name: key,
    description: '',
    required: true,
    schema: '',
  }
}

parameters.buildPathParam