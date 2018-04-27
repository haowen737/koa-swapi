const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const Koapi = require('../lib/koapii')

const koapi = new Koapi()
const app = new Koa()

const api = koapi.register()
api.buildSwagger()

app.use(bodyparser())
app.use(api.load(), api.allowedMethods())

app.listen(3333)

console.info('server is listening on port 3333')