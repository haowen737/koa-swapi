
const Joi = require('joi')

module.exports = [{
  method: 'get',
  path: '/dog',
  summary: '获得一只呆狗',
  description: '要获得一只呆狗的时候可以调这个接口',
  tags: ['dog'],
  validate: {
    query: {
      name: Joi.string().required().min(3).max(100).description('狗的名字'),
    },
    type: 'form',
    output: {
      200: {
        body: Joi.string()
      }
    }
  },
}, {
  method: 'put',
  path: '/dog',
  summary: '创建一只呆狗',
  description: '要创建一只呆狗的时候可以调这个接口',
  tags: ['dog'],
  validate: {
    payload: Joi.object({
      a: Joi.number(),
      b: Joi.number()
    }),
    output: {
      200: {
        body: {
          name: Joi.string()
        }
      }
    }
  },
}]