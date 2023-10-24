const express = require('express')

const router = express.Router()

// 외부의 js 파일을 로드 
const sql_list = require('../reference/sql_list')
const sql_func = require("../reference/sql_function")

module.exports = function(){

    // 해당하는 함수가 실행이 되는 조건은 localhost:3000/user/xxxxxxxx 요청이 들어왔을때만 실행
    
    // 로그인 api 생성(localhost:3000/user [post])
    router.post('/', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 & 확인 
    })


    // 회원 가입 페이지를 보여주는 api (localhost:3000/user/signup)
    router.get('/signup', function(req, res){
        res.render('signup')
    })

    // 사용 가능한 아이디인가 체크하는 비동기 통신 api 생성 
    router.post('/check_id', async function(req, res){
        // 유저가 보낸 아이디 값을 변수에 대입 확인
        const id = req.body._id
        console.log(id)
        const [result, field] = await sql_func(
            sql_list.info_query, 
            [id]
        )
        let check;
        console.log(result)
        // result의 데이터의 형태는 [{회원 정보}]
        // 사용 가능한 아이디인 조건은? result가 []
        if(!result[0]){
            check = true
        }else{
            check = false
        }
        res.json({
            'data' : check
        })

    })

    // 회원 정보를 받아오는 api 생성 (localhost:3000/user/signup2 [post])
    router.post('/signup2', async function(req, res){
        const id = req.body._id
        const pass = req.body._pass
        const name = req.body._name
        console.log('url:/signup2, method:post, data :',id, pass, name)
        const [result, field] = await sql_func(
            sql_list.signup_query, 
            [id, pass, name]
        )
        console.log('url : /signup2, SQL result :', result)
        // 로그인 페이지로 이동
        res.redirect('/')
    })

    return router
}