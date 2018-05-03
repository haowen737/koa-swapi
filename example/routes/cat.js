
const Joi = require('joi')

module.exports = [{
  method: 'get',
  path: '/cat',
  summary: '获得一只帅气猫',
  description: '想获得一只帅气猫的时候可以调用这个接口',
  tags: ['cat'],
  validate: {
    params: {
      id: Joi.number().integer().min(2).max(4).description('猫的id')
    },
    query: {
      name: Joi.string().required().min(3).max(100).description('猫的名字'),
      sex: Joi.number().required().integer().min(2).max(4).description('猫的性别')
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
