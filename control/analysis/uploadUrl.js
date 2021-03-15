const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const mongoose = require('../../mongoose/index')
const navgatorShema = mongoose.Schema({
    url: String,
    title: String,
    imgUrl: String,
    order: Number,
})
async function postUrl(ctx) {
    const { id, url, title, icon } = ctx.request.query;
    if (!icon) {
        const file = ctx.request.files ? ctx.request.files.file : '';
        if (file) {
            fileUrl = await saveImage(file, id, url);
        } else {
            fileUrl = '';
        }
    } else {
        fileUrl = icon;
    }
    const Navgator = mongoose.model(id, navgatorShema);
    let urlList = await Navgator.find({ 'url': url }, (err, navgators) => {
        if (err) { return console.error(err) }
    })
    if (urlList.length && urlList.length !== 0) {
        if (urlList[0].url === url) {
            ctx.response.status = 200
            ctx.response.body = {
                data: null,
                message: '当前链接已存在'
            }
        }
    } else {
        let sumListNumber
        try {
            await Navgator.find((err, navgators) => {
                if (err) throw err;
                sumListNumber = navgators.length;
            })
        } catch (error) {
            throw error
        }
        let rest = new Navgator({ url: url, title: title, imgUrl: fileUrl, order: sumListNumber + 1 });
        await rest.save((err) => {
            if (err) throw err;
        })
        ctx.response.status = 200
        ctx.response.body = {
            data: 'success',
            message: '链接添加成功'
        }
    }
}


async function saveImage(file, user_number, url) {
    let type = file.name.substring(file.name.lastIndexOf('.'));
    const reader = fs.createReadStream(file.path);
    const filePath = path.resolve('staticFile/files')
    const upStream = fs.createWriteStream(`${filePath}/${user_number}/${md5(file.name + url)}${type}`);
    reader.pipe(upStream);
    await reader.on('end', () => {
        console.log('写入完成')
    })
    return `/files/${user_number}/${md5(file.name + url)}${type}`
}

async function getUrlList(ctx) {
    const { id, page, size } = ctx.request.body
    const Navgator = mongoose.model(id, navgatorShema);
    let urlList = [];
    let total = 0;
    try {
        urlList = await Navgator.find({}, null, { limit: size, skip: page * size }, (err, navgators) => {
            if (err) { return console.error(err) }
        })
    } catch (error) {
        throw error
    }
    try {
        total = await Navgator.countDocuments({}, (err, count) => {
            if (err) { return console.error(err) }
        })
    } catch (error) {
        throw error
    }
    ctx.response.status = 200;
    ctx.response.body = {
        total: total,
        data: urlList,
        message: '业务处理成功'
    }
}
async function deleteUrl(ctx) {
    const { id, urlId } = ctx.request.body;
    const Navgator = mongoose.model(id, navgatorShema);
    try {
        let res = await Navgator.findOne({ _id: urlId })
        await deleteImage(res.imgUrl)
    } catch (error) {
        throw error
    }
    try {
        let res = await Navgator.deleteOne({ _id: urlId })
    } catch (error) {
        throw error
    }
    ctx.response.status = 200;
    ctx.response.body = {
        data: 'success',
        message: '删除成功'
    }
}

async function deleteImage(url) {
    let regExp = new RegExp(/^\/files/);
    if (regExp.test(url)) {
        url = `staticFile`+url
        if (fs.existsSync(url)) {
            try {
                await fs.unlinkSync(url, () => {
                 })
            } catch (error) {
                throw error
            }
        }
    }
}

async function updateUrl(ctx) {
    const { id, urlId, title, icon, url } = ctx.request.body;
    const file = ctx.request.files ? ctx.request.files.file : '';
    let fileUrl, deleteFlag;
    if (file) {
        fileUrl = await saveImage(file, id, url);
        deleteFlag = true;
    } else {
        fileUrl = icon
    }
    const Navgator = mongoose.model(id, navgatorShema);
    let res;
    try {
        res = await Navgator.findOne({ _id: urlId })
    } catch (error) {
        throw error
    }
    if (deleteFlag) {
        let regexp2 = new RegExp(/^\//)
        let flag = regexp2.test(res.imgUrl);
        if(flag){
            await deleteImage(res.imgUrl)
        }
        
    }
    await Navgator.updateOne({_id: urlId},{ url: url, title: title, imgUrl: fileUrl, order: res.order },(err,docx) => {
        if(err){
            console.log(err)
        }
    })
    ctx.response.status = 200
    ctx.response.body = {
        data: 'success',
        message: '链接修改成功'
    }
}


module.exports = { postUrl, getUrlList, deleteUrl, updateUrl }