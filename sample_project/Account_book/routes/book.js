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

// 배포한 smartcontract에 함수들을 사용하기 위한 외부의 모듈을 로드 
const baobab = require('../reference/baobab')

// kip7파일을 로드 
const kip7 = require('../reference/kip7')

module.exports = function(){

    // book.js에서 기본 경로는 localhost:3000/book


    // 장부를 입력하는 api
    router.get('/add', async function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // 거래처 자동 완성을 위한 데이터베이스에서 데이터를 로드 
            // sql에서 해당하는 company에서 등록한 장부의 거래처의 중복데이터를 제거한 정보를 로드
            // sql에서 DISTINCT를 사용하면 중복 데이터를 제거하고 로드 
            const company = req.session.logined.company
            const purchase = await mydb.execute(
                query.auto_bisiness, 
                [company]
            ) 
            const sales = await mydb.execute(
                query.auto_bisiness2, 
                [company]
            )
            console.log(purchase, sales)
            res.render('book_add.ejs', {
                'purchase' : purchase, 
                'sales' : sales, 
                'login_data' : req.session.logined
            })
        }
    })

    // 카테고리 정보를 리턴하는 비동기 통신 api
    router.get('/cate', async function(req, res){
        // 유저가 select로 선택한 값을 변수에 대입
        const type = req.query._type
        const company = req.session.logined.company
        console.log(query.category)
        // DB에 저장되어있는 카테고리를 로드 
        const result = await mydb.execute(
            query.category, 
            [type, company]
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

    // 기간별 데이터를 조회하는 api 
    router.get('/period_total', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // 현재 년도와 현재의 월 데이터를 같이 보내준다. 
            let today = new Date()
            let year = today.getFullYear()
            // getMonth()는 0부터 11까지의 월로 표시
            let month = today.getMonth() + 1
            res.render('book_period', {
                'year' : year, 
                'month' : month, 
                'login_data' : req.session.logined
            })
        }
    })

    // 월별 데이터를 로드하는 비동기 통신 api
    router.get('/select_period', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 
        const start_year = req.query._start_year
        const start_month = req.query._start_month
        const end_year = req.query._end_year
        const end_month = req.query._end_month
        const select = req.query._select
        const company = req.session.logined.company
        const start = start_year + start_month
        const end = end_year + end_month
        // ex) start, end -> 20236, 202311
        console.log(start, end)
        // sql에서 데이터를 로드 
        // 1. account_purchase에서 년도와 월이 같은 데이터를 출력
        // 2. 코드와 월별로 그룹화를 하여 그룹 연산\
        // 월별 합산 금액 데이터를 로드 
        let result
        let result2
        if(select == '매입'){
            result = await mydb.execute(
                query.period_purchase, 
                [company, start, end]
            )
            result2 = await mydb.execute(
                query.period_purchase_sum, 
                [company, start, end]
            )
        }else{
            result = await mydb.execute(
                query.period_sales, 
                [company, start, end]
            )
            result2 = await mydb.execute(
                query.period_sales_sum, 
                [company, start, end]
            )
        }
        
        console.log('/select_month - DB result :', result)
        console.log('/select_month - DB result2 :', result2)
        res.json([result, result2])
        

    })

    // 월별 데이터를 조회하는 api 
    router.get('/month_total', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // 현재 년도와 현재의 월 데이터를 같이 보내준다. 
            let today = new Date()
            let year = today.getFullYear()
            // getMonth()는 0부터 11까지의 월로 표시
            let month = today.getMonth() + 1
            res.render('book_month', {
                'year' : year, 
                'month' : month, 
                'login_data' : req.session.logined
            })
        }
    })

    // 월별 데이터를 로드하는 비동기 통신 api 
    router.get('/select_month', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 
        const year = req.query._start_year
        const month = req.query._start_month
        // 소속회사의 이름을 변수에 대입
        const company = req.session.logined.company
        // 해당하는 기간에 거래처별 그룹화하여 부가세와 거래금액의 합계를 되돌려받는다.(매입, 매출)
        const data = year+month
        const purchase_result = await mydb.execute(
            query.purchase_month, 
            [data, company]
        )
        console.log("/select_month - purchase_result :", purchase_result)
        const sales_result = await mydb.execute(
            query.sales_month, 
            [data, company]
        )
        console.log("/select_month - sales_result :", sales_result)
        // 매입, 매출별 거래금액과 부가세의 합산
        // 매입 거래금액, 부가세 합산
        let purchase_cost = 0
        let purchase_vat = 0
        for (let i = 0; i < purchase_result.length; i++){
            purchase_cost += Number(purchase_result[i]['cost'])
            purchase_vat += Number(purchase_result[i]['vat'])
        }
        // 매출 거래금액, 부가세 합산
        let sales_cost = 0
        let sales_vat = 0
        for (let i = 0; i < sales_result.length; i++){
            sales_cost += Number(sales_result[i]['cost'])
            sales_vat += Number(sales_result[i]['vat'])
        }
        // 순이익 = 매출거래금액합산 - 매입거래금액합산
        let total_cost = sales_cost - purchase_cost
        console.log("/select_month - 합산 금액 :", purchase_cost, purchase_vat, sales_cost, sales_vat, total_cost)

        // 해당하는 장부가 블록체인에 저장되어있는가?
        // 등록된 장부의 리스트를 로드 -> []데이터에 조회를 한 년월 데이터가 존재하는가?
        // 등록된 장부의 리스트를 로드하기위해 필요한 인자 값 -> 회사명 -> company 변수에 데이터를 대입
        const book_list = await baobab.view_list(company)
        console.log("/select_month book_list -", book_list)
        // 조건식이 생성 -> 선택한 기간이 장부의 리스트에 존재하는가?
        // ex) 202311 데이터를 조회하는 경우 -> 장부의 리스트에 [202310, 202311]가 존재한다.
        // 배열 안에 데이터가 존재하는가를 확인하는 비교연산자? -> 리스트명.includes(data값)
        let book_result
        if (book_list.includes(data)){
            // 배열데이터에 data가 포함되어있는 경우 -> 장부 리스트에 이미 저장되어있다 -> 장부를 저장하는 버튼 생성x
            book_result = false
        }else{
            // 장부 리스트에 데이터가 존재하지 않는다 -> 장부를 저장하는 버튼 생성
            book_result = true
        }
        // console.log('data : ', data)
        // console.log('if : ', book_list.includes(data))
        // console.log('book_result : ', book_result)
        result = [purchase_result, sales_result, purchase_cost, 
            purchase_vat, sales_cost, sales_vat, total_cost, book_result]
        res.json(result)
    })

    // /saveBlockchain 주소를 생성 
    // 유저가 보낸 데이터를 blockchain 저장
    router.get('/saveBlockchain', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 
        const purchase_vat = req.query.pur_vat
        const purchase_cost = req.query.pur_cost
        const sales_vat = req.query.sales_vat
        const sales_cost = req.query.sales_cost
        const date = req.query.date
        console.log("/saveBlockchain request message : ", purchase_vat, purchase_cost, sales_vat, sales_cost, date)
        // 블록체인에 배포된 smartconstract에 저장하기 위해서 필요한 데이터는?
        // 회사명, 기준년월, 매입 총 부가세, 매입 총 거래금액, 매출 총 부가세, 매출 총 거래금액, 등록한 사람의 지갑 주소
        // baobab.js 모듈에 작성된 add_data()함수 호출
        const company = req.session.logined.company
        const wallet = req.session.logined.wallet_address
        const result = await baobab.add_data(
            company, 
            date, 
            purchase_vat, 
            purchase_cost, 
            sales_vat, 
            sales_cost, 
            wallet
        )
        console.log('/saveBlockchain BC result -', result)
        // localhost:3000/book으로 재 요청을 보낸다. 
        res.redirect('/book')
    })

    // 데이터베이스에 있는 월별 장부 정보와 blockchain에 있는 월별 장부의 정보가 일치하는가?

    // 장부 데이터가 데이터베이스와 블록체인 데이터가 일치하는지 여부를 보여주는 페이지 api 
    router.get('/check_book', async function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // 블록체인에 등록되어있는 장부의 리스트 호출 
            // baobab.js에 있는 view_list() 함수 호출 
            // 해당하는 함수에서 필요한 인자값 : 회사명(세션데이터 존재)
            const company = req.session.logined.company
            const book_list = await baobab.view_list(company)
            console.log('/check_book BC book_list - ', book_list)
            // 기준년월 데이터를 확인하여 데이터베이스의 정보와 블록체인에서 장부의 정보를 로드 
            // book_list는 배열의 데이터 -> 데이터의 길이만큼 반복하는 반복문 생성
            // // for문 - case1
            // for (i in book_list){
            //     console.log(book_list[i])
            // }
            // // for문 - case2
            // for (let i = 0; i < book_list.length; i++){
            //     console.log(book_list[i])
            // }
            // 비어있는 배열을 생성 
            let result = []
            let db_result = []
            // for문 - case3
            for (i of book_list){
                // i가 뜻하는바? -> 장부가 등록된 기준 년월 데이터
                // baobab.js에서 view_data() 함수 호출
                // 해당하는 함수에서 필요한 인자 값 : 회사명, 기준년월
                let bc_result = await baobab.view_data(company, i)
                // 해당하는 bc_result를 비어있는 배열에 추가
                result.push(bc_result)
                // console.log(result)

                // DB에서 정보를 로드 
                let purchase_list = await mydb.execute(
                    query.purchase_month, 
                    [i, company]
                )
                let sales_list = await mydb.execute(
                    query.sales_month, 
                    [i, company]
                )

                // purchase_list의 데이터의 형태 -> [{bisiness : xxx, unit_name:xxx, sold:xxx, amount:xxx, cost:xxxx, vat:xxx}, ...]
                // 배열 데이터의 합 -> 반복문 
                let purchase_cost = 0
                let purchase_vat = 0
                for (data of purchase_list){
                    // data의 형태 -> {bisiness : xxx, unit_name:xxx, sold:xxx, amount:xxx, cost:xxxx, vat:xxx}
                    purchase_cost += Number(data['cost'])
                    purchase_vat += Number(data['vat'])
                }
                let sales_cost = 0
                let sales_vat = 0
                for (data of sales_list){
                    sales_cost += Number(data['cost'])
                    sales_vat += Number(data['vat'])
                }

                // 순 매출 = 총 매출 거래 금액 - 총 매입 거래 금액
                const cost = sales_cost - purchase_cost

                // DB를 이용해 만들 변수 값들을 db_result에 추가 
                db_result.push([purchase_vat, purchase_cost, sales_vat, sales_cost, cost])

            }
            res.render('book_check', {
                'date' : book_list,
                'bc_data' : result, 
                'db_data' : db_result, 
                'login_data' : req.session.logined
            })
        }
    })

    // 장부 카테고리를 추가할수 있는 화면 api 
    router.get('/cate_add', function(req, res){
        // 세션에 로그인 정보가 존재하지 않는다면 / 이동
        if(!req.session.logined){
            res.redirect('/')
        }else{
            res.render('add_cate', {
                'login_data' : req.session.logined
            }
            )
        }
    })

    // 장부 카테고리 추가 화면에서 보낸 데이터를 데이터베이스에 저장하는 api 
    router.post('/cate_add2', async function(req, res){
        // 유저가 보낸 카테고리 정보들을 변수에 대입 
        const type = req.body._type
        const name = req.body._name
        const code = req.body._code
        const vat = req.body._vat
        console.log('/cate_add2 POST data - ', type, name, code, vat)
        const company = req.session.logined.company

        const result = await mydb.execute(
            query.add_category, 
            [type, code, name, vat, company]
        )
        console.log('/cate_add2 insert DB result - ', result)
        res.redirect('/')
    })


    return router
}