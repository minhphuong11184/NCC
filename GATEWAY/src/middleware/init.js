module.exports = function (req,res,next){
    req.eventTime = new Date()
    req.timestamp = req.eventTime
    next()
}