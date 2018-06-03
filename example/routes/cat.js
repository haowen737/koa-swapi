
const Joi = require('joi')

module.exports = [{
  method: 'get',
  path: '/cat/:id',
  config: {
    id: 'getCat',
    summary: '获得一只帅气猫',
    description: '想获得一只帅气猫的时候可以调用这个接口',
    validate: {
      params: {
        id: Joi.string().required().min(2).max(4).description('猫的id')
      },
      query: {
        name: Joi.string().required().min(3).max(100).description('猫的名字'),
        sex: Joi.any().required().valid(['0', '1']).description('猫的性别, 0:男, 1:女')
      },
      // type: 'form',
      output: {
        200: {
          body: Joi.string()
        }
      }
    },
    handler: (ctx) => {
      ctx.status = 200;
      ctx.body = 'miao223123miaomiao'
    }
  }
}]
