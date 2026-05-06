const path = require('path')
module.exports = {
	apps: [{
			name: 'BASE_BACKUP',
			script: path.join(__dirname, './../BASE/index.js'),
			minUptime: 5 * 1000,
			maxRestarts: 5
		},
		{
			name: 'PROD_BACKUP',
			script: path.join(__dirname, './../PRODUCTION/index.js'),
			minUptime: 5 * 1000,
			maxRestarts: 5
        },
		{
			name: 'WEB_BACKUP',
			script: path.join(__dirname, './../REACT/index.js'),
			minUptime: 5 * 1000,
			maxRestarts: 5
		},
	]
}