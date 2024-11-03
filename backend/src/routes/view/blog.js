const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controller/blog-profile')
const { getSquareBlogList } = require('../../controller/blog-square')
const { getFans, getFollowers} = require('../../controller/user-relation')
const { isExist } = require('../../controller/user')
const { getHomeBlogList } = require('../../controller/blog-home')
const { getAtMeCount, getAtMeBlogList, markAsRead } = require('../../controller/blog-at')

router.get('/', loginRedirect, async (ctx, next) => {
  const userInfo = ctx.session.userInfo
  const { id: userId } = userInfo

  // 获取第一页数据
  console.log('获取第一页数据', userId)
  const result = await getHomeBlogList(userId)
  const { isEmpty, blogList, pageSize, pageIndex, count } = result.data

  // 获取粉丝
  const fansResult = await getFans(userId)
  const { count: fansCount, fansList } = fansResult.data

  // 获取关注人列表
  const followersResult = await getFollowers(userId)
  const { count: followersCount, followersList } = followersResult.data  

  // 获取 @ 数量
  const atCountRusult = await getAtMeCount(userId)
  const { count: atCount } = atCountRusult.data
  console.log('@ 数量', atCount)



  await ctx.render('index', {
    userData: {
      userInfo: userInfo,
      fansData: {
        list: fansList,
        count: fansCount
      },
      followersData: {
          count: followersCount,
          list: followersList
      },
      atCount
    },
    blogData: {
        isEmpty,
        blogList,
        pageSize,
        pageIndex,
        count
    }

  })
})

// 个人主页
router.get('/profile', loginRedirect, async (ctx, next) => {
  const { userName } = ctx.session.userInfo
  ctx.redirect(`/profile/${userName}`)
})

router.get('/profile/:userName', loginRedirect, async(ctx, next)=>{

  const { userName: cruUserName } = ctx.params
  const result = await getProfileBlogList(cruUserName, 0)
  const { isEmpty, blogList, pageSize, pageIndex, count } = result.data

  // 已登录用户的信息
  const myUserInfo = ctx.session.userInfo
  const myUserName = myUserInfo.userName
  let curUserInfo

  const { userName: curUserName } = ctx.params

  const isMe = myUserName === curUserName
  if (isMe) {
      // 是当前登录用户
      curUserInfo = myUserInfo
  } else {
      // 不是当前登录用户
      const existResult = await isExist(curUserName)
      if (existResult.errno !== 0) {
          // 用户名不存在
          return
      }
      // 用户名存在
      curUserInfo = existResult.data
  }

 
  // 获取粉丝
  const fansResult = await getFans(curUserInfo.id)
  const { count: fansCount, fansList } = fansResult.data

  // 获取关注人列表
  console.log('curUserInfo.id', curUserInfo.id)
  const followersResult = await getFollowers(curUserInfo.id)
  const { count: followersCount, followersList } = followersResult.data

  // 我是否关注了此人？
  const amIFollowed = fansList.some(item => {
    return item.userName === myUserName
  })
  // 获取 @ 数量
  const atCountRusult = await getAtMeCount(curUserInfo.id)
  const { count: atCount } = atCountRusult.data

  await ctx.render('profile', {
    blogData: {
      isEmpty,
      blogList,
      pageSize,
      pageIndex,
      count
    },
    userData: {
      userInfo: curUserInfo,
      isMe,
      fansData: {
        list: fansList,
        count: fansCount
      },
      followersData: {
          count: followersCount,
          list: followersList
      },
      amIFollowed,
      atCount
    }
  })
})

// 广场
router.get('/square', loginRedirect, async (ctx, next) => {
  // 获取微博数据，第一页
  const result = await getSquareBlogList(0)
  const { isEmpty, blogList, pageSize, pageIndex, count } = result.data || {}

  
  console.log('pageIndexView', pageIndex)

  await ctx.render('square', {
      blogData: {
          isEmpty,
          blogList,
          pageSize,
          pageIndex,
          count
      }
  })
})

router.get('/at-me', loginRedirect, async(ctx, next)=>{

  const { id: userId } = ctx.session.userInfo

  // 获取 @ 数量
  const atCountRusult = await getAtMeCount(userId)
  const { count: atCount } = atCountRusult.data

  // 获取第一页列表
  const result = await getAtMeBlogList(userId)
  const { isEmpty, blogList, pageSize, pageIndex, count } = result.data 
  
  // 渲染页面
  await ctx.render('atMe', {
    atCount,
    blogData: {
        isEmpty,
        blogList,
        pageSize,
        pageIndex,
        count
    }
  })  

  // 标记为已读
  if (atCount > 0) {
    await markAsRead(userId)
  }

})

module.exports = router