
const Joi = require('joi')

module.exports = [{
  method: 'get',
  path: '/dog',
  config: {
    id: 'getDog',
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
  method: 'post',
  path: '/dog',
  config: {
    id: 'postDog',
    summary: '创建一只呆狗',
    description: '要创建一只呆狗的时候可以调这个接口',
    validate: {
      payload: Joi.object({
        a: Joi.number().integer(),
        b: Joi.number().required()
      }).label('呆狗对象').description('呆狗对象的详情'),
      output: {
        200: {
          body: {
            name: Joi.string()
          }
        }
      }
    },
    handler: (ctx) => {
      ctx.status = 200;
      ctx.body = 'miao223123miaomiao'
    }
  }
}]