const express = require('express')
const app = express()

const port = 3000

app.set('views', __dirname+"/views")
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

require('dotenv').config()

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

// 회원 관련 api들은 user.js에서 실행하도록 route 설정
const user = require('./routes/user')()
app.use('/user', user)



app.listen(port, function(){
    console.log('Server Start Port:', port)
})
