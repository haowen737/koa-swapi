const controller = module.exports = {}

controller.getCat = async (ctx) => {
  ctx.status = 200;
  ctx.body = 'miaomiaomiao'
}

export default controller