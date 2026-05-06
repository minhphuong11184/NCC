# PRODUCTION service (TanTrao2026)

Service chứa nghiệp vụ sản xuất. Mặc định chạy trên **port 222**.

## Cấu trúc

```
PRODUCTION/
├── index.js                    # entry point
├── package.json
└── src/
    ├── core/
    │   ├── config.js           # đọc ENV + merge với config/global.js
    │   └── verify.js           # middleware xác thực JWT
    ├── data/
    │   └── connect.js          # kết nối SQL Server (mssql + sequelize)
    ├── middleware/
    │   └── app.js              # express app (CORS, body-parser, api-formatter, routes)
    ├── controllers/
    │   └── router.js           # gắn verify + api
    └── api/
        ├── api.js              # đăng ký các route nghiệp vụ
        └── hello.js            # endpoint mẫu GET /api/v1/hello
```

## Thêm một nghiệp vụ mới

Ví dụ thêm route `/san-luong`:

1. Tạo file `src/api/san-luong.js`:
```js
const express = require('express')
const r = express.Router()

r.get('/', (req, res) => {
    // req.token.accountId có sẵn (đã verify JWT)
    req.input('NGAY', req.query.ngay).execute('[prod].[SP_BC_SAN_LUONG]')
})

r.post('/', (req, res) => {
    req.input('DATA', JSON.stringify(req.body)).execute('[prod].[SP_GHI_SAN_LUONG]')
})

module.exports = r
```

2. Đăng ký trong `src/api/api.js`:
```js
api.use('/san-luong', require('./san-luong'))
```

3. Thêm route vào GATEWAY: mở `GATEWAY/conf.yaml`, thêm vào mục `routers`:
```yaml
  - path: /san-luong
    endPoint: prod
```

4. Gọi từ DESKTOP qua GATEWAY:
```
GET  http://localhost:2003/api/v1/san-luong?token=<JWT>&ngay=2026-04-13
POST http://localhost:2003/api/v1/san-luong
```

## Khởi động

```cmd
cd C:\TanTrao\PRODUCTION
npm install
npm start
```

## Test nhanh

1. Lấy token từ BASE login:
```
POST http://127.0.0.1:221/api/v1/login  { "account": "admin", "password": "admin" }
```

2. Gọi endpoint mẫu:
```
GET http://127.0.0.1:222/api/v1/hello?token=<JWT>
```
