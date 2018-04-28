
const Joi = require('joi')

module.exports = [{
  method: 'get',
  path: '/api/cat',
  description: 'get a sweet cat',
  validate: {
    params: {
      id: Joi.number().integer().min(2).max(4)
    },
    query: {
      name: Joi.string().required().min(3).max(100),
      sex: Joi.number().required().integer().min(2).max(4)
    },
    type: 'form',
    output: {
      200: {
        body: Joi.string()
      }
    }
  },
  handler: async (ctx) => {
    ctx.status = 201;
    ctx.body = 'here is you sweet cat!'
  }
}]