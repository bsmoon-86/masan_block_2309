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
        if(!req.session.logined){
            res.redirect('/')
        }else{
            res.render('book_add.ejs')
        }
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
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // 유저가 입력한 데이터를 변수에 대입 
            const type = req.body._type
            const code = req.body._code
            const bisiness = req.body._bisiness
            const name = req.body._name
            // sold, amount, cost는 콤마를 제거 
            const sold = (req.body._sold).replaceAll(',', '')
            const amount = (req.body._amount).replaceAll(',', '')
            const cost = (req.body._cost).replaceAll(',', '')
            const date = req.body._date
            const etc = req.body._etc
            console.log('/add2 user data -', type, code, bisiness, name, sold, amount, cost, date, etc)
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
                        bisiness,
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
                        etc
                    ]
                )
            }else{
                insert_result = await mydb.execute(
                    query.insert_purchase, 
                    [
                        company, 
                        code, 
                        bisiness,
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
                        etc
                    ]
                )
            }
            console.log('/add2 - insert sql result :', insert_result)

            /////////////////////// blockchain kip7 token 소모 ///////////////////////////
            // kip7.js에서 payment()함수를 호출 
            // payment() 함수에 필요한 인자값 : 유저의 private key, amount(기본값이 1로 지정)
            // 유저의 private key는 어디서 가지고 오는가? 세션에서 데이터를 가지고 온다. 
            const user_private = req.session.logined.private_key
            const bc_result = await kip7.payment(user_private)
            console.log('/add2 kip7 payment result -', bc_result)

            res.redirect('/')
        }
        
    })

    // 장부의 리스트를 확인하는 api
    router.get('/list', async (req, res)=>{
        if(!req.session.logined){
            res.redirect('/')
        }else{
            res.render('book_list')
        }
    })

    // 장부의 데이터들을 유저에게 보내주는 비동기 통신 api
    router.get('/select_list', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 
        const type = req.query._type
        // 로그인을 한 유저의 소속 회사명 
        const company = req.session.logined.company
        // type의 값에 따라 테이블이 변경
        let result
        if(type == '매입'){
            // 데이터베이스에서 정보를 로드 
            result = await mydb.execute(
                query.purchase_list, 
                [company]
            )
        }else{
            // 데이터베이스에서 정보를 로드 
            result = await mydb.execute(
                query.sales_list, 
                [company]
            )
        }
        console.log(result)
        res.json(result)
    })

    // 월별 데이터를 조회하는 api 
    router.get('/month_total', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            res.render('book_month')
        }
    })

    // 월별 데이터를 로드하는 비동기 통신 api
    router.get('/select_month', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 
        const year = req.query._year
        const month = req.query._month
        // sql에서 데이터를 로드 
        // 1. account_purchase에서 년도와 월이 같은 데이터를 출력
        // 2. 코드와 월별로 그룹화를 하여 그룹 연산
        

    })

    return router
}