
const Joi = require('joi')

module.exports = [{
  method: 'get',
  path: '/dog',
  config: {
    summary: '获得一只呆狗',
    description: '要获得一只呆狗的时候可以调这个接口',
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
    }
  }
}, {
  method: 'put',
  path: '/dog',
  config: {
    summary: '创建一只呆狗',
    description: '要创建一只呆狗的时候可以调这个接口',
    validate: {
      payload: Joi.object({
        a: Joi.number(),
        b: Joi.number().required()
      }).label('呆狗对象').description('呆狗对象的详情'),
      output: {
        200: {
          body: {
            name: Joi.string()
          }
        }
      }
    }
  }
}]