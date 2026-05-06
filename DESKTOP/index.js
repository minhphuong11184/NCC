require('dotenv').config()
require('dotenv').config({
  path: require('path').join(__dirname, './../.env')
})
const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = 3000

const fs = require('fs');
//const http = require('http');
const https = require('https');

const privateKey = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/private.key','utf8');
const certificate = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/Certificate.cer', 'utf8');
const ca = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/CA_Bundle.cer', 'utf8');

let credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
const app = express()
app.use(history())
app.use(serveStatic(__dirname + '/dist/spa'))
app.get('/ping', function (req, res) {
  res.status(200).send('pong').end()
})
//const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//httpServer.listen(port, () => {
//	console.log('HTTP Server running on port '+port);
//});

app.listen(port, () => {
  console.log('HTTPS Server running on port ' + port);
});
