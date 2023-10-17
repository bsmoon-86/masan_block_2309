// express 모듈 로드 
const express = require('express')

const app = express()

const port = 3000
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

// 최초의 sql에 table이 존재하는가?
// 외부의 js 파일에서 table를 생성하는 함수를 호출
const create_table = require('./reference/create_table')
create_table.execute_sql()

// sql 쿼리문과 쿼리문을 실행하는 함수 js 파일을 따로 생성

// 해당하는 app.js에서는 환경변수 dotenv를 사용한다. 설정
require('dotenv').config()

// express-session 설정 
const session = require('express-session')

app.use(
    session({
        secret : process.env.session_key , // secret 키 값들은 외부에 노출이 되면 보안 상 문제가 발생할 수 있다.  
        resave : false, 
        saveUninitialized: false, 
        cookie : {
            maxAge : 60000
        }
    })
)
// 외부에 노출이 되면 보안 상에 문제가 발생할 수 있는 데이터 값들은 환경변수에 추가하여 둔다. 
// 환경 변수란? -> 환경(os, project)에서 사용이 가능한 변수들을 의미
// 해당하는 프로젝트 안에서의 전역 변수 설정
// 환경 변수를 세팅하기위한 모듈(dotenv) 설치 

// localhost:3000/
app.get('/', function(req, res){
    // session안에 logined에 데이터가 존재하지 않는다면 /user 주소로 요청
    if(!req.session.logined){
        res.redirect('/user')
    }
    // session안에 logined에 데이터가 존재한다면 /board 주소로 요청
    else{
        res.redirect('/board')
    }
})


// 로그인 관련 api는 /user로 지정하고 user.js파일을 실행하도록 설정
const user = require('./routes/user')()
app.use('/user', user)

// 게시판 관련 api는 /board로 지정하고 board.js파일을 실행하도록 설정
const board = require("./routes/board")()
app.use('/board', board)


app.listen(port, function(){
    console.log('Server Start')
})