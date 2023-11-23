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


    return router
}