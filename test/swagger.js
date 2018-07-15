const request = require('supertest')
const expect = require('expect')
const http = require('http')
const Koa = require('koa')
const Joi = require('Joi')

const { Swapi, Api, Route, Validator } = require('../built')

const apis = [
  Api
    .schemas([
      Route
        .get('/test/:id')
        .tags('getTest')
        .validate(
          Validator
            .params({
              id: Joi.string().required().min(2).max(4).description('猫的id')
            })
            .output({
              200: {
                body: Joi.string()
              }
            })
        )
        .create('getTest')
    ])
    .handler({ getTest: async (ctx) => {
      ctx.body = 'test ok'
    }})
]

describe('Swagger', function () {
  it ('swagger json built succeesfully', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app, { silence: true, apis })
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
    swapi.register(app, { silence: true, apis })
    request(http.createServer(app.callback()))
      .get('/documentation/')
      .expect(200, done)
  })
})