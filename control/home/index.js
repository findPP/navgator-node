const mongoose = require('../../mongoose/index')
const categoryShema = mongoose.Schema({
    catNameArrInfo:[
        {
            item_config_id:String,
            cat_config_id:String,
            cat_name:String
        }
    ],
    catName:String,
})
let godsList = mongoose.model('GodsList',categoryShema)

async function getgodslist(ctx){
    let categ = await godsList.find({catName:'小心意'},(err,categ) =>{
        if(err){
            throw err
        }
        console.log(categ)
    })
    ctx.response.status == 200
    ctx.response.body = {
        data:categ,
        message:'业务处理成功'
    }
}

module.exports = {getgodslist}