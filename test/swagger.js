const request = require('supertest')
const expect = require('expect')
const http = require('http')
const Koa = require('koa')
const Joi = require('Joi')

const { Swapi, api } = require('../built')

const apis = [
  api
    .schemas([{
      method: 'get',
      path: '/test/:id',
      config: {
        id: 'getTest',
        validate: {
          params: {
            id: Joi.string().required().min(2).max(4).description('猫的id')
          },
        }
      }
    }])
    .handler({ getTest: async (ctx) => {
      ctx.body = 'test ok'
    }})
]

describe('Swagger', function () {
  it ('swagger json built succeesfully', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app, { printLog: false, apis })
    request(http.createServer(app.callback()))
      .get('/swagger.json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
  })

  it('swagger documentation can be accessed', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app, { printLog: false, apis })
    request(http.createServer(app.callback()))
      .get('/documentation/')
      .expect(200, done)
  })
})