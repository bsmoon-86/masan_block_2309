const express = require('express')

const router = express.Router()

// user smartcontract를 연동 
const Web3 = require('web3')

// contract가 배포된 네트워크 주소를 입력
const web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:7545')
)

// User contract의 정보가 담겨있는 json 파일 로드 
// 상위 폴더 이동 -> build 하위 폴더 이동 -> contract 하위 폴더 이동 -> User.json
const contract_info = require("../build/contracts/User.json")

// contract와의 연결
const smartcontract = new web3.eth.Contract(
    contract_info.abi, 
    contract_info.networks['5777'].address
)

let address
web3.eth.getAccounts(function(err, ass){
    if(err){
        console.log(err)
    }else{
        console.log(ass)
        address = ass
    }
})

module.exports = function(){

    // localhost:3000/user가 기본 경로

    // 로그인 api 생성
    router.post("/", async function(req, res){
        // 유저가 보낸 id와 password 값을 변수에 할당 & 확인
        const id = req.body._id
        const pass = req.body._pass
        console.log(id, pass)
        // smartcontract의 view_user()함수를 호출하여 password의 값을 비교
        const result = await smartcontract
                        .methods
                        .view_user(id)
                        .call()
        // result의 데이터의 형태 -> 회원 정보가 들어있는 데이터의 형태
        console.log(result)
        // 회원 정보의 password와 유저가 보낸 password의 값이 같은 경우 로그인이 성공(게시판의 목록들을 볼수 있는 /board 이동)
        if (result['password'] == pass & pass.length != 0 & result['id'] == id){
            // session에 회원 정보를 저장
            req.session.logined = result
            res.redirect("/board")
        }
        // 같지 않다면 로그인이 실패(로그인 화면으로 되돌아간다. /로 이동 )
        else{
            res.redirect("/")
        }
    })

    router.get("/signup", function(req, res){
        res.render('signup.ejs')
    })

    router.get("/check_id", async function(req, res){
        // 유저가 보낸 id  값을 변수에 할당하고 확인
        const id = req.query._id
        console.log(id)
        // 유저가 보낸 id 값이 사용이 가능한가?
        // smartcontract에 있는 check_id()함수를 호출하여 아이디 사용 유무를 파악
        const result = await smartcontract
                            .methods
                            .check_id(id)
                            .call()
        // result의 데이터의 형태? -> bool의 형태의 데이터 사용가능한 아이디는 true 사용 불가 아이디면 false
        console.log(result)
        if(result){
            // 사용이 가능한 경우 -> 회원 정보를 입력하는 페이지로 이동
            res.render('signup2.ejs', {
                'server_id' : id
            })
        }else{
            // 사용이 불가능한 경우 -> 아이디 중복체크 화면으로 되돌아간다. 
            res.redirect('/signup')
        }
    })

    // 회원 정보를 가지고와서 회원 가입을 하는 api
    router.post('/signup2', async function(req, res){
        // 유저가 보낸 회원 정보를 변수에 대입 확인
        const id = req.body._id
        const password = req.body._pass
        const name = req.body._name
        const tel = req.body._tel
        const loc = req.body._loc
        const gender = req.body._gender
        const email = req.body._email
        console.log(id, password, name, tel, loc, gender, email)
        const result =  await smartcontract
                        .methods
                        .add_user(
                            id, password, name, tel, loc, gender, email
                        )
                        .send(
                            {
                                from : address[0], 
                                gas : 2000000
                            }
                        )
        console.log(result)
        res.redirect("/")
    })

    // 로그아웃 api 생성
    router.get("/logout", function(req, res){
        req.session.destroy(function(err){
            if(err){
                console.log(err)
            }else{
                res.redirect('/')
            }
        })
    })

    // 회원 탈퇴 api(localhost:3000/user/delete_user) 생성
    router.get('/delete_user', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // status 값이 존재하는 경우 
            if(req.query.status){
                result = '패스워드가 일치하지 않습니다.'
            }
            // 존재하지 않는 경우
            else{
                result = ''
            }
            res.render('delete_user.ejs', {
                'data' : result
            })
        }
    })

    router.post('/delete_user2', async function(req, res){
        if(!req.session.logined){
            res.redirect("/")
        }else{
            // 유저가 보낸 패스워드를 변수에 대입 확인
            const password = req.body._pass
            console.log(password)
            // 유저가 입력한 패스워드와 로그인을 한 정보의 패스워드가 같은가?
            if(password == req.session.logined[1]){
                // smartcontract 안에 있는 delete_user()함수 호출
                const result = await smartcontract
                                .methods
                                .delete_user(
                                    req.session.logined[0], 
                                    password
                                )
                                .send(
                                    {
                                        from : address[0], 
                                        gas : 2000000
                                    }
                                )
                console.log(result)
                res.redirect('/user/logout')
            }else{
                // res.send('패스워드가 맞지 않습니다.')
                res.redirect('/user/delete_user?status=F')
            }
        }
    })


    return router
}