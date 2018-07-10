const controller = module.exports = {}

controller.getDog = async (ctx) => {
  ctx.status = 201;
  ctx.body = 'get dog ok'
}

controller.postDog = async (ctx) => {
  ctx.status = 201;
  ctx.body = {
    name: 'post dog ok'
  }
}