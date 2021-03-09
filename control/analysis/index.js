const superAgent = require("superagent");
const cheerio = require("cheerio")
const path = require('path')
const md5 = require("md5")
const stream = require('stream')
const fs = require('fs')
async function analysisUrl(ctx) {
    const { url, id } = ctx.request.body;
    let res;
    try {
        res = await superAgent.get(url)
    } catch (error) {
        ctx.response.status == 200
        ctx.response.body = {
            data: null,
            message: 'url无法被抓取,请手动填写相关内容'
        }
        return
    }
    const $ = cheerio.load(res.text);
    let title = $('title').text();
    let icon = ''
    let regexp1 = new RegExp(/\/$/g)
    let regexp2 = new RegExp(/^\//g)
    $('link').each((index, item) => {
        if ($(item).attr('type') === 'image/png') {
            icon = $(item).attr('href');
            if (!icon.includes('http')) {
                if (!url.includes('http')) {
                    let newUrl = getUrl(url);
                    if(regexp1.test(newUrl)){
                        if(regexp2.test(icon)){
                            icon = 'http://' + newUrl + icon.substring(1);
                        }else{
                            icon = 'http://' + newUrl + icon;
                        }
                    }else{
                        if(regexp2.test(icon)){
                            icon = 'http://' + newUrl + icon;
                        }else{
                            icon = 'http://' + newUrl +'/' + icon;
                        }
                    }
                } else {
                    let newUrl = getUrl(url);
                    if(regexp1.test(newUrl)){
                        if(regexp2.test(icon)){
                            icon = newUrl + icon.substring(1);
                        }else{
                            icon = newUrl + icon;
                        }
                    }else{
                        if(regexp2.test(icon)){
                            icon = newUrl + icon;
                        }else{
                            icon = newUrl +'/' + icon;
                        }
                    }
                }
            }
            return false
        }
        if ($(item).attr('href').includes('favicon')&&($(item).attr('href').includes('.ico')||$(item).attr('href').includes('.png'))) {
            icon = $(item).attr('href');
            if (!icon.includes('http')) {
                if (!url.includes('http')) {
                    let newUrl = getUrl(url);
                    if(regexp1.test(newUrl)){
                        if(regexp2.test(icon)){
                            icon = 'http://' + newUrl + icon.substring(1);
                        }else{
                            icon = 'http://' + newUrl + icon;
                        }
                    }else{
                        console.log(url)
                        if(regexp2.test(icon)){
                            icon = 'http://' + newUrl + icon;
                        }else{
                            icon = 'http://' + newUrl +'/' + icon;
                        }
                    }
                } else {
                    let newUrl = getUrl(url);
                    if(regexp1.test(newUrl)){
                        if(regexp2.test(icon)){
                            icon = newUrl + icon.substring(1);
                        }else{
                            icon = newUrl + icon;
                        }
                    }else{
                        if(regexp2.test(icon)){
                            icon = newUrl + icon;
                        }else{
                            icon = newUrl +'/' + icon;
                        }
                    }
                }
            }
            return false
        }
    })
    let rest = icon.match(/.ico$/g);
    if (rest) {
        icon = await changeType(icon, id)
    }
    ctx.response.status == 200
    ctx.response.body = {
        data: {
            title: title,
            icon: icon
        },
        message: '业务处理成功'
    }
}

function getUrl(url) {
    return url.match(/^(?:(?:https?|ftp):\/\/)?(?:[\da-z.-]+)\.(?:[a-z.]{2,6})(?:\/\w\.-]*)*\/?/)
}


async function changeType(url, id) {
    let filePath = path.resolve('staticFile/files')
    let fileName = md5(url)
    if (fs.existsSync(`${filePath}/${id}/${fileName}.png`)) {
        return `/files/${id}/${fileName}.png`
    }
    try {
        let res = await superAgent.get(url)
        await fs.mkdir(`${filePath}/${id}`,()=>{})
        let bufferStream = new stream.PassThrough();
        bufferStream.end(res.body)
        let fileStream = fs.createWriteStream(`${filePath}/${id}/${fileName}.png`);
        bufferStream.pipe(fileStream)
        return `/files/${id}/${fileName}.png`
    } catch (error) {
        throw error
    }

}

// async function checkFile(path){
//     return await fs.existsSync(path)
// }

async function getRest(url) {
    let res;
    try {
        res = await superAgent.get(url)
    } catch (error) {
        console.log('end')
        // console.log(error)
        console.log(error.response.redirects)
        if (error.response && error.response.redirects.length !== 0) {
            res = await getRest(error.response.redirects[0])
        } else {
            ctx.response.status == 200
            ctx.response.body = {
                data: null,
                message: 'url无法访问,请检查url是否正确'
            }
        }

        return res
    }
}
module.exports = { analysisUrl }