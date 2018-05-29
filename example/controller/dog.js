const controller = module.exports = {}

controller.get = async (ctx) => {
  ctx.status = 201;
  ctx.body = 'get dog ok'
}

controller.put = async (ctx) => {
  ctx.status = 201;
  ctx.body = {
    name: 'post dog ok'
  }
}