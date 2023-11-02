const express = require('express')
const router = express.Router()

const sql_class = require('../reference/sql_class')
// mydb 생성 (class 생성)
const mydb = new sql_class.Mysql(
    process.env.host, 
    process.env.port, 
    process.env.user, 
    process.env.db_pass, 
    process.env.db_name
)
// book에서 사용할 query이 모여있는 파일을 로드 
const query = require('../reference/book_sql_query')

// kip7파일을 로드 
const kip7 = require('../reference/kip7')

module.exports = function(){

    // book.js에서 기본 경로는 localhost:3000/book

    router.get('/', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            res.render('book.ejs')
        }
    })

    // 장부를 입력하는 api
    router.get('/add', function(req, res){
        res.render('book_add.ejs')
    })

    // 카테고리 정보를 리턴하는 비동기 통신 api
    router.get('/cate', async function(req, res){
        // 유저가 select로 선택한 값을 변수에 대입
        const type = req.query._type
        console.log(query.category)
        // DB에 저장되어있는 카테고리를 로드 
        const result = await mydb.execute(
            query.category, 
            [type]
        )
        console.log('/cate - DB result :', result)
        res.json(result)
    })

    return router
}