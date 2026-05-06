module.exports = function(req,res,next){
    let start = new Date()
    let url = req._parsedUrl.pathname
    res.on('finish', ()=>{
        console.log(`${require('./../core/config').date.now().slice(0,19)} | ${req.headers['x-gateway-request-no'] || 0} | ${req.method.padEnd(4)} : ${url.padEnd(20)} ${res.statusCode} ${Date.now() - start}ms`)
    })
    next()
}