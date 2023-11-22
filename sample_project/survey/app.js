const express = require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({
    extended : true
}))

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
app.get('/', function(req, res){
    res.render('menu')
})

// localhost:3000/user 주소로 요청이 들어온다면 
// routes폴더에 있는 user.js 파일을 사용
const user = require("./routes/user")()
app.use('/user', user)


app.listen(3000, function(){
    console.log('Server Start')
})

