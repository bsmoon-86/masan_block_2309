// express 모듈을 로드 
const express = require('express')
const app = express()

// 웹서버의 port 번호 지정
const port = 3000

// 뷰 파일들이 모여있는 경로를 지정
// __dirname : 현재 파일의 경로
app.set('views', __dirname+'/views')
// 뷰 파일들을 어떠한 뷰 엔진으로 사용할 것인가를 지정
app.set('view engine', 'ejs')


// 요청 주소들을 생성 (api 생성)
// localhost -> 내 컴퓨터
// :port

// localhost:3000/ 요청이 들어온 경우
app.get('/', function(req, res){
    // req -> 요청 메시지
    // res -> 응답 부분
    // res.send('Hello World')
    // 응답이 문자열을 되돌려주는것이 아니라 ejs파일을 응답
    res.render("index.ejs")
})

// localhost:3000/second 주소로 요청이 들어온 경우
app.get('/second', function(req, res){
    // res.send('Second Page')
    res.render('second')
})

// localhost:3000/signin 주소로 요청이 들어온 경우
app.get("/signin", function(req, res){
    // 유저가 보낸 데이터를 확인하고 변수에 대입 
    // get 방식으로 데이터를 보내는 경우 -> url뒤에 ? key(input태그 안에 있는 name값) = value & key2 = value2
    // req안에 query곳에 데이터가 존재
    console.log(req.query)
    const _name = req.query.input_name
    const _pass = req.query.input_pass
    console.log(_name, _pass)
    // _name이 'test' 이고 _pass가 '1234' 데이터가 들어온다면
    // 로그인이 성공
    // 그 외의 경우는 로그인이 실패
    // 조건문을 이용하여 _name, _pass 값들을 비교
    // 두개의 조건이 모두 참인 경우에 로그인 성공
    if ( (_name == 'test') && (_pass == '1234') ){
        res.send('로그인 성공')
    }else{
        // 로그인이 실패하는 경우 
        // 로그인 페이지(localhost:3000/)로 이동
        res.redirect("/")
    }
})



// 웹서버의 시작
app.listen(port, function(){
    console.log('Server Start')
})