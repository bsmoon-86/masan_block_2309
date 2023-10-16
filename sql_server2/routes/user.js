const express = require('express')

const router = express.Router()

// 외부의 js 파일을 로드 
const sql_list = require("../reference/sql_list")
const sql_func = require("../reference/sql_function")

module.exports = function(){
    // 기본경로가 localhost:3000/user

    // localhost:3000/user 주소로 요청시
    router.get("/", function(req, res){
        res.render('login')
    })
    
    // localhost:3000/check_id 주소로 요청시
    router.get('/check_id', function(req, res){
        // req.query.msg 데이터가 존재하는가?
        if(req.query.msg){
            msg = req.query.msg
        }else{
            msg = ""
        }
        res.render('check_id', {
            data : msg
        })
    })

    // params : url/:id
    // query : url?key=value
    // body : post 방식으로 데이터를 숨겨서 보내는 경우

    // localhost:3000/check_id2 주소로 요청시
    router.get('/check_id2', async function(req, res){
        // 사용가능한 아이디인지 확인하려면?
        // 유저가 입력한 아이디가 mysql Database에 존재하지 않는다면
        // 해당하는 쿼리문은 sql_list안에 check_id_query 변수에 지정
        // sql쿼리문을 실행하는 함수는 sql_func안에 있는 execute()함수
        // 유저가 보낸 id 값을 쿼리문과 함께 실행
        const id = req.query._id
        // 유저가 입력한 아이디의 길이가 4글자보다 작다면
        if (id.length < 4){
            res.redirect('/user/check_id?msg=아이디글자수부족')
        }else{
            const result = await sql_func.execute(sql_list.check_id_query, [id])
            console.log(id, result)
            // 사용 가능한 아이디인가? -> result 안에 데이터가 존재하지 않아야 한다. 
            if(!result[0]){
                res.redirect('/user/signup?_id='+id)
            }else{
                res.redirect('/user/check_id?msg=사용불가능한아이디')
            }
        }
    })

    // localhost:3000/user/signup 주소로 요청시 
    // 회원 가입 화면 보여준다. 
    router.get('/signup', function(req, res){
        const id = req.query._id
        res.render('signup', {
            id : id
        })
    })

    // localhost:3000/user/signup2 [post] 주소로 요청시
    router.post('/signup2', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 & 확인
        const id = req.body._id
        const password = req.body._pass
        const name = req.body._name
        console.log(id, password, name)
        // sql 쿼리문을 이용하여 데이터를 삽입
        // sql_list안에 있는 signup_query를 불러와서 쿼리문을 유저가 보낸 데이터와 함께 실행
        const result = await sql_func.execute(
            sql_list.signup_query, 
            [id, password, name]
        )
        console.log(result)
        // 회원 가입이 완료되면 로그인 페이지로 이동
        res.redirect('/user')
    })


    return router
}