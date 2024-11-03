const Sequelize = require('sequelize')

const conf = {
  host: 'localhost',
  dialect: 'mysql'
}

const seq = new Sequelize('funBlog', 'root', '123456', conf)

module.exports = seq