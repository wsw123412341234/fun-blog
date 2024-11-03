/**
 * @description Blog model
 * @author chendong
 */

const seq = require('../seq')
const { INTEGER, STRING, TEXT } = require('../type')

const Blog = seq.define('blog', {
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '用户ID'
  },
  content: {
    type: TEXT,
    allowNull: false,
    comment: '微博内容'
  },
  image: {
    type: STRING,
    comment: '图片'
  }
})

module.exports = Blog
