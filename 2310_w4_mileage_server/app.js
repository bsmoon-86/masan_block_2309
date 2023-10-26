const express = require('express')
const app = express()

// port 설정
const port = 3000

// fs 라이브러리 로드 
const fs = require('fs')

// view 파일들의 기본 경로 지정
app.set('views', __dirname+"/views")
// viwe engine 지정
app.set('view engine', 'ejs')

// post 방식으로 데이터가 전송되는 경우 json 형태로 데이터를 받기 위한 설정
app.use(express.urlencoded({extended : false}))

// 외부의 js, css, img 파일들의 기본 경로를 설정
app.use(express.static('public'))

app.use('/node', express.static('node_modules'))

// dotenv 설정
require('dotenv').config()

// session을 설정
const session = require('express-session')

app.use(
    session({
        secret : process.env.secret, 
        resave : false, 
        saveUninitialized : false, 
        cookie : {
            maxAge : 60000
        }
    })
)

// reference에 create_table.js를 로드 해서 함수를 호출
require('./reference/create_table')()

// localhost:3000/ 접속시 로그인 페이지 응답
app.get('/', function(req, res){
    // 만약에 msg 라는 데이터가 존재한다면
    if(req.query.msg){
        res.render('index', {
            'status' : false
        })
    }else{
        res.render('index', {
            'status' : true
        })
    }
})

// 데이터베이스의 정보를 입력하는 api
app.get('/db_info', function(req, res){
    res.render('db_info')
})

// 데이터베이스 정보를 유저에게서 받아온 뒤 파일로 저장
app.post("/insert_db_info", function(req, res){
    console.log(req.body)
    // 유저가 보낸 데이터베이스의 정보를 json 파일로 저장
    // json 형태의 데이터를 문자열로 변경
    const data = JSON.stringify(req.body)
    // json파일로 저장
    fs.writeFileSync('./reference/db_info.json', data)
    res.send('json 파일 저장 완료')
    // res.send(req.body)
})

// 데이터베이스에서 user 테이블 정보를 불러온다.
app.get('/db_load', async function(req, res){
    // 클래스를 생성할때 
    // db_info.json이 존재한다면 class를 생성
    const result = fs.existsSync("./reference/db_info.json")
    if(result){
        const db_info = require("./reference/db_info.json")
        console.log(db_info._host)
        const sql_class = require('./reference/sql_class')
        const class1 = new sql_class.Mysql(
            db_info._host, 
            db_info._port, 
            db_info._user,
            db_info._pass, 
            db_info._db
        )
        console.log(class1)
        res.send("")
    }else{
        res.redirect('/db_info')
    }
})

// 회원 관련 api들은 /user 주소에서 모두 사용 
const user = require('./routers/user')()
// localhost:3000/user로 시작하는 주소 값들은 user.js에 있는 router에서 처리
app.use('/user', user)

// 마일리지 관련 api들은 /mileage 주소에서 모두 사용
const mileage = require('./routers/mileage')()
app.use('/mileage', mileage)



app.listen(port, function(){
    console.log('Server Start')
})