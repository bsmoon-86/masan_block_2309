// expess 모듈 로드 
const express = require('express')
const app = express()

// 포트번호를 설정
const port = 3000

// view 파일들의 기본 경로를 설정 
app.set('views', __dirname+'/views')
// view engine 설정
app.set('view engine', 'ejs')
// post 방식으로 데이터를 받을때 json 형태로 데이터를 받기위한 설정
app.use(express.urlencoded({extended:false}))

// app.js 에서 api를 생성할때는 기본 주소가 localhost:3000

app.get("/", function(req, res){
    // res.send('Hello World')
    // index.ejs 유저에게 돌려준다. 
    res.render('index.ejs')
})

// route 지정 
// 외부의 파일을 로드 
const route1 = require('./routes/user.js')
const user = route1() 
// 해당하는 파일이 어떠한 주소로 요청이 들어올때 실행 할것인가 지정
// localhost:3000/user로 시작하는 주소는 user.js를 사용하겠다. 
app.use("/user", user)

// contract_info.js 파일 로드 
const contract_info = require('./routes/contract_info.js')
// contract_info에는 abi 변수와 address 변수가 존재
// '.' -> 뭐뭐 안에 변수나 함수를 호출 
console.log(contract_info.address)
console.log(contract_info.add(5, 3))

const func = require("./routes/func.js")
console.log(func.multiply(4, 3))



// 웹서버를 실행
app.listen(port, function(){
    console.log(port, "Server Start")
})