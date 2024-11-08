/**
 * @description at model
 * @author chendong
 */

const seq = require('../seq')
const { INTEGER, BOOLEAN } = require('../type')

const AtRelation = seq.define('atRelation', {
  userId: {
      type: INTEGER,
      allowNull: false,
      comment: '用户 Id'
  },
  blogId: {
      type: INTEGER,
      allowNull: false,
      comment: '微博 Id'
  },
  isRead: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false, // 默认未读
      comment: '是否已读'
  }
})

module.exports = AtRelation