const { Swapi, schema, Route } = require('../built')
const Joi = require('Joi')

// describe('SwaggerBuilder', function () {
//   it ('can build schema', function (done) {

//     const schema = schema
//       .get('/test')
//       .create('testId')
    
//     console.log('schema----', schema)
//     done()
//   })
// })

const s1 = Route
  .get('/dog')
  .summary('获得一只呆狗')
  .description('要获得一只呆狗的时候可以调这个接口')
  .tags(['doggy'])
  .validate(
    {
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
    }
  )
  .create('s2')

const s2 = Route
  .get('/s2')

    
    console.log('schema----', s1, '--', s2)