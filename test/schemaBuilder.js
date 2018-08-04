const { Swapi, Validator, Route } = require('../')
const Joi = require('Joi')

describe('SwaggerBuilder', function () {
  it ('can build schema', function (done) {

    Route
      .get('/dog')
      .summary('获得一只呆狗')
      .description('要获得一只呆狗的时候可以调这个接口')
      .tags(['doggy'])
      .validate(
        Validator
          .params({
              id: Joi.string().required().min(2).max(4).description('猫的id')
          })
          .query({
            name: Joi.string().required().min(3).max(100).description('猫的名字'),
            sex: Joi.any().required().valid(['0', '1']).description('猫的性别, 0:男, 1:女')
          })
          .output({
            200: {
              body: Joi.string()
            }
          })
      )
      .create('s2')

    done()
  })
})

    