const express = require('express')
const Caver = require('caver-js')
const router = express.Router()

// sql_class 호출
const sql_class = require('../reference/sql_class')

// class 생성
const mydb = new sql_class.Mysql()


// blockchain 기본 설정 

// contract의 정보가 저장되어 있는 파일을 로드 
const contract_info = require("../build/contracts/Survey.json")

const abi = contract_info.abi
const constract_address = contract_info.networks['1001']['address']

// contract가 배포되어 있는 네트워크 주소를 입력 
const caver = new Caver('https://api.baobab.klaytn.net:8651')

// 배포한 contract를 로드 
const smartcontract = new caver.klay.Contract(
    abi, 
    constract_address
)

// 지갑 등록 
const account = caver.klay.accounts.createWithAccountKey(
    process.env.public_key, 
    process.env.private_key
)
caver.klay.accounts.wallet.add(account)


module.exports = function(){
    
    // localhost:3000/block/view/설문고유번호
    router.get('/view/:_mo', async function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            const no = req.params._mo
            const address = req.session.logined.wallet
            // 설문에 참여 여부
            // (contract에 있는 check_survey() 함수 호출)
            // check_survey() 함수를 호출하였을때 결과가 True면 설문 참여 가능
            // False이면 설문 참여 불가
            const bc_result = await smartcontract
                                .methods
                                .check_survey(
                                    no, 
                                    address
                                )
                                .call()
            console.log('/block/view : BC_result = ', bc_result)
            // (DB에 참여 내역이 존재하는가) 
            // 결과값을 이용하여 참여 여부 판단 
            // 데이터의 길이가 1이라면 ? -> 데이터 존재 -> 참여o -> 더이상 참여 불가
            // 데이터의 길이가 0이라면 ? -> 데이터가 존재하지 않는다. -> 참여 가능
            check_sql = `
                select 
                * 
                from 
                survey_answers 
                where 
                survey_no = ?
                and 
                user_wallet = ?
            `
            check_values = [no, address]
            const check_db = await mydb.execute(
                check_sql, check_values
            )
            console.log('/block/view : checkDB = ', check_db)
            let db_check_result = false
            if (check_db.length == 0){
                db_check_result = true
            }
            console.log(db_check_result)
            // 참여를 했다면 /survey/list로 이동
            // 참여하지 않았다면 설문 답변을 하는 화면으로 이동
            // bc_result와 db_check_result가 모두 참이라면 설문 답변 페이지를 보여준다. 
            // 둘중에 하나라도 거짓이라면 list화면으로 돌아간다.
            if (bc_result && db_check_result){
                console.log('/block/view : no =', no)
                sql = `
                    select 
                    * 
                    from 
                    survey_list 
                    where 
                    no = ?
                `
                values = [no]
                const db_result = await mydb.execute(
                    sql, values
                )
                console.log('/block/view : DB_result =', db_result)
                // db_result를 질문은 질문대로 
                // 답변은 답변대로 변수에 대입 
                // db_result의 길이는? -> 0 | 1 -> 둘중에 하나인 이유? -> 기본키를 같다라는 조건식으로 사용
                // db_result[0] -> {  }
                const q1 = db_result[0]['q1']
                const q2 = db_result[0]['q2']
                const q3 = db_result[0]['q3']
                // eval() : 문자열 데이터를 JS코드로 해석하여 실행
                const a1 = eval(db_result[0]['a1'])
                const a2 = eval(db_result[0]['a2'])
                const a3 = eval(db_result[0]['a3'])
                // console.log(a1[0])
                res.render('survey_test', {
                    'login' : true, 
                    'name' : req.session.logined.name, 
                    'no' : no,
                    'q' : [q1, q2, q3], 
                    'a' : [a1, a2, a3]
                })
            }else{
                res.redirect('/survey/list')
            }
        }
    })

    // 설문의 답변을 받아오는 api 
    router.post('/submit', async function(req, res){
        // 유저가 보내는 데이터 
        const a1 = req.body.a1
        const a2 = req.body.a2
        const a3 = req.body.a3
        console.log('/survey/submit : req.data =', a1, a2, a3)
        // 해당하는 답변을 blockchain에 데이터를 저장
        // 같은 데이터를 DB survey_answers table에도 저장
        const address = req.session.logined.wallet
        const no = req.body.no
        console.log(address, no, [a1,a2,a3])
        // blockchain network에 배포한 smartcontract의 add_survey()함수를 호출
        const bc_result = await smartcontract
                            .methods
                            .add_survey(
                                no, 
                                address, 
                                [a1, a2, a3]
                            ) // 설문의 답변을 저장
                            .send({
                                from : account.address, 
                                gas : 2000000
                            })
        console.log('/block/submit : BC_result = ', bc_result)
        // 해당하는 답변의 내역을 DB에도 저장
        sql = `
            insert 
            into 
            survey_answers(
                survey_no, 
                user_wallet, 
                answer1, 
                answer2, 
                answer3
            ) 
            values (?,?,?,?,?)
        `
        values = [no, address, a1, a2, a3]
        const db_result = mydb.execute(
            sql, 
            values
        )
        console.log('/block/submit : DB_result = ', db_result)
        res.redirect('/')
    })

    router.get('/answer_list', async function(req, res){
        // 유저가 보내준 설문의 고유 번호를 변수에 저장 
        const no = req.query.no
        console.log('/block/answer_list : no = ', no)
        // DB에서 해당 설문에 대한 상세 정보를 로드 
        sql = `
            select 
            * 
            from 
            survey_list 
            where 
            no = ?
        `
        values = [no]
        const survey_detail = await mydb.execute(
            sql, values
        ) // 데이터의 형태가 sql에서 데이터를 보내줄때 배열 안에 제이슨이므로 [0] -> 제이슨
        // 설문 답변 내역 
        sql = `
            select 
            * 
            from 
            survey_answers
            where 
            survey_no = ?
        `
        values = [no]
        const answer_list = await mydb.execute(
            sql, values
        )        
        console.log('/block/answer_list : survey_detail = ', survey_detail)
        // 답변 내역 새로 생성 
        // eval() : 문자열을 js코드화 : 문자열로 되어있는 리스트 형태의 문자를 리스트형으로 변환
        const answer1 = eval(survey_detail[0]['a1']) //1번 질문에 대한 답 리스트
        const answer2 = eval(survey_detail[0]['a2']) //2번 질문에 대한 답 리스트
        const answer3 = eval(survey_detail[0]['a3']) //3번 질문에 대한 답 리스트
        console.log('/block/answer_list : answer_list = ', answer_list)
        res.render('answer_list', {
            'name' : req.session.logined.name, 
            'login' : true, 
            'survey' : survey_detail, 
            'answer' : [answer1, answer2, answer3], // 2차원 리스트
            'answers' : answer_list
        })
    })

    return router
}