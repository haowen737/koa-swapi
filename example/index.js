const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const Swapi = require('../lib')
const router = require('koa-router')()

const app = new Koa()
const swapi = new Swapi()

app.use(bodyparser())

swapi.register(app, {
  description: 'this is a sweet swapii swagger example',
  version: '1.0.0',
  title: 'swapii swagger example',
  basePath: '/v1'
})

router.get('/', async (ctx, next) => {
  ctx.body = 'this is page'
});

app.use(router.routes())

app.listen(3333)

console.info('server is listening on port 3333')
