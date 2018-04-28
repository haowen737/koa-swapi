
const Joi = require('joi')

module.exports = [{
  method: 'get',
  path: '/api/dog',
  description: 'get a handsome cat',
  validate: {
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
    ctx.body = 'get dog ok'
  }
}, {
  method: 'post',
  path: '/api/dog',
  description: 'get a handsome cat',
  validate: {
    body: {
      name: Joi.string().min(3).max(100)
    },
    type: 'form',
    output: {
      200: {
        body: {
          name: Joi.string()
        }
      }
    }
  },
  handler: async (ctx) => {
    ctx.status = 201;
    ctx.body = {
      name: 'post dog ok'
    }
  }
}]