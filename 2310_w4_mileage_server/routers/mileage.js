const express = require('express')

const router = express.Router()


// smartcontract 모듈을 로드 
const sc =require("../reference/smartcontract")

module.exports = function(){

    // 기본 경로가 localhost:3000/mileage
    router.get("/", async function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // console.log('url : /mileage, session data :', req.session)
            // console.log('url : /mileage, session data :', req.session.logined)
            // console.log('url : /mileage, session data :', req.session.logined.id)
            // smartcontract에 있는 view_mileage()함수를 호출하여 보유한 마일리지의 수를 받아온다.
            const result = await sc.smartcontract
                            .methods
                            .view_mileage(
                                req.session.logined.id
                            )
                            .call()
            console.log('url : /mileage, BC_result : ', result)

            res.render('main', {
                'id' : req.session.logined.id, 
                'mileage' : result
            })
        }
    })

    // 마일리지를 지급하는 api
    router.get('/payment', async function(req, res){
        // 마일리지를 받을 유저의 이름과 마일리지의 양을 유저에게서 받는다. 
        const user = req.query.a
        const amount = req.query.b
        console.log("url : /mileage/payment, data :", user, amount)
        // 스마트컨트렉트에 add_mileage()함수를 호출
        const result = await sc.smartcontract
        .methods
        .add_mileage(
            user, 
            amount
        )
        .send(
            {
                from : process.env.bc_owner, 
                gas : 2000000
            }
        )
        console.log("url : /mileage/payment, contract_data :", result)
        res.send("마일리지 지급 완료")
    })

    router.post('/transaction', async function(req, res){
        // ajax 비동기 통신을 이용하여 유저가 보낸 데이터를 변수에 대입&확인
        const receiver = req.body._receiver
        const amount = req.body._amount
        console.log('url : /mileage/transaction, data : ',receiver, amount)
        // smartcontract에 trans_mileage() 함수를 호출하여 마일리지 거래 
        // trans_mileage에는 매개변수 3개 : sender, receiver, amount
        // sender에 들어갈 데이터는? req.session.logined.id
        const sender = req.session.logined.id
        const result = await sc.smartcontract
                        .methods
                        .trans_mileage(
                            sender, 
                            receiver, 
                            amount
                        )
                        .send(
                            {
                                from : process.env.bc_owner, 
                                gas : 2000000
                            }
                        )
        console.log('url : /mileage/transaction, bc_result :', result)
        // 거래 완료 후 로그인을 한 아이디의 마일리지의 양을 다시 받아온다. 
        const result2 = await sc.smartcontract
                        .methods
                        .view_mileage(
                            sender
                        )
                        .call()
        console.log('url : /mileage/transaction, bc_result2 :', result2)
        // 응답 메시지 -> json -> ajax에서 dataType를 json 지정했기 때문에
        res.json({
            'mileage' : result2
        })
    })


    return router
}