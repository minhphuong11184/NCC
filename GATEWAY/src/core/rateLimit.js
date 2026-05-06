const rateLimit = require("express-rate-limit")

module.exports = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10000, // limit each IP to 10000 requests per windowMs
    message: {
        "meta": {
            "success": false,
            "messages": {
                "code": 429,
                "message": 'Request đạt tới giới hạn'
            },
            "status": 200,
            "name": "Woodsland Restful API",
            "version": "v1"
        },
        "data": []
    }
})