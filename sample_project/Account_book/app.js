const express = require('express')
const app = express()

const port = 3000

app.set('views', __dirname+"/views")
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

require('dotenv').config()

// session 설정
const session = require('express-session')

app.use(
    session({
        secret : process.env.session_key, 
        resave : false, 
        saveUninitialized : false, 
        cookie : {
            maxAge : 300000
        }
    })
)

// 최초의 sql에 table이 존재하는가?
// 외부의 js 파일에서 table를 생성하는 함수를 호출
const create_table = require('./reference/create_table')
create_table.execute_sql()


const fs = require('fs')
const kip7_func = require('./reference/kip7')
// KAS를 이용하여 token을 생성(기존의 토큰이 존재하는 않는 경우에만)
// 토큰 파일(reference 폴더 안에 kip7.json)을 존재 유무에 따라 token을 생성 할지 지정
const path2 = './reference/kip7.json'
if(!fs.existsSync(path2)){
    kip7_func.create_token(
        'Masan', 
        'M', 
        0, 
        100000000, 
        path2
    )
}

// localhost:3000/ 요청시 
app.get('/', function(req, res){
        res.redirect('/user')
    
})

app.get('/signout', function(req, res){
    // 세션에서 로그인 데이터를 제거 
    req.session.destroy(function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect('/')
        }
    })
})

// 회원 관련 api들은 user.js에서 실행하도록 route 설정
const user = require('./routes/user')()
app.use('/user', user)

// 장부 관련 api들을 book.js에서 실행하도록 route 설정
const book = require('./routes/book')()
app.use('/book', book)


app.get('/test', function(req, res){
    res.render('signin_old')
})


app.listen(port, function(){
    console.log('Server Start Port:', port)
})
