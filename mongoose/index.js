const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/usertable",{ useNewUrlParser: true,useUnifiedTopology:true, keepAlive: true})
let db = mongoose.connection
db.on('error',()=>{console.log('连接mongodb失败')})
db.once('open',()=>{console.log('连接mongodb成功')})

module.exports = mongoose
