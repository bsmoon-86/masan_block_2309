const express = require('express')

const router = express.Router()

// 외부의 js 파일을 로드 
const sql_list = require('../reference/sql_list')
const sql_class = require("../reference/sql_class")
const class1 = new sql_class.Mysql(
    process.env.host, 
    process.env.port, 
    process.env.user, 
    process.env.db_pass, 
    process.env.db_name
)

module.exports = function(){

    // 해당하는 함수가 실행이 되는 조건은 localhost:3000/user/xxxxxxxx 요청이 들어왔을때만 실행
    
    // 로그인 api 생성(localhost:3000/user [post])
    router.post('/', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 & 확인
        const id = req.body._id
        const pass = req.body._pass
        console.log('url : /user, data : ', id, pass) 
        // 로그인이 성공하는 조건? -> 유저가 입력한 id, pass와 일치하는 데이터가 존재하는 경우
        const result = await class1.execute(
            sql_list.login_query, 
            [id, pass]
        ) 
        console.log('url : /user, SQL data : ', result)
        // 로그인이 성공하는 조건식
        if(result[0]){
            // result = [{}]
            // result[0] : {id : xxxx, password : xxxx, name : xxxx}
            req.session.logined = result[0]
            // 일반 유저인 경우에는 /mileage 주소로 이동
            if (result[0].code == 1){
                res.redirect('/mileage')
            }else{
                res.redirect('/manager')
            }
        }else{
            // 로그인이 실패하는 경우 로그인 화면으로 돌아간다. 
            // url에서 ?가 의미하는 바는? -> ?뒤에는 데이터가 존재합니다라는 의미 (key=value)
            res.redirect('/?msg=fail')
        }
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
        const result = await class1.execute(
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
        // 데이터베이스에 회원의 정보를 등록하는 부분
        const result = await class1.execute(
            sql_list.signup_query, 
            [id, pass, name]
        )
        console.log('url : /signup2, SQL result :', result)
        // 데이터베이스 마일리지 테이블에 데이터를 추가
        const result2 = await class1.execute(
            sql_list.mileage_add_user, 
            [id, 0]
        )
        console.log('url : /signup2, SQL result2 :', result2)

        // 로그인 페이지로 이동
        res.redirect('/')
    })

    return router
}