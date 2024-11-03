const router = require('koa-router')()
const { loginRedirect } = require('../middlewares/loginChecks')

router.get('/', loginRedirect, async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    blogData: {}
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/session', async (ctx, next) => {
  const session = ctx.session
  if(session == null){
    session.num = 0
  }
  session.num++

  ctx.body = {
    title: 'koa2 json',
    num: session.num
  }
})

module.exports = router
