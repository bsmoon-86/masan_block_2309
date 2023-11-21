const express = require('express')
const router = express.Router()

// crypto 라이브러리 로드 
const Crypto = require('crypto')

// crypto에서 사용할 secret key 로드 
const sha256_secret = process.env.sha256_key


// 외부의 mysql class파일을 로드 
const sql_class = require('../reference/sql_class')
// Mysql이라는 class 생성
const mydb = new sql_class.Mysql(
    process.env.host, 
    process.env.port, 
    process.env.user, 
    process.env.db_pass, 
    process.env.db_name
)
// 회원 관련 sql query문이 저장되어있는 파일을 로드 
const user_query = require('../reference/user_sql_query.json')

// const user_query = {
//     "check_id" : "select * from account_user where id = ?"
// }

// 지갑을 생성하기 위하여 kip7.js 로드 
const kip7 = require("../reference/kip7")

module.exports = function(){

    // 기본 경로는? localhost:3000/user

    router.get("/", async function(req, res){
        // session에 로그인 정보가 존재한다면 signin페이지에 로그인 정보를 담아서 보내준다. 
        // session에 로그인 정보가 존재하지 않는다면 데이터는 비어있는 데이터를 보내준다. 
        if(!req.session.logined){
            res.render('signin', {
                'login_data' : ''
            })
        }else{
            /* 
                req.session.logined -> 
                {
                    id : xxxxx,
                    password : xxxxx, 
                    name : xxxx, 
                    company : xxxx, 
                    wallet_address : xxxxx, 
                    private_key : xxxxx 
                }
            */
            // 로그인을 한 유저의 지갑에 있는 token양을 session 데이터와 같이 보낸다. 
            // 유저가 소유하고 있는 token양 -> kip7.js에 있는 balance() 함수를 호출하여 토큰의 양을 받아온다.
            // balance() 함수에서는 유저의 지갑 주소(세션 데이터 존재)가 필요
            const user_address = req.session.logined.wallet_address
            const token_amount = await kip7.balance(user_address)
            // data라는 변수에 token_amount 값을 추가 (json데이터에 새로운 키:벨류의 데이터를 추가)
            req.session.logined.amount = token_amount
            /* 
                req.session.logined -> 
                {
                    id : xxxxx,
                    password : xxxxx, 
                    name : xxxx, 
                    company : xxxx, 
                    wallet_address : xxxxx, 
                    private_key : xxxxx , 
                    amount : 토큰수량
                }
            */
            console.log("session data : ", req.session.logined)
            res.render('signin', {
                'login_data' : req.session.logined
            })
        }
    })

    // 로그인 api 생성
    router.post("/signin", async function(req, res){
        /*
            request(요청) 데이터 안에 유저 보낸 데이터가 존재

            get 방식으로 데이터를 보낸다면 
                http://localhost:3000/signin?_id=value&_pass=value2
                request -> {
                    'xxx' : xxxxx, 
                    xxxx : xxxxxxx, 
                    xxxxx : xxxxxx, 
                    'query' : {
                        '_id' : 유저가 입력한 아이디, 
                        '_pass' : 유저가 입력한 패스워드
                    }, 
                    xxxx : xxxxxxxxx, 
                }
            post 방식으로 데이터를 보낸다면 
                http://localhost:3000/signin?key=value&key2=value2
                request -> {
                    'xxx' : xxxxx, 
                    xxxx : xxxxxxx, 
                    'params' : xxxxxx, 
                    'query' : {
                        key : value, 
                        key2 : value2
                    }, 
                    xxxx : xxxxxxxxx,
                    'body' : {
                        '_id' : 유저가 입력한 아이디, 
                        '_pass' : 유저가 입력한 패스워드
                    }
                }

            유저가 보낸 데이터의 형태 
            {
                '_id' : 유저가 입력한 아이디, 
                '_pass' : 유저가 입력한 패스워드
            }
        */

        // 유저가 보낸 id, pass를 변수 대입 확인
        const id = req.body._id
        const pass = req.body._pass
        console.log('/signin id, pass =', id, pass)
        // 유저가 입력한 password를 sha256으로 암호화
        const crypto_pass = Crypto.createHmac('sha256', sha256_secret).update(pass).digest('hex')
        // 암호화한 password를 데이터베이스와 비교
        console.log(crypto_pass)
        const result = await mydb.execute(
            user_query.signin, 
            [id, crypto_pass]
        )
        console.log('/signin DB result =', result)
        // 로그인이 성공한다면? result -> [{id, pass, name, company, ...}]
        // 로그인이 실패한다면? result -> []
        if(result.length != 0){
            // 로그인 성공 
            // session에 로그인 정보를 저장 
            /* 
                {
                    id : xxxxx,
                    password : xxxxx, 
                    name : xxxx, 
                    company : xxxx, 
                    wallet_address : xxxxx, 
                    private_key : xxxxx 
                }
            */
            req.session.logined = result[0]
            // main page로 이동
            res.redirect('/user')
        }else{
            // 로그인 실패
            res.redirect('/user')
        }

    })


    // 회원 가입 화면을 보여주는 api
    router.get('/signup', function(req, res){
        res.render('signup')
    })

    // 중복된 아이디인가를 체크하는 비동기 통신 api
    router.get('/check_id', async function(req, res){
        // 서버가 보내온 아이디 값을 DB에 해당하는 아이디가 존재하는지 확인 
        const id = req.query._id
        console.log('/check_id - id :', id)
        // 데이터베이스에 해당하는 아이디가 존재하는지 확인
        const result = await mydb.execute(
            user_query.check_id, 
            [id]
        )
        // result data는 데이터가 존재하는 경우 [{}] 데이터가 존재하지 않는 경우 []
        console.log("/check_id - result :", result)
        // 데이터가 존재하지 않는다면(사용 가능 아이디)
        if(result.length == 0){
            res.send(true)
        }else{
            res.send(false)
        }
    })

    // 회원 가입 데이터를 회수하여 DB에 삽입
    router.post('/signup2', async function(req, res){
        // 유저가 입력한 데이터를 변수에 대입
        const id = req.body._id
        const pass = req.body._pass
        const name = req.body._name
        const company = req.body._company
        console.log("/signup2 - id, pass, name, company", id, pass, name, company)
        // 비밀번호는 보안을 높이기 위해서 암호화(라이브러리(Crypo)를 사용 )
        // sha256을 이용하여 비밀번호를 암호화하여 데이터베이스에 저장
        // Crypto.createHmac({암호화방법}, {시크릿키})
        console.log(sha256_secret)
        const crypto_pass = Crypto.createHmac('sha256', sha256_secret).update(pass).digest('hex')
        console.log(crypto_pass)
        // 지갑을 생성하여 지갑의 주소와 private_key을 받아온 뒤 데이터베이스에 저장
        const [address, privatekey] = await kip7.create_wallet()
        console.log(address, privatekey)
        // id, crypto_pass, name, company, address, privatekey를 DB에 삽입
        const result = await mydb.execute(
            user_query.signup, 
            [id, crypto_pass, name, company, address, privatekey]
        )
        console.log('/signup - DB result ', result)
        // 로그인 화면으로 되돌아간다. 
        res.redirect('/user')
    })

    // 로그아웃 api 생성 
    router.get("/logout", function(req, res){
        // 로그아웃의 의미는? -> session 안에 있는 데이터를 삭제(파괴)
        req.session.destroy(function(err){
            if(err){
                console.log(err)
            }
            // redirect(url) : url로 요청을 보낸다.
            // redirect('/') : localhost:3000/로 요청을 보낸다. 
            res.redirect('/')
        })
    })


    // 마일리지 충전 화면 api 
    router.get('/charge', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            res.render('charge', {
                'login_data' : req.session.logined
            }
            )
        }
    })

    // 관리자가 유저에게 토큰을 전송하는 부분
    router.get('/charge2', async function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // 유저가 보낸 토큰의 양을 변수에 대입
            const amount = Number(req.query._amount)
            console.log("/charge2 - amount = ", amount)
            const address = req.session.logined.wallet_address
            // reference에 있는 kip.js의 transfer() 함수를 호출
            const result = await kip7.transfer(address, amount)
            console.log('/charge2 - kip7 transfer = ', result)
            // 충전이 완료되었으면 main('/')으로 이동
            res.redirect('/')
        }

    })

    // 유저가 관리자에게 토큰을 전송하는 부분(2가지 방법) -> 장부를 등록했을 때
    // transfer(받은 사람의 지갑 주소, 보내는 양 { from  : 보내는 사람의 지갑 주소}) -> 보내는 사람이 수수료 발생
    // transferfrom() -> 보내는 사람과 받은 사람이 아니라 임의의 지갑에서 수수료를 발생 -> error 발생
    // transferfrom()을 사용하기 위해서는 aprrove() 함수를 이용하여 승인을 받고 트랜젠셜을 발생


    return router
}