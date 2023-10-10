const express = require('express')

const router = express.Router()

// 이더리움 네트워크에서 smartcontract를 로드하기 위한 web3 라이브러리 로드 
const Web3 = require('web3')

// smartcontract가 배포되어 있는 네트워크의 주소를 등록(가나슈 네트워크)
const web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:7545')
) 

// 배포된 smartcontract의 정보 파일을 로드 
// 상위 폴더로 이동(../) ->  build 하위 폴더 이동(build/) 
// -> contracts 하위 폴더 이동(contracts/) -> Board.json
const contract_info = require("../build/contracts/Board.json")

// 배포한 smartcontract와 연결 (abi, address)
const smartcontract = new web3.eth.Contract(
    contract_info.abi,
    contract_info.networks['5777'].address
)

// 가나슈 네트워크에 존재하는 지갑의 주소들을 로드 
let address
web3.eth.getAccounts(function(err, ass){
    if(err){
        console.log(err)
    }else{
        address = ass
        // console.log(address)
    }
})

module.exports = function(){
    // 기본 api 경로가 localhost:3000/board

    // localhost:3000/board/ 요청시 
    // 게시글의 목록들을 보여주는 페이지 
    router.get('/', async function(req, res){
        // smartcontract에서 게시글 목록 로드 
        // 응답 -> 페이지 소스인 ejs와 게시글 정보
        // 몇개의 글이 존재하는가?
        // smartcontract에 있는 view_no() 함수를 호출하여 결과를 받아온다. 
        let no = await smartcontract
        .methods
        .view_no()
        // send() : 수수료가 발생하는 경우 지갑의 주소와 가스비 
        // call() : 수수료가 발생하지 않는 경우 일반적으로 사용
        .call()

        // 글의 모든 정보를 저장하는 변수를 생성
        let content_list = {}

        // 글 등록을 0개 했다 -> smartcontract에 있는 no는? 1
        // 반복문에 1부터 0까지 반복한다. -> 0번 반복
        // 글 등록을 5개 했다 -> smartcontract에 있는 no는? 6 
        // 반복문에 1부터 5까지 반복한다. -> 5번 반복
        for (let i = 1; i < no; i++){
            // contents를 하나씩 로드하는 view_content() 호출
            console.log(i)
            await smartcontract
            .methods
            .view_content(i)
            .call()
            .then(function(result){
                // console.log(result)
                // result -> 글 하나의 정보
                // result들을 모아서 하나의 변수에 대입
                content_list[i] = result

            })
        }

        console.log(content_list)   // {}
        res.render('board.ejs', {
            'content_no' : no, 
            'contents' : content_list
        })
        
    })

    router.get("/add_content", function(req, res){
        res.render('add_content.ejs')
    })

    router.post("/add_content2", function(req, res){
        // 유저가 서버에게 보낸 데이터를 변수에 할당 & 확인
        const title = req.body._title
        const writer = req.body._writer
        const content = req.body._content
        console.log(title, writer, content)
        // 현재의 시간을 불러오는 class 생성
        let today = new Date()
        console.log(today.toLocaleDateString())
        console.log(today.toLocaleTimeString())
        console.log(today.toLocaleString())
        const time = today.toLocaleString()

        // smartcontract에 있는 add_content()함수를 호출하여 데이터를 저장
        smartcontract
        .methods
        .add_contents(
            title, writer, time, content
        )
        .send(
            {
                from : address[0], 
                gas : 2000000
            }
        )
        .then(function(result){
            console.log(result)
            // 글 목록으로 이동
            res.redirect('/board')
        })
    })

    router.get('/view_content', async function(req, res){
        // 유저가 보낸 데이터를 변수에 할당 & 확인 
        const no = req.query.no
        console.log(no)

        const result = await smartcontract
        .methods
        .view_content(no)
        .call()

        console.log(result)

        res.render("view_content.ejs" ,{
            "data" : result
        })
    })



    return router
}