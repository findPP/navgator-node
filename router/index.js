const koaRouter = require('koa-router')()
const control = require('../control/index')

//登录
koaRouter.post('/api/login',control.login)
//注册
koaRouter.post('/api/register',control.register)
//获取商品列表
koaRouter.get('/api/godsList',control.getgodslist)
//上传文件
koaRouter.post('/api/upload',control.uploadFiles)
//合并切片
koaRouter.get('/api/mergeFile',control.mergeFile)
//上传切片
koaRouter.post('/api/uploadSliceFile',control.uploadSliceFile)
//分析url
koaRouter.post('/api/analysisUrl',control.analysisUrl)
//上传url
koaRouter.post('/api/postUrl',control.postUrl)
//获取url分页
koaRouter.post('/api/getUrlList',control.getUrlList)
//删除url
koaRouter.post('/api/deleteUrl',control.deleteUrl)
//更新url
koaRouter.post('/api/updateUrl',control.updateUrl)
module.exports = koaRouter