// express 로드 
const express = require('express')
const app = express()

// port 설정
const port = 3000

// 파일을 새로 작성하여 저장하기 위한 라이브러리 로드 
const fs = require('fs')

// view 파일들의 기본 경로 설정
app.set('views', __dirname+'/views')
// view engine 설정
app.set('view engine', 'ejs')

// post 형태로 데이터를 받는 경우 json형태로 데이터를 받기 위한 설정
app.use(express.urlencoded({extended:true}))

// 외부의 js, css와 같은 정적 파일들의 기본경로 설정
app.use(express.static('public'))

// dotenv 설정
require('dotenv').config()

const kip7 = require("./reference/kip7")


// 토큰을 발행하는 화면을 보여주는 api
app.get('/', function(req, res){
    res.render('token')
})

app.post("/create", async function(req, res){
    // 유저가 입력한 토큰 정보를 받아온다. 
    const name = req.body._name
    const symbol = req.body._symbol
    const decimal = req.body._decimal
    const amount= req.body._amount
    console.log(name, symbol, decimal, amount)
    const result = await kip7.create_token(
        name, symbol, decimal, amount
    )
    console.log(result)
    res.send(result)
})


app.listen(port, function(){
    console.log(`port : ${port} Server start`)
})