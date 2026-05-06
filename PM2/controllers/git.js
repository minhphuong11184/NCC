const express = require('express')
const git = express.Router()
const simpleGit = require('simple-git')() //path.join(__dirname, './..')

git.use('/pull', (req,res,next)=>{
    const USER = process.env.GIT_USER
    const PASS = process.env.GIT_PASS
    const REPO = process.env.GIT_REPO
    const remote = `https://${USER}:${PASS}@${REPO}`

    simpleGit
    .exec(()=>{
        //console.log('Bắt đầu pull ...')
    })
    .pull(remote, 'master', (err,update)=>{
        if(err){
            //console.log('Pull không thành công!!!')
            return res.api.sendData(err)
        }
    })
    .exec(()=>{
        //console.log('Pull done')
        res.api.sendData('pull done')
    })
})

module.exports = git

