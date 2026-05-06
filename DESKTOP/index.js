require('dotenv').config()
require('dotenv').config({
  path: require('path').join(__dirname, './../.env')
})
const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = parseInt(process.env.DESKTOP_PORT) || 3000,
  httpsPort = parseInt(process.env.DESKTOP_HTTPS_PORT) || 3443

const fs = require('fs')
const path = require('path')
const https = require('https')

const app = express()
app.use(history())
app.use(serveStatic(path.join(__dirname, 'dist/spa')))
app.get('/ping', (req, res) => res.status(200).send('pong').end())

// HTTP luôn chạy
app.listen(port, () => {
  console.log('HTTP Server running on port ' + port)
})

// HTTPS chỉ chạy nếu có đủ cert (đường dẫn đọc từ env, fallback path mặc định)
const certDir = process.env.SSL_CERT_DIR || 'C:/Program Files/OpenSSL-Win64/bin'
const keyFile = path.join(certDir, 'private.key')
const crtFile = path.join(certDir, 'Certificate.cer')
const caFile  = path.join(certDir, 'CA_Bundle.cer')

if (fs.existsSync(keyFile) && fs.existsSync(crtFile) && fs.existsSync(caFile)) {
  try {
    const credentials = {
      key:  fs.readFileSync(keyFile, 'utf8'),
      cert: fs.readFileSync(crtFile, 'utf8'),
      ca:   fs.readFileSync(caFile, 'utf8'),
    }
    https.createServer(credentials, app).listen(httpsPort, () => {
      console.log('HTTPS Server running on port ' + httpsPort)
    })
  } catch (err) {
    console.warn('[HTTPS skipped] Lỗi đọc cert:', err.message)
  }
} else {
  console.warn('[HTTPS skipped] Thiếu cert ở ' + certDir + ' — chỉ chạy HTTP port ' + port)
}
