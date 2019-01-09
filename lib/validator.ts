import * as Joi from "joi"
import * as debug from "debug"

const ValidType = ["params", "query", "payload"]
const DEBUG = debug("swapi:validator")

class Validator {
  public valid(validate, ctx, logger) {
    for (let i = 0; i < ValidType.length; i++) {
      const method = ctx.request.method
      const url = ctx.request.url
      const type = internals.getCurrentValidType(i)
      const schema = internals.getCurrentValidSchema(validate, type)
      const data = internals.getCurrentValidData(ctx, type)
      logger.info(`validate param in ${method} ${url}`, { data })
      if (schema) {
        const { error } = Joi.validate(data, schema)

        if (error) {
          ctx.throw(400, "ValidationError", error)
        }
      }
    }
  }
}

const internals: any = {}

/**
 * validate specific route;
 * each route has validate spec;
 * validate spec in route called schema;
 * we use joi validate request with schema;
 */

internals.getCurrentValidType = (i) => {
  return ValidType[i]
}

internals.getCurrentValidSchema = (validate, type) => {
  const schema = validate[type]

  if (schema && schema.schemaType !== "object") {
    return Joi.object().keys(schema)
  }

  return schema
}

internals.getCurrentValidData = (ctx, type) => {
  if (type === "payload") {
    return ctx.request.body
  }

  return ctx[type]
}

export default new Validator()


