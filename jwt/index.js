const jwt = require('koa-jwt')

async function errorHandler (ctx,next){
    await next().catch((err) => {
        if(err.status === 401){
            ctx.response.status = 401;
            ctx.response.body = {
                data:null,
                message:'token无效',
            }
        }else{
            console.log(2)
            throw err
        }
    })
}

function jwtTest(){
    return jwt({secret:'newv'}).unless({path:[/^\/api\/login/,/^\/api\/register/,/\/files/]})
}

module.exports = {jwtTest,errorHandler}