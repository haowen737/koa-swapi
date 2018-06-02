const Joi = require('joi')
const debug = require('debug')('swapi-validator')

const ValidType = ['params', 'query', 'payload']

const validator = module.exports = {}

const internals = {}
/**
 * validate specific route;
 * each route has validate spec;
 * validate spec in route called schema;
 * we use joi validate request with schema;
 */
validator.valid = function (validate, ctx) {
  // console.log('enter valid -----', validate)
  for (let i = 0; i < ValidType.length; i++) {
    const type = internals.getCurrentValidType(i)
    const schema = internals.getCurrentValidSchema(validate, type)
    const data = internals.getCurrentValidData(ctx, type)

    // console.log('targets', targets, type, validate)
    if (schema) {
      
      const { error } = Joi.validate(data, schema)
      if (error) {
        ctx.throw(400, 'ValidationError', error)
      }
    }
  }
}

internals.getCurrentValidType = function (i) {
  return ValidType[i]
}

internals.getCurrentValidSchema = function (validate, type) {
  const schema = validate[type]
  // console.log('++++++', schema.schemaType, schema)

  if (schema && schema.schemaType !== 'object') {
    return Joi.object().keys(schema)
  }

  return schema
}

internals.getCurrentValidData = function (ctx, type) {
  if (type === 'payload') {
    return ctx.request.body
  }
  
  return ctx[type]
}