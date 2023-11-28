const express = require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({
    extended : true
}))

// ejs에서 참조할 외부의 파일들의 기본 경로 설정 
app.use(express.static('public'))

// dotenv 설정 
require('dotenv').config()

// session 설정
const session = require('express-session')

app.use(
    session(
        {
            secret : process.env.session_key, 
            resave : false, 
            saveUninitialized : false, 
            cookie : {
                maxAge : 300000
            }
        }
    )
)


// 상단의 메뉴바를 테스트하는 api 생성
// localhost:3000/ 요청시 -> index.ejs 유저에게 보낸다.
// index.ejs 파일 안에 보면 menu.ejs포함
// index.ejs, menu.ejs를 모두 유저에게 보낸다. 
app.get('/', function(req, res){
    // 세션에 데이터가 존재하지 않는 경우 
    if(!req.session.logined){
        res.render('index', {
            'login' : false , 
            'name' : ''
        })
    }else{
        res.render('index', {
            'login' : true, 
            'name' : req.session.logined.name
        })
    }
})

// localhost:3000/user 주소로 요청이 들어온다면 
// routes폴더에 있는 user.js 파일을 사용
const user = require("./routes/user")()
app.use('/user', user)

// 설문에 관련한 api들을 survey.js에서 관리 
// api들을 localhost:3000/survey로 시작하는 주소로 설정 
const survey = require('./routes/survey')()
app.use('/survey', survey)

// blockchain 관련 api들을 block.js에서 관리 
// api들을 localhost:3000/block로 시작하는 주소로 설정
const block = require("./routes/block")()
app.use('/block', block)


// 비동기 통신 api들은 ajax.js에서 관리 
// 비동기 통신 api는 localhost:3000/ajax 로 시작하는 주소로 설정 
const ajax = require('./routes/ajax')()
app.use('/ajax', ajax)


app.listen(3000, function(){
    console.log('Server Start')
})


/* 
    흐름도
    
    - 회원 관련
        - main page(localhost:3000) 회원정보가 존재하면 로그인
            - 유저가 입력한 id, password 데이터를 localhost:3000/user/login으로 데이터를 보낸다
            - routers/user.js에서 /login으로 주소를 만들어둔 함수가 실행
            - 유저가 입력한 데이터를 변수에 대입
            - sql_class를 이용하여 DB에 연결
            - 유저가 입력한 id, password가 모두 일치하는 데이터가 존재하는지 확인 
                - 데이터가 존재한다면 로그인 성공하고 session에 데이터를 저장
                - 데이터가 존재하지 않는다면 로그인 실패
            - 로그인이 성공적으로 완료 되었다면 로그아웃 시
            - localhost:3000/user/logout으로 요청을 보낸다. 
            - routes/user.js에서 /logout으로 주소를 만들어둔 함수가 실행 
            - session에 있는 logined를 삭제
        - 회원 정보가 존재하지 않는다면 회원 가입
            - 회원가입 화면으로 이동(localhost:3000/user/signup으로 요청)
            - 아이디를 입력하고 중복 체크를 클릭하면 
            - localhost:3000/ajax/check_user로 요청(비동기 통신) 보낸다. 
            - 유저가 입력한 id 값을 DB와 비교하여 값이 존제하지 않을때 회원 정보 화면이 출력
            - 회원 정보를 입력하고 제출 버튼 클릭 시 (localhost:3000/user/signup2)로 데이터와 함께 요청
            - routers/user.js에서 /signup2로 주소를 만들어둔 함수가 실행
            - 유저가 입력한 데이터를 변수에 대입 
            - sql_class를 이용하여 DB 연결
            - 유저가 입력한 데이터를 DB에 insert

    - 설문 관련
        - 설문 등록 
            - 로그인 데이터가 존재하는지 확인
            - 설문 관련 질문과 답변에 유저가 입력 할 수 있는 페이지(survey_regist) 응답메시지 보낸다.
            - 유저가 값을 입력하고 제출 버튼 클릭(localhost:3000/)
            - localhost:3000/survey/regist2 주소로 요청을 보낸다. 
            - routes/servey.js에서 /regist2로 만들어진 함수가 실행
            - 유저가 입력한 설문 내용들을 DB에 저장
        - 설문 답변
            - 로그인 데이터가 존재하는지 확인 
            - 설문 내역이 존재하는가?
            - 답변을 할수 있는 페이지를 보여준다.(survey_test)
            - 유저가 답을 입력하고 제출 버튼 클릭
            - 이때 생성되는 변수가 no, a1, a2, a3 생성
            - 생성되는 변수를 localhost:3000/block/submit에 보낸다
            - routes/block.js에서 /submit으로 만들어진 함수가 실행
            - 유저가 보낸 데이터들을 이용하여 blockchain, DB 저장
        - 등록된 설문 리스트 조회
            - DB에 저장된 설문 정보들을 로드 
            - survey_list에서 DB의 설문 정보들을 <table>를 이용하여 표시
*/
