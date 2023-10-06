// express 모듈을 로드 
const express = require('express')
// route부분에서는 express 안에 있는 Route()부분만 가져온다. 
const router = express.Router()

// 외부에 파일에서 현재 파일의 기능을 사용 할 수 있도록 설정
module.exports = function(){

    // 기본 경로는 localhost:3000/user

    // api 생성
    // localhost:3000/user/ 요청 시
    router.get('/', function(req, res){
        // res.send('User Module /')
        // user.ejs 파일을 응답
        res.render('user.ejs')
    })

    // localhost:3000/user/signin 요청 시
    router.get('/signin', function(req, res){
        // res.send('User Module /signin')
        // signin.ejs 파일을 응답
        res.render('signin.ejs')
    })

    return router

}