/**
 * @description 数据模型入口文件
 */

 const User = require('./User')
 const Blog = require('./Blog')
 const UserRelation = require('./UserRelation')
 const AtRelation = require('./AtRelation')

 //查询微博带出用户
 Blog.belongsTo(User, {
  foreignKey: 'userId'
 })

//  //查询用户带出微博
//  User.hasMany(Blog, {
//    foreignkey: 'userId'
//  })

//foreignKey库中的k拼写成小写导致查询关注人中出错，查到了自己
UserRelation.belongsTo(User, {
  foreignKey: 'followerId'
})

User.hasMany(UserRelation, {
  foreignKey: 'userId'
})



Blog.belongsTo(UserRelation, {
  foreignKey: 'userId',
  targetKey: 'followerId'
})

Blog.hasMany(AtRelation, {
  foreignKey: 'blogId'
})



 module.exports = {
   User,
   Blog,
   UserRelation,
   AtRelation,
 }