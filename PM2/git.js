const gitPath = "C:\\Program Files\\Git\\cmd"
const path = require('path')
const {
	date
} = require('./core/config')
const fs = require('fs')

module.exports = function () {
	const info = []

	return {
		getInfo() {
			return [...info]
		},
		pull(req) {
			const id = date.now()
			setTimeout(()=>{
				fs.appendFile(`${process.env.DIR_PUBLIC}/git.log`, `${JSON.stringify({
					id,
					date: id,
					message: req.body.head_commit.message,
					committer: req.body.head_commit.committer.username,
					timestamp: req.body.head_commit.timestamp,
				})}\r\n`, (err) => {
					if (err)
						console.log(err)
					else
						console.log('save file done!')
				})
			}, 10000)

			info.push({
				id,
				date: date.now(),
				package: req.body,
				out: null,
				err: null,
				exit: null
			})

			process.env.PATH = gitPath
			const {
				spawn
			} = require('child_process');
			const bat = spawn('git', ['pull'], {
				cwd: path.join(__dirname, './..'),
				env: process.env
			})

			bat.stdout.on('data', (data) => {
				console.log(date.now(),':',data.toString())
				info.find(i => i.id == id).out = data.toString()		
			});

			bat.stderr.on('data', (data) => {
				console.log(date.now(),':',data.toString())
				info.find(i => i.id == id).out = data.toString()
			});

			bat.on('exit', (code) => {
				console.log(date.now(),':',code.toString())
				info.find(i => i.id == id).out = `Child exited with code ${code}`
			});
		}
	}
}