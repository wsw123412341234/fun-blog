/**
 * 
 * @description utils controller
 */
const path = require('path')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { uploadFileSizeFailInfo } = require('../model/ErrorInfo')
const fse = require('fs-extra')

// 文件最大体积 1M
const MAX_SIZE = 1024*1024*1024
// 存储目录
const DIST_FOLDER_PATH = path.join(__dirname, '..', '..', 'uploadFiles')

/**
 * 保存文件
 * @param {string} name 文件名 
 * @param {string} type 文件类型 
 * @param {number} size 文件体积大小 
 * @param {string} filePath 文件路径 
 */

async function saveFile({ name, type, size, filePath }){
  if(size > MAX_SIZE) {
    await fse.remove(filePath)
    return new ErrorModel(uploadFileSizeFailInfo)
  }

  //移动文件
  const fileName = Date.now() + '.' + name // 防止重名
  const distFilePath = path.join(DIST_FOLDER_PATH, fileName)
  await fse.move(filePath, distFilePath)

  // 返回信息
  return new SuccessModel({
    url: '/' + fileName
  })
}

module.exports = {
  saveFile
}