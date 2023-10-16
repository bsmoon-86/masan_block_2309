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


// 로그인 관련 api는 /user로 지정하고 user.js파일을 실행하도록 설정
const user = require('./routes/user')()
app.use('/user', user)


app.listen(port, function(){
    console.log('Server Start')
})