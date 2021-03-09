const path = require('path');
const fs = require('fs');
let tempChunk = [];

async function uploadFiles(ctx) {
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    const filePath = path.resolve('files')
    const upStream = fs.createWriteStream(`${filePath}/${file.name}`);
    reader.pipe(upStream);
    await reader.on('end', () => {
        console.log('写入完成')
    })
    return ctx.body = {
        code: 200,
        isSuccess: true,
    }
}
function createFileChunk(name) {
    if (name) {
        let temp = name.split('|');
        return { name: temp[0], index: parseInt(temp[1]) }
    }
}
//切片上传
async function uploadSliceFile(ctx) {
    let { name, index } = createFileChunk(ctx.request.files.file.name);
    tempChunk.push({ file: ctx.request.files.file, name, index })
    if(ctx.request.files.file){
        ctx.body = {
            code: 200,
            isSuccess: true,
        }
    }else{
        ctx.response.status = 404
        ctx.body = {
            error: 'file is not find',
        }
    }
   
}
//合并文件
async function mergeFile(ctx) {
    console.log('切片传输完成')
    for (let i = 0; i < tempChunk.length - 1; i++) {
        for (let j = 0; j < tempChunk.length - i - 1; j++) {
            if (tempChunk[j].index > tempChunk[j + 1].index) {
                let temp = tempChunk[j];
                tempChunk[j] = tempChunk[j + 1];
                tempChunk[j + 1] = temp;
            }
        }
    }
    await writeFileSlice(0)
    ctx.body = {
        code: 200,
        isSuccess: true,
    }
}

async function writeFileSlice(index) {
    if(index === tempChunk.length){
        tempChunk = []
        return
    }
    const reader = fs.createReadStream(tempChunk[index].file.path);
    const filePath = path.resolve('files')
    const upStream = fs.createWriteStream(`${filePath}/${tempChunk[index].name}`,{flags:'a'});
    reader.pipe(upStream);
    await reader.on('end', () => {
        console.log(`写入完成---${index}`)
        index += 1;
        writeFileSlice(index)
    })
}

module.exports = { uploadFiles, uploadSliceFile, mergeFile }