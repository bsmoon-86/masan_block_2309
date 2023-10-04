// express 모듈 로드 
const express = require('express')
const app = express()

// 뷰 파일들의 기본 경로를 설정, 뷰 엔진 설정
// __dirname : 현재 파일의 경로 
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

// 포트번호: 내 컴퓨터에서 특정한 번호로 요청이 들어올 시 웹서버를 보여준다. 
const port = 3000

// api 생성 -> 요청 목록
app.get("/", function(req, res){
    // req : 유저가 서버에게 보낸 요청 메시지
    // res : 서버가 유저에게 보내는 응답 메시지
    // 문자열을 응답하는 방법
    // res.send('Hello World')
    // 퓨 파일을 응답하는 방법
    res.render('index.ejs')
})

// 로그인 페이지로 이동하는 api
app.get("/signin", function(req, res){
    res.render('signin.ejs')
})
// 회원가입 페이지로 이동하는 api
app.get("/signup", function(req, res){
    res.render('signup.ejs')
})


// 웹서버 실행
app.listen(port, function(){
    console.log('Port : ' + port + ' Server Start')
})