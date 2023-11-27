const express = require('express')

const router = express.Router()

const sql_class = require('../reference/sql_class')

const mydb = new sql_class.Mysql(
    process.env.host, 
    process.env.port, 
    process.env.user, 
    process.env.db_pass, 
    process.env.db_name
)

module.exports = function(){

    // localhost:3000/survey가 기본 경로

    // 설문 내용을 추가하는 페이지를 보여주는 api
    router.get('/regist', function(req, res){
        // 로그인 데이터가 존재하지 않는다면 localhost:3000/ 으로 이동
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // survey_regist.ejs을 유저에게 보내준다. 
            // survey_regist.ejs안에 menu.ejs 포함 
            // menu.ejs에서는 login, name 데이터 필요
            res.render('survey_regist', {
                'login' : true, 
                'name' : req.session.logined.name
            })
        }
    })

    // 유저가 입력한 설문조사 질문 정보를 받아와서 DB에 저장하는 api 
    router.get('/regist2', async function(req, res){
        // 유저가 보낸 데이터를 변수에 저장 
        const question = req.query.question
        const answer1 = req.query.answer1
        const answer2 = req.query.answer2
        const answer3 = req.query.answer3
        console.log(question)
        // console.log(answer1, answer2, answer3)
        // res.send('test')


        // 유저가 보낸 질문 내역 정보를 DB에 저장 
        sql = `
            insert into 
            survey_list(
                q1, a1, q2, a2, q3, a3
            )
            values 
            (?,?,?,?,?,?)
        `
        values = [question[0], answer1, question[1], answer2, question[2], answer3]
        const sql_result = await mydb.execute(
            sql, values
        )
        console.log('/survey/regist2 : sql_result = ', sql_result)
        res.redirect('/')
    })

    // 등록된 설문의 정보를 보여주는 api 
    router.get('/list', async function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // 설문 리스트가 저장되어있는 DB에 survey_list table에서 데이터를 로드 
            // sql 쿼리문을 작성 
            sql = `
                select 
                * 
                from 
                survey_list
            `
            const db_result = await mydb.execute(
                sql
            )
            console.log('/survey/list : DB_result = ', db_result)
            // 유저에게 응답을 보낸다. 
            res.render('survey_list', {
                'name' : req.session.logined.name, 
                'login' : true, 
                'data_list' : db_result
            })
        }
    })

    router.get('/view/:_mo', async function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            const no = req.params._mo
            console.log('/survey/view : no =', no)
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
            console.log('/survey/view : DB_result =', db_result)
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
        res.send('TEST')
    })


    return router
}