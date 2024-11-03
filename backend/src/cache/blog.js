/**
 * @description 广场缓存
 * @author chendong
 */

 const { get, set } = require('./_redis')
 const { getBlogListByUser } = require('../services/blog')

 // redis key 前缀
 const KEY_PREFIX = 'weibo:square:'

 async function getSquareCacheList(pageIndex, pageSize){
  const key = `${KEY_PREFIX}${pageIndex}_${pageSize}`
  // 尝试获取缓存
  const cacheResult = await get(key)

  if(cacheResult){
    return cacheResult
  }

  // 没有缓存，则读取数据库
  const result = await getBlogListByUser({ pageIndex, pageSize })

  // 设置缓存，过期时间 1min
  set(key, result, 60)

  return result
 }

 module.exports = {
  getSquareCacheList
 }