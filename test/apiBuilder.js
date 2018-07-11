const shoule = require('should')
const request = require('supertest')
const expect = require('expect')
const http = require('http')
const Koa = require('koa')
const Joi = require('joi')

const { Swapi, api } = require('../built')

const schemas = [{
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
}]

const handler = { getTest: async (ctx) => {
  ctx.body = 'test ok'
}}

const apis = [
  api.schemas(schemas).handler(handler)
]

describe('ApiBuilder', function () {
  it('should build controller with route', function (done) {
    const app = new Koa()
    const swapi = new Swapi()
    swapi.register(app, { printLog: false, apis })
    request(http.createServer(app.callback()))
      .get('/test/xxx')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.text).toMatch('test ok')
        done()
      })
  })
})
