const { login, register } = require('./login')
const { analysisUrl } = require('./analysis/index.js')
const { postUrl,getUrlList,deleteUrl,updateUrl } = require('./analysis/uploadUrl.js')
const { getgodslist } = require('./home')
const { readFile } = require('./file')
const { uploadFiles, uploadSliceFile, mergeFile } = require('./uploadFile/uploadFile')
module.exports = {
    login, 
    register,
    getgodslist, 
    uploadFiles, 
    uploadSliceFile, 
    mergeFile, 
    analysisUrl, 
    postUrl,
    getUrlList,
    deleteUrl,
    readFile,
    updateUrl
}