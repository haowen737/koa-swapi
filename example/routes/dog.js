
const Joi = require('joi')
const { Route, Validator } = require('../../built')


module.exports = [
  Route
    .get('/dog')
    .summary('获得一只呆狗')
    .description('要获得一只呆狗的时候可以调这个接口')
    .tags(['doggy'])
    // .validate(
    //   Validator
    //     .query({
    //       name: Joi.string().required().min(3).max(100).description('狗的名字'),
    //     })
    //     .payload(Joi.object({
    //       a: Joi.number().integer(),
    //       b: Joi.number().required()
    //     }).label('呆狗对象').description('呆狗对象的详情'))
    //     .output({
    //       200: {
    //         body: Joi.string()
    //       }
    //     })
    // )
    .create('getDog'),

  Route
    .post('/dog')
    .summary('创建一只呆狗')
    .description('要创建一只呆狗的时候可以调这个接口')
    .tags(['doggy'])
    // .validate(
    //   Validator
    //     .payload(Joi.object({
    //       a: Joi.number().integer(),
    //       b: Joi.number().required()
    //     }).label('呆狗对象').description('呆狗对象的详情'))
    //     .output({
    //       200: {
    //         body: Joi.string()
    //       }
    //     })
    // )
    .create('postDog'),
]
