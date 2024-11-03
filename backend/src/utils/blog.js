/**
 * @description 微博数据相关方法
 * @author chendong
 */

 const fs = require('fs')
 const path = require('path')
 const ejs = require('ejs')

 const BLOG_LIST_TPL = fs.readFileSync(
   path.join(__dirname, '..', 'views', 'widgets', 'blog-list.ejs')
 ).toString()

 /**
 * 根据 blogList 渲染出 html 字符串
 * @param {Array} blogList 微博列表
 * @param {boolean} canReply 是否可以回复
 */
 function getBlogListStr(blogList = [], canReply = false){
   return ejs.render(BLOG_LIST_TPL, {
     blogList,
     canReply
   })
 }

 module.exports = {
   getBlogListStr,
 }