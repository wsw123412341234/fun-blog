/**
 * @description 连接 redis 的方法 get set
 */

 const redis = require('redis')
// const { json } = require('sequelize/types')
 const {REDIS_CONF} = require('../conf/db')

 //创建客户端
 const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
 redisClient.on('error', err=>{
   console.error('redis err', err)
 })

/**
 * redis set
 * @param {string} key
 * @param {string} val
 * @param {number} timeOut
 */

 function set(key, val, timeOut=60*60){
  if(typeof val == 'object'){
    val = JSON.stringify(val)
  }
  redisClient.set(key, val)
  redisClient.expire(key, timeOut)
 }

 /**
  * redis get
  * @param {string} key
  */

  function get(key){
    const promise = new Promise((resolve, reject) => {
      redisClient.get(key, (err, val)=>{
        if(err){
          reject(err)
          return
        }
        if(val == null){
          resolve(null)
          return
        }
        
        try{
          resolve(JSON.parse(val))
        }catch(ex){
          resolve(val)
        }
      })
    })

    return promise
  }

  module.exports = {
    set,
    get
  }