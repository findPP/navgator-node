const { Query } = require("mongoose")

async function readFile(ctx){
    console.log(ctx.request.query)
}

module.exports = {
    readFile
}