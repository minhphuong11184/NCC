module.exports = function(req,res,next){ // 1 bỏ set time out vì 1 số api cần thời gian chờ
    // res.setTimeout(require('../core/config').request.timeout, () => {
    //     res.api.sendFail(require('../core/config').getErrorMessage('ETIMEOUT'))
    // })
    next()
}