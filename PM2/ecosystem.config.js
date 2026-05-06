const path = require('path')
module.exports = {
    apps: [{
            name: 'P.BASE',
            script: path.join(__dirname, './../BASE/index.js'),
            minUptime: 5 * 1000,
            maxRestarts: 5
        },
        {
            name: 'P.PROD',
            script: path.join(__dirname, './../PRODUCTION/index.js'),
            minUptime: 5 * 1000,
            maxRestarts: 5
        },
        {
            name: 'P.RENDER',
            script: path.join(__dirname, './../RENDER/index.js'),
            minUptime: 5 * 1000,
            maxRestarts: 5
        },
        {
            name: 'P.E-OFFICE',
            script: path.join(__dirname, './../E-Office/index.js'),
            minUptime: 5 * 1000,
            maxRestarts: 5
        },
        {
            name: 'P.FDB',
            script: path.join(__dirname, './../FDB/index.js'),
            minUptime: 5 * 1000,
            maxRestarts: 5
        },
        {
            name: 'P.HRM',
            script: path.join(__dirname, './../HRM/index.js'),
            minUptime: 5 * 1000,
            maxRestarts: 5
        },
        //{
        //	name: 'P.HR',
        //	script: path.join(__dirname, './../HR/index.js'),
        //	minUptime: 5 * 1000,
        //	maxRestarts: 5
        //},
        // {
        // 	name: 'SERVE_1',
        // 	script: path.join(__dirname, './../SERVE/index.js'),
        // 	args: `${process.env.DIR_PM2_LOG} -l 231`,
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // },
        // {
        // 	name: 'SERVE_2',
        // 	script: path.join(__dirname, './../SERVE/index.js'),
        // 	args: `${process.env.DIR_WMS_LOG} -l 232`,
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // },
        {
            name: 'P.MOBILE',
            script: path.join(__dirname, './../MOBILE/index.js'),
        },
        {
            name: 'P.WEB',
            script: path.join(__dirname, './../DESKTOP/index.js'),
            minUptime: 5 * 1000,
            maxRestarts: 5
        },
        {
            name: 'P.NLG',
            script: path.join(__dirname, './../NLG/index.js'),
            minUptime: 5 * 1000,
            maxRestarts: 5
        }
        // {
        // 	name: 'P.WOOD',
        // 	script: path.join(__dirname, './../WOOD/index.js'),
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // }, // Mang van
        // {
        // 	name: 'V.BASE',
        // 	script: path.join(__dirname, './../../VCN/BASE/index.js'),
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // },
        // {
        // 	name: 'V.PROD',
        // 	script: path.join(__dirname, './../../VCN/PRODUCTION/index.js'),
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // }, 
        // {
        // 	name: 'V.RENDER',
        // 	script: path.join(__dirname, './../../VCN/RENDER/index.js'),
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // },
        // {
        // 	name: 'VCN.HR',
        // 	script: path.join(__dirname, './../HR/index.js'),
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // },
        // {
        // 	name: 'SERVE_1',
        // 	script: path.join(__dirname, './../SERVE/index.js'),
        // 	args: `${process.env.DIR_PM2_LOG} -l 231`,
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // },
        // {
        // 	name: 'SERVE_2',
        // 	script: path.join(__dirname, './../SERVE/index.js'),
        // 	args: `${process.env.DIR_WMS_LOG} -l 232`,
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // },
        // {
        // 	name: 'V.MOBILE',
        // 	script: path.join(__dirname, './../../VCN/MOBILE/index.js'),
        // },
        // {
        // 	name: 'V.WEB',
        // 	script: path.join(__dirname, './../../VCN/REACT/index.js'),
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // },
        // {
        // 	name: 'V.WOOD',
        // 	script: path.join(__dirname, './../../VCN/WOOD/index.js'),
        // 	minUptime: 5 * 1000,
        // 	maxRestarts: 5
        // },
    ]
}