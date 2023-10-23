const express = require('express')
const app = express()

// port 설정
const port = 3000

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

// localhost:3000/ 접속시 로그인 페이지 응답
app.get('/', function(req, res){
    res.render('index')
})

// 회원 관련 api들은 /user 주소에서 모두 사용 
const user = require('./routers/user')()
// localhost:3000/user로 시작하는 주소 값들은 user.js에 있는 router에서 처리
app.use('/user', user)



app.listen(port, function(){
    console.log('Server Start')
})