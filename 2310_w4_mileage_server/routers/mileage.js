const express = require('express')

const router = express.Router()


// smartcontract 모듈을 로드 
const sc =require("../reference/smartcontract")

module.exports = function(){

    // 기본 경로가 localhost:3000/mileage

    router.get('/', function(req, res){
        sc.smartcontract
        .methods
        .add_user(
            "test"
        )
        .send(
            {
                from:process.env.bc_owner, 
                gas:2000000
            }
        ).then(function(result){
            res.send('')
        })
    })

    // 마일리지를 지급하는 api
    router.get('/add', async function(req, res){
        // 마일리지를 받을 유저의 이름과 마일리지의 양을 유저에게서 받는다. 
        const user = req.query._user
        const amount = req.query._amount
        console.log("url : /mileage/add, data :", user, amount)
        // 스마트컨트렉트에 add_mileage()함수를 호출
        const result = await sc.smartcontract
        .methos
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
        console.log("url : /mileage/add, contract_data :", result)
        res.send('마일리지 지급 완료')
    })


    return router
}