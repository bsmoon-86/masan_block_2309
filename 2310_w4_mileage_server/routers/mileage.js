const express = require('express')

const router = express.Router()

const sql_list = require("../reference/sql_list")
const sql_class = require("../reference/sql_class")

const class1 = new sql_class.Mysql(
    process.env.host, 
    process.env.port, 
    process.env.user, 
    process.env.db_pass, 
    process.env.db_name
)

module.exports = function(){

    // 기본 경로가 localhost:3000/mileage
    router.get("/", async function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // console.log('url : /mileage, session data :', req.session)
            // console.log('url : /mileage, session data :', req.session.logined)
            // console.log('url : /mileage, session data :', req.session.logined.id)

            // sql에서 로그인을 한 아이디의 마일리지 값 출력
            const result = await class1.execute(
                sql_list.view_mileage, 
                [req.session.logined.id]
            )
            console.log('url : /mileage, SQL result :', result)
            // result의 데이터 형태? -> [{id: xxx, mileage:xxxx}]
            // result 에서 mileage data만 추출하려면? -> 

            res.render('main', {
                'id' : req.session.logined.id, 
                'mileage' : result[0].mileage
            })
        }
    })

    // 마일리지를 지급하는 api
    router.get('/payment', async function(req, res){
        // 마일리지를 받을 유저의 이름과 마일리지의 양을 유저에게서 받는다. 
        const user = req.query.a
        const amount = req.query.b
        console.log("url : /mileage/payment, data :", user, amount)

        const result = await class1.execute(
            sql_list.mileage_add, 
            [amount, user]
        )
        console.log("url : /payment, SQL result :", result )

        res.send("마일리지 지급 완료")
    })

    router.post('/transaction', async function(req, res){
        // ajax 비동기 통신을 이용하여 유저가 보낸 데이터를 변수에 대입&확인
        const receiver = req.body._receiver
        const amount = req.body._amount
        console.log('url : /mileage/transaction, data : ',receiver, amount)
        const sender = req.session.logined.id
        // sender 의 마일리지를 감소 시킨다
        const result = await class1.execute(
            sql_list.mileage_subtract, 
            [amount, sender]
        )
        console.log('url : /transaction, SQL result :', result)
        // receiver의 마일리지를 증가 시킨다
        const result2 = await class1.execute(
            sql_list.mileage_add, 
            [amount, receiver]
        )
        console.log('url : /transaction, SQL result2 :', result2)

        const result3 = await class1.execute(
            sql_list.view_mileage, 
            [sender]
        )
        console.log('url : /transaction, SQL result3 :', result3)


        // 응답 메시지 -> json -> ajax에서 dataType를 json 지정했기 때문에
        res.json({
            'mileage' : result3[0].mileage
        })
    })


    return router
}