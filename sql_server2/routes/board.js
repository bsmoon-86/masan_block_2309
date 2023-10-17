const express = require('express')

const router = express.Router()

// mysql 함수와 변수값들을 로드 
const sql_list = require("../reference/sql_list")
const sql_func = require("../reference/sql_function")

module.exports = function(){

    // board.js 파일에서 만들어지는 api들의 기본 경로 : localhost:3000/board

    router.get("/", function(req, res){
        res.render('board')
    })



    return router
}