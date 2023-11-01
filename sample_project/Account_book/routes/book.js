const express = require('express')
const router = express.Router()

const sql_class = require('../reference/sql_class')
// mydb 생성 (class 생성)
const mydb = new sql_class.Mysql(
    process.env.host, 
    process.env.port, 
    process.env.name, 
    process.env.db_pass, 
    process.env.db_name
)

module.exports = function(){

    // book.js에서 기본 경로는 localhost:3000/book

    router.get('/', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            res.render('book.ejs')
        }
    })

    return router
}