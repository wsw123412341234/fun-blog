const Blog = require('../db/model/Blog')
const User = require('../db/model/User')
const UserRelation = require('../db/model/UserRelation')

const { formatUser, formatBlog } = require('./_format')

/**
 * 创建微博
 * @param {Object} param0 创建微博的数据 { userId, content, image }
 */
async function createBlog({ userId, content, image }){
  const result = await Blog.create({
    userId,
    content,
    image
  })

  return result.dataValues
}

 /**
 * 获取个人主页微博列表
 * @param {string} userName 用户名
 * @param {number} pageIndex 当前页面
 */
async function getBlogListByUser(
  { userName, pageIndex = 0, pageSize = 10 }
){
  const whereOpt = {

  }
  if(userName){
    whereOpt.userName = userName
  }

  const result = await Blog.findAndCountAll({
    limit: pageSize, //每页条数
    offset: pageSize * pageIndex, // 跳过多少条
    order: [
      ['id', 'desc']
    ],
    // 联表查询
    include: [
      {
        model: User,
        attributes: ['userName', 'nickName', 'picture'],
        where: whereOpt
      }
    ],
  })

  let blogList = result.rows.map(row => row.dataValues)

  blogList = formatBlog(blogList)
  blogList = blogList.map(blogItem => {
    const user = blogItem.user.dataValues
    blogItem.user = formatUser(user)

    return blogItem
  })

  return {
    count: result.count,
    blogList
  }
}

/**
 * 获取关注着的微博列表（首页）
 * @param {Object} param0 查询条件 { userId, pageIndex = 0, pageSize = 10 }
 */
async function getFollowersBlogList({ userId, pageIndex = 0, pageSize = 10 }) {
  const result = await Blog.findAndCountAll({
      limit: pageSize, // 每页多少条
      offset: pageSize * pageIndex, // 跳过多少条
      order: [
          ['id', 'desc']
      ],
      include: [
          {
              model: User,
              attributes: ['userName', 'nickName', 'picture']
          },
          {
              model: UserRelation,
              attributes: ['userId', 'followerId'],
              where: { userId }
          }
      ]
  })

  // 格式化数据
  let blogList = result.rows.map(row => row.dataValues)
  blogList = formatBlog(blogList)
  blogList = blogList.map(blogItem => {
      blogItem.user = formatUser(blogItem.user.dataValues)
      return blogItem
  })

  return {
      count: result.count,
      blogList
  }
}

module.exports = {
  createBlog,
  getBlogListByUser,
  getFollowersBlogList,
}