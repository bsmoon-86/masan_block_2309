const express = require('express')

const router = express.Router()

module.exports = function(){
    // 기본경로가 localhost:3000/user

    // localhost:3000/user 주소로 요청시
    router.get("/", function(req, res){
        res.render('login')
    })

    // localhost:3000/user/signup 주소로 요청시 
    // 회원 가입 화면 보여준다. 
    router.get('/signup', function(req, res){
        res.render('signup')
    })


    return router
}