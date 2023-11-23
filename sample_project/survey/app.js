const express = require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({
    extended : true
}))

// ejs에서 참조할 외부의 파일들의 기본 경로 설정 
app.use(express.static('public'))

// dotenv 설정 
require('dotenv').config()

// session 설정
const session = require('express-session')

app.use(
    session(
        {
            secret : process.env.session_key, 
            resave : false, 
            saveUninitialized : false, 
            cookie : {
                maxAge : 300000
            }
        }
    )
)


// 상단의 메뉴바를 테스트하는 api 생성
// localhost:3000/ 요청시 -> index.ejs 유저에게 보낸다.
// index.ejs 파일 안에 보면 menu.ejs포함
// index.ejs, menu.ejs를 모두 유저에게 보낸다. 
app.get('/', function(req, res){
    // 세션에 데이터가 존재하지 않는 경우 
    if(!req.session.logined){
        res.render('index', {
            'login' : false , 
            'name' : ''
        })
    }else{
        res.render('index', {
            'login' : true, 
            'name' : req.session.logined.name
        })
    }
})

// localhost:3000/user 주소로 요청이 들어온다면 
// routes폴더에 있는 user.js 파일을 사용
const user = require("./routes/user")()
app.use('/user', user)

// 설문에 관련한 api들을 survey.js에서 관리 
// api들을 localhost:3000/survey로 시작하는 주소로 설정 
const survey = require('./routes/survey')()
app.use('/survey', survey)


// 비동기 통신 api들은 ajax.js에서 관리 
// 비동기 통신 api는 localhost:3000/ajax 로 시작하는 주소로 설정 
const ajax = require('./routes/ajax')()
app.use('/ajax', ajax)


app.listen(3000, function(){
    console.log('Server Start')
})

