const jwt = require('jsonwebtoken')
const secret = 'newv'
const get_token = (info) => {
    return jwt.sign({
        user_number: info.user_number,
        id: info._id,
    }, secret, { expiresIn: '24h' })
}

const mongoose = require('../../mongoose/index')
const userShema = mongoose.Schema({
    user_number: String,
    password: String,
    user_phone: String,
    user_name: String,
    user_sex: String,
    user_email: String,
})
const UserTable = mongoose.model('UserTable', userShema)


async function login(ctx) {
    const { unumber, pwd } = ctx.request.body
    let userData = await UserTable.find({ 'user_number': unumber }, (err, userTable) => {
        if (err) { return console.error(err) }
    })
    if (userData.length && userData.length !== 0) {
        if (userData[0].password === pwd) {
            ctx.response.status = 200
            ctx.response.body = {
                token: get_token(userData[0]),
                userMessage:{
                    _id:userData[0]._id,
                    user_number:userData[0].user_number,
                    user_name:userData[0].user_name,
                },
                message: '登陆成功'
            }
        } else {
            ctx.response.status = 200
            ctx.response.body = {
                data: null,
                message: '密码错误'
            }
        }
    } else {
        ctx.response.status = 200
        ctx.response.body = {
            data: null,
            message: '该用户不存在'
        }
    }
}

async function register(ctx) {
    const { uname, unumber, email, sex, phone, pwd } = ctx.request.body
    let userData = await UserTable.find({ 'user_number': unumber }, (err, userTable) => {
        if (err) { throw err }
    })
    if (userData.length && userData.length != 0) {
        ctx.status = 200
        ctx.body = {
            data: null,
            message: '该用户已存在'
        }
    } else {
        let newUser
        try {
            newUser = new UserTable({ user_number: unumber, password: pwd, user_phone: phone, user_name: uname, user_sex: sex, user_email: email })
        } catch (error) {
            console.log('error')
        }
        await newUser.save((err) => {
            if (err) { return console.error(err) }
        })
        ctx.response.status = 200;
        ctx.response.body = {
            token: get_token(newUser),
            userMessage:{
                _id:newUser._id,
                user_number:newUser.user_number,
                user_name:newUser.user_name,
            },
            message: '注册成功'
        }

    }
}
module.exports = {
    login,
    register
}