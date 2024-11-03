/**
 * @description blog 数据校验
 */

const validate = require('./_validate')

const SCHEMA = {
  type: 'object',
  properties: {
    content: {
      type: 'string'
    },
    image: {
      maxLength: 255
    }
  }
}

/**
 * 校验用户数据格式
 * @param {Object} data 用户数据
 */
// 执行校验
function blogValidate(data = {}) {
  return validate(SCHEMA, data)
}

module.exports = blogValidate