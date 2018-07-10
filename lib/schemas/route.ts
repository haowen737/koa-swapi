import * as Joi from "joi"
import * as methods from 'methods'

const RouteSchema = Joi.object({
  method: Joi.string().allow(methods).required(),
  path: Joi.string().required(),
  config: Joi.object({
    id: Joi.string(),
    summary: Joi.string(),
    description: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    validate: Joi.object(),
    handler: Joi.func()
  })
})

export default RouteSchema
