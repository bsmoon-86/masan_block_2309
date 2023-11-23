const express = require('express')

const router = express.Router()

// 외부의 sql_class.js 파일을 로드 
const sql_class = require('../reference/sql_class')

// Mysql이라는 class 생성
const mydb = new sql_class.Mysql(
    process.env.host, 
    process.env.port, 
    process.env.user, 
    process.env.db_pass, 
    process.env.db_name
)

module.exports = function(){

    // router 변수에 api들을 등록 

    // 해당하는 api들은 localhost:3000/ajax 가 기본경로 

    // DB에서 ID가 가 존재하는지 여부를 되돌려주는 api 
    router.get('/check_id', async function(req, res){
        // signup.ejs에서 비동기 통신으로 아이디 값을 보내준다 
        const _id = req.query._id
        // 해당하는 아이디값을 기준으로 하여 데이터베이스에 해당하는 아이디가 존재하는가 
        sql = `
            select 
            * 
            from 
            survey_user 
            where 
            ID = ?
        `
        values = [_id]
        const sql_result = await mydb.execute(
            sql, values
        )
        console.log('/ajax/check_id : sql_result = ', sql_result)
        // 사용 가능한 아이디 -> sql_result가 [] -> 응답 { 'check' : true }
        // 사용 불가능한 아이디 -> sql_result가 [ {ID : xxx, PASSWORD : xxxx, ....} ] -> 응답 { 'check' : false }
        let data;
        if (sql_result.length == 0){
            // 사용이 가능한 아이디
            data = { 'check' : true }
        }else{
            data = { 'check' : false }
        }
        res.json(data)
    })


    return router
}