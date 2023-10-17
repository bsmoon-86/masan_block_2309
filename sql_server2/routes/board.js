const express = require('express')

const router = express.Router()

// mysql 함수와 변수값들을 로드 
const sql_list = require("../reference/sql_list")
const sql_func = require("../reference/sql_function")

module.exports = function(){

    // board.js 파일에서 만들어지는 api들의 기본 경로 : localhost:3000/board

    router.get("/", async function(req, res){
        if (!req.session.logined){
            res.redirect('/user')
        }else{
            // 로그인 한 유저의 정보가 존재하는가?
            // 1. user_info table에 로그인한 아이디의 데이터가 존재하는가?
            // 2. 로그인이 성공하는 경우 session data에 
            //    로그인의 기본정보와 user_info 정보를 모두 담아둬서 age, gender, phone 값이 존재하는가?

            // case 1
            // const id = req.session.logined.id
            // const [result, field] = await sql_func.execute(
            //     sql_list.info_query, 
            //     [id]
            // )
            // console.log("board user_info data :",  result)
            // let info_check
            // if(result){
            //     info_check = true
            // }else{
            //     info_check = false
            // }

            // case2 
            // req.session.logined.age, gender, phone 데이터가 존재한다면 user_info 데이터가 있다.
            let info_check
            if (req.session.logined.age){
                info_check = true
            }else{
                info_check = false
            }

            // 게시글의 모든 데이터를 board.ejs와 함께 유저에게 보낸다. 
            // board table의 모든 데이터를 로드 
            const [board_result, board_feild] = await sql_func.execute(
                sql_list.board_query
            )
            console.log("board table data :" , board_result)

            res.render('board', {
                check : info_check, 
                data : board_result
            })
        }
    })

    // 글쓰기 화면을 보여주는 api 생성
    router.get('/add_content', function(req, res){
        if(!req.session.logined){
            res.redirect('/user')
        }else{
            res.render('add_content')
        }
    })

    // 유저가 보낸 게시글 데이터를 DB 넣어주는 api
    router.post('/add_content2', async function(req, res){
        // 유저가 보낸 글 제목과 본문의 내용을 변수 대입 & 확인 
        const title = req.body._title
        const content = req.body._content
        // 작성자(세션), 작성 시간(Date 클래스를 이용하여 현재 시간을 불러온다)
        const writer = req.session.logined.id
        // 현재 시간을 불러올수 있는 Date class 생성
        let today = new Date()
        const time = today.toLocaleString()
        console.log("add_content2 data :", title, content, writer, time)
        
        // board table은 No, title, content, writer, time 필드가 존재
        // No 필드는 primary key, auto_increment(자동 증가)
        
        const [result, field] = await sql_func.execute(
            sql_list.add_content_query, 
            [title, content, writer, time]
        )
        console.log("add_content2 query :", result)

        res.redirect('/board')

    })



    return router
}