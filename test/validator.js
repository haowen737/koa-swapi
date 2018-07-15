const shoule = require('should')
const request = require('supertest')
const expect = require('expect')
const http = require('http')
const Koa = require('koa')
const Joi = require('joi')

const { Swapi, Api, Route, Validator } = require('../built')

const handler = (ctx) => {
  console.log('ctx.request.body', ctx.request.body)
  ctx.body = 'test ok'
}

const formatGetRoutes = (path, validate) => [
  Api
    .schemas([
      Route
        .get(path)
        .validate(validate)
        .create('handler')
    ])
    .handler({ handler })
]

const formatPostRoutes = (path, validate) => [
  Api
    .schemas([
      Route
        .post(path)
        .validate(validate)
        .create('handler')
    ])
    .handler({ handler })
]

describe('Validator', function () {
  it('can validate params', function (done) {
    const app = new Koa()
    const swapi = new Swapi()

    const apis = formatGetRoutes('/test/:id', Validator.params({
      id: Joi.string().min(2).required()
    }))

    swapi.register(app, { silence: true, apis })
    request(http.createServer(app.callback()))
      .get('/test/1')
      .expect(400, done)
  })

  it('can validate query', function (done) {
    const app = new Koa()
    const swapi = new Swapi()

    const apis = formatGetRoutes('/test', Validator.query({
      id: Joi.string().min(2).required()
    }))

    swapi.register(app, { silence: true, apis })
    request(http.createServer(app.callback()))
      .get('/test?id=1')
      .expect(400, done) 
  })

  it('can validate payload', function (done) {
    const app = new Koa()
    const swapi = new Swapi()

    const apis = formatPostRoutes('/test', Validator.payload(
      Joi.object({
        key1: Joi.string().min(2).required(),
        key2: Joi.number().required()
      }).required()
    ))

    swapi.register(app, { silence: true, apis })
    request(http.createServer(app.callback()))
      .post('/test')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
  })

})