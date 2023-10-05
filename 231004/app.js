// express 모듈 로드 
const express = require('express')
const app = express()

// 뷰 파일들의 기본 경로를 설정, 뷰 엔진 설정
// __dirname : 현재 파일의 경로 
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

// 포트번호: 내 컴퓨터에서 특정한 번호로 요청이 들어올 시 웹서버를 보여준다. 
const port = 3000

// post 방식으로 요청 메시지를 받는 경우 json형태로 데이터를 받아온다. 
app.use(express.urlencoded(
    {
        extended : false
    }
))

// web3 모듈을 로드 
const Web3 = require('web3')
// 스마트 컨트렉트가 배포되어있는 네트워크를 지정(가나슈 private network)
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))

// 스마트 컨트렉트의 정보가 저장되어있는 json 파일을 로드 
// (build 하위폴더로 이동 -> contracts 하위폴더 이동 -> User.json)
const contract_info = require("./build/contracts/User.json")
/* 
    contract_info -> {
        'abi' : [......], 
        'networks : {
            '5777' : {
                'address' : 0x0000000000
            }
        }
    }

*/
// const abi = contract_info['abi']
const contract_abi = contract_info.abi
const contract_address = contract_info.networks['5777'].address
// const contract_address = contract_info.networks.5777.address
console.log(contract_address)

// 배포한 스마트 컨트렉트와 연결
// new : Class 생성
const smartcontract = new web3.eth.Contract(
    contract_abi, 
    contract_address
)

// api 생성 -> 요청 목록
app.get("/", function(req, res){
    // req : 유저가 서버에게 보낸 요청 메시지
    // res : 서버가 유저에게 보내는 응답 메시지
    // 문자열을 응답하는 방법
    // res.send('Hello World')
    // 퓨 파일을 응답하는 방법
    res.render('index.ejs')
})

// 로그인 페이지로 이동하는 api
app.get("/signin", function(req, res){
    res.render('signin.ejs')
})
// 회원가입 페이지로 이동하는 api
app.get("/signup", function(req, res){
    res.render('signup.ejs')
})

// 로그인 정보를 확인하여 로그인 성공 실패 여부를 확인하는 api 
app.get("/signin2", function(req, res){
    // 유저가 서버에게 보낸 데이터를 변수에 대입 
    // get 방식으로 보낸 데이터는 req안에 query : { _id : id, _pass : password }
    // console.log(req)
    console.log(req.query)
    const _id = req.query._id
    const _pass = req.query._pass
    console.log(_id, _pass)

    // smartcontract는 가나슈네트워크에 배포한 컨트렉트의 정보
    smartcontract
    // .methods는 컨트렉트 안에 있는 함수들
    .methods
    // .view_user()라는 함수를 호출
    .view_user(_id)
    // 데이터가 변경이 되는것이 아니라 데이터를 조회하는 함수 -> transaction이 발생하지 않는다. -> 수수료가 발생하지 않는다. 
    .call()
    .then(function(result){
        console.log(result['password'])
        // result['password'] -> 가나슈네트워크에 저장되어있는 유저의 비밀번호
        // _pass : 유저가 입력한 비밀번호
        if (_pass == result['password']){
            res.send('로그인 성공')
        }else{
            res.send('로그인 실패')
        }
    })

    // 유저가 입력한 _id 값을 smartcontract에 있는 view_user() 함수의 매개변수로 호출한 결과 값이
    // users라는 mapping data에 있는 특정 키(유저가 입력한 id값) 값의 데이터(user_info라는 구조체)를 되돌려준다. 
    // user_info는 id, password, name, tel, loc, gender, email, abled의 키값을 가지는 데이터
    // user_info 안에 있는 password의 값과 유저가 입력한 _pass의 값이 같다면 로그인이 성공

    // 같지 않다면 로그인이 실패

    // mapping data의 구조 -> { key  : value , key2 : value2 }
    // mapping ( string => uint ) ->  {  key(string) : value(uint), key2(string) : value2(uint) }
    // struct 구조체(데이터 타입) -> { key : value, key2 : value2 }
    // { name : 'test', age : 20 }
    // struct ( string name; uint age; ) -> { name : value(string), age : value2(uint) }
    /* mapping (string => struct) -> 
    { 
        key(string타입) : { 
            name : value(string타입), 
            age : value2(uint타입)
        }, 
        key2(string타입) : {
            name : value(string타입), 
            age : value2(uint타입)
        }
    }

    */

})

// 회원가입 정보를 받아오는 api 생성 
app.post("/signup2", function(req, res){
    // post 방식으로 데이터를 보내는 경우에는 req.body
    console.log(req.body)
    const _id = req.body._id
    const _pass = req.body._pass
    const _name = req.body._name
    const _tel = req.body._tel
    const _loc = req.body._loc
    const _gender = req.body._gender
    const _email = req.body._email
    console.log(_id, _pass, _name, _tel, _loc, _gender, _email)

    // 스마트 컨트렉트에 있는 add_user()함수 호출
    // add_user() 함수는 데이터를 수정하는 함수 -> trasaction 발생 -> 수수료가 발생
    smartcontract
    // methods -> 배포한 컨트렉트에 함수들(add_user(), update_user(), check_id())
    .methods
    .add_user(_id, _pass, _name, _tel, _loc, _gender, _email)
    .send(
        {
            // 누가 지불할것인가? (가나슈에 있는 첫번째 지갑 주소)
            from : '0x56B99AFCdB2341b87515D501546b138Bf094F25F',
            // 최대 얼마까지 지불할것인가?
            gas : 2000000
        }
    )
    .then(function(result){
        console.log(result)
        // 로그인 페이지로 이동
        res.redirect('/signin')
    })

})


// 웹서버 실행
app.listen(port, function(){
    console.log('Port : ' + port + ' Server Start')
})