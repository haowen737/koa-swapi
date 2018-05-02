const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const Koapi = require('../lib/koapii')
const router = require('koa-router')()

const app = new Koa()
const koapi = new Koapi()

koapi.register(app, {
  description: 'this is a sweet koapii swagger example',
  version: '1.0.0',
  title: 'koapii swagger example',
  basePath: '/v1'
})
app.use(bodyparser())

// api.buildSwagger()

router.get('/', async (ctx, next) => {
  console.log('ctxctxctxctxctx')
  ctx.body = 'this is page'
});

app.use(router.routes())
app.listen(3333)

console.info('server is listening on port 3333')
