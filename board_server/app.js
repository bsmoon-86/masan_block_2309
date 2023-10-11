const express = require('express')
const app = express()

const port = 3000

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

// express-session 모듈 로드 
const session = require('express-session')

// session 기본 설정
app.use(
    session(
        {
            secret : 'asdfgh', 
            resave : false,   // 매번 세션 데이터를 저장할것인가?
            saveUninitialized : false ,  // 세션의 데이터를 초기화하여 재저장할것인가?
            cookie : {
                maxAge : 60000  // 세션의 데이터를 저장하는 시간 (1000당 1초)
            }
        }
    )
)

// session은 데이터는 서버가 저장
// 클라이언트에게는 sid(hash화 된 데이터) 유저에게 보내준다. 
// 클라이언트는 서버에게 sid를 다시 보내줌으로써 내가 원하는 데이터를 호출


// localhost:3000/ 요청 시 
app.get("/", function(req, res){
    res.render('index.ejs')
})

// user.js 파일 로드 
const user = require("./routes/user")()
app.use("/user", user)

// board.js파일 로드 
const router1 = require("./routes/board")
const board = router1()
app.use("/board", board)


app.listen(port, function(){
    console.log(port, "Server Start")
})