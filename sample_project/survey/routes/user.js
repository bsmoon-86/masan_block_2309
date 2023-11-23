const express = require('express')
const router = express.Router()

// 외부의 module을 로드 
const sql_class = require('../reference/sql_class')
const kip7 = require('../reference/kip7')


// Mysql Class 생성 
const mydb = new sql_class.Mysql(
    process.env.host, 
    process.env.port, 
    process.env.user, 
    process.env.db_pass, 
    process.env.db_name
)

module.exports = function(){

    // localhost:3000/user 기본 경로

    // 로그인 api -> 유저가 보낸 id와 password을 가지고 DB와 비교
    router.post('/', async function(req, res){
        const id = req.body._id
        const pass = req.body._pass
        console.log('/user : post data = ', id, pass)
        // sql 쿼리문 작성
        const sql = `
            select 
            * 
            from 
            survey_user
            where 
            id = ? and password = ?
        `
        const values = [id, pass]
        console.log("sql : ", sql)
        console.log("values's type :", typeof(values))
        // 데이터베이스의 결과를 변수에 대입 
        const sql_result = await mydb.execute(
            sql, values
        )
        // sql_result의 데이터 타입? 
        //  [ { } ] : 데이터가 존재하는 경우 (로그인이 성공)
        // [ ] : 데이터가 존재하지 않는 경우 (로그인 실패)
        // 로그인 성공하는 조건식 
        if (sql_result.length != 0){
            // session에 로그인을 한 유저의 정보를 저장 
            req.session.logined = sql_result[0]
        }
        // 메인 주소('/')로 이동
        res.redirect('/')
    })

    // 회원 가입 화면 api 
    router.get('/signup', function(req, res){
        // session.logined가 존재하면 메인으로 이동 
        // if문에서 조건식이 bool의 형태가 아니면 
        // 데이터가 존재하면 True 변환
        // 데이터가 존재하지 않으면 False 변환
        if(req.session.logined){
            res.redirect('/')
        }else{
            res.render('signup', {
                'login' : false, 
                'name' : ''
            })
        }
    })

    // DB에 회원 정보를 추가하는 api 
    router.post('/signup2', async function(req, res){
        // 유저가 입력한 회원 정보를 변수에 대입 
        const id = req.body._id
        const pass = req.body._pass
        const name = req.body._name
        const age = req.body._age
        console.log('/signup2 : post data = ', id, pass, name, age)
        // user table에 필요한 wallet, private key는 
        // kip7.js 안에 있는 create_wallet() 함수를 이용하여 생성
        const [wallet, private_key] = await kip7.create_wallet()
        console.log('/signup2 : kip7 result =', wallet, private_key)
        // DB에 해당하는 데이터들을 대입 
        sql = `
            insert 
            into 
            survey_user
            values 
            (?, ?, ?, ?, ?, ?)
        `
        values = [id, pass, name, age, wallet, private_key]
        sql_result = await mydb.execute(
            sql, values
        )
        console.log('/signup : DB result = ', sql_result)
        // 작업이 모두 완료되면 main page 이동
        res.redirect('/')
    })

    // 로그아웃 api 생성
    router.get('/logout', function(req, res){
        // 세션에 있는 로그인 데이터를 제거 
        req.session.destroy(function(err){
            if(err){
                console.log(err)
            }else{
                // 세션데이터가 정상적으로 제거가 되면 localhost:3000 돌아간다. 
                res.redirect('/')
            }
        })
    })


    return router
}