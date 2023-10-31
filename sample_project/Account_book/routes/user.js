const express = require('express')
const router = express.Router()

// 외부의 mysql class파일을 로드 
const sql_class = require('../reference/sql_class')
// Mysql이라는 class 생성
const mydb = sql_class.Mysql(
    process.env.host, 
    process.env.port, 
    process.env.user, 
    process.env.db_pass, 
    process.env.db_name
)

module.exports = function(){

    // 기본 경로는? localhost:3000/user

    router.get("/", function(req, res){
        res.render('signin')
    })

    // 로그인 api 생성
    router.post("/signin", async function(req, res){

    })


    // 회원 가입 화면을 보여주는 api
    router.get('/signup', function(req, res){
        res.render('signup')
    })

    // 중복된 아이디인가를 체크하는 비동기 통신 api
    router.get('/check_id', async function(req, res){

    })

    // 회원 가입 데이터를 회수하여 DB에 삽입
    router.post('/signup', async function(req, res){

    })

    return router
}