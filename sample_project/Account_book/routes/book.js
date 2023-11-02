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

    // 장부를 등록하는 api 
    router.post('/add2', async function(req, res){
        // 유저가 입력한 데이터를 변수에 대입 
        const type = req.body._type
        const code = req.body._code
        const name = req.body._name
        const sold = req.body._sold
        const amount = req.body._amount
        const cost = req.body._cost
        const date = req.body._date
        // 소속, 작성자, 작성시간
        const company = req.session.logined.company
        const writer = req.session.logined.id
        const now = new Date()
        const create_dt = now.toLocaleString()
        // DB에서는 거래일자가 년 , 월 , 일
        // date 변수는 format (year-month-day)
        // 문자열 데이터를 특정 문자를 기준으로 나눠준다 split({특정 문자})
        const date_list = date.split('-')
        // date_list변수 format [year, month, day]
        // 부가세 로드 
        const vat_num = await mydb.execute(
            query.check_vat, 
            [code]
        )
        // vat_num = [{vat : 0|10}]
        // 퍼센트 10, 0
        const vat_data = vat_num[0].vat
        let vat = cost * (vat_data / 100)

        let insert_result

        if(type=='매출'){
            insert_result = await mydb.execute(
                query.insert_sales, 
                [
                    company, 
                    code, 
                    name, 
                    sold, 
                    amount, 
                    cost, 
                    vat, 
                    writer, 
                    date_list[0], 
                    date_list[1], 
                    date_list[2],
                    create_dt, 
                    ''
                ]
            )
        }else{
            insert_result = await mydb.execute(
                query.insert_purchase, 
                [
                    company, 
                    code, 
                    name, 
                    sold, 
                    amount, 
                    cost, 
                    vat, 
                    writer, 
                    date_list[0], 
                    date_list[1], 
                    date_list[2],
                    create_dt, 
                    ''
                ]
            )
        }
        console.log('/add2 - insert sql result :', insert_result)
        res.redirect('/')
    })

    return router
}