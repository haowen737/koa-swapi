// Code from https://github.com/glennjones/hapi-swagger

const j2s = require('joi-to-swagger')
const Hoek = require('hoek')
const Utilities = require('./utilities')

const { get } = require('lodash')

const parameters = module.exports = {}

parameters.allowedProps = [
  'name',
  'in',
  'description',
  'required',
  'schema',
  'type',
  'format',
  'allowEmptyValue',
  'items',
  'collectionFormat',
  'default',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum',
  'maxLength',
  'minLength',
  'pattern',
  'maxItems',
  'minItems',
  'uniqueItems',
  'enum',
  'multipleOf'
]

parameters.build = function (route) {
  const {
    pathParams,
    queryParams,
    payloadParams
  } = route
  const outParameters = []

  if (pathParams) {
    const item = parameters._getSwaggerStructures(pathParams, 'path')
    outParameters.push(outParameters)
  }
  if (queryParams) {
    const item = parameters._getSwaggerStructures(queryParams, 'query')
    outParameters.push(item)
  }
  if (payloadParams) {
    const item = parameters._getSwaggerStructures(payloadParams, 'payload')
    outParameters.push(item)
  }

  // console.log('outParameters', outParameters)
  return outParameters
}

parameters._getSwaggerStructures = function (schema, type) {
  const out = []
  for (const key in schema) {
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
    schema: ''
  }
}
// from hapi-swagger

parameters.fromProperties = function (schemaObj, parameterType) {
  let out = []
  // if (this.allowedParameterTypes.indexOf(parameterType) === -1) {
  //     return out;
  // }

  // if its a single parameter
  if (schemaObj.properties === undefined) {
    // console.log('a', JSON.stringify(schemaObj) + '\n');

    let item = Hoek.clone(schemaObj)
    item.in = parameterType
    item.name = parameterType
    item.schema = {}
    item.schema.type = item.type
    delete item.type

    // convert an object definition
    if (item.$ref) {
      item.schema.$ref = item.$ref
      // item.schema.type = 'object'; // should have to do this but causes validations issues
      delete item.$ref
    }

    // reinstate x-alternatives at parameter level
    if (schemaObj['x-alternatives']) {
      item['x-alternatives'] = schemaObj['x-alternatives']
      delete item.schema['x-alternatives']
    }

    item = Utilities.removeProps(item, this.allowedProps)
    if (!Hoek.deepEqual(item.schema, { 'type': 'object' }, { prototype: false })) {
      // Clean up item shallow level properties and schema nested properties
      item = Utilities.deleteEmptyProperties(item)
      item.schema = Utilities.deleteEmptyProperties(item.schema)

      out.push(item)
    }

    // if its an array of parameters
  } else {
    // console.log('b', JSON.stringify(schemaObj) + '\n');

    // object to array
    const keys = Object.keys(schemaObj.properties)
    keys.forEach((element, index) => {
      let key = keys[index]
      let item = schemaObj.properties[key]
      item.name = key
      item.in = parameterType

      // reinstate required at parameter level
      if (schemaObj.required && (schemaObj.properties[key].required || schemaObj.required.indexOf(key) > -1)) {
        item.required = true
      }
      if (schemaObj.optional && schemaObj.optional.indexOf(key) > -1) {
        item.required = false
      }

      item = Utilities.removeProps(item, this.allowedProps)
      out.push(item)
    })
  }
  return out
}

parameters.buildPathParam
