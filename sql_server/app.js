const express = require('express')
const app = express()

const port = 3000

// view 파일들의 기본 경로 설정
app.set('views', __dirname+'/views')
// view engine 설정 
app.set('view engine', 'ejs')
// post 방식으로 데이터가 들어올때 json 형태로 데이터를 로드 
app.use(express.urlencoded({extended:false}))

// express-session 모듈을 로드 
const session = require('express-session')

app.use(
    session(
        {
            secret : 'asdfg', 
            resave : false, 
            saveUninitialized : false, 
            cookie : {
                maxAge : 60000
            }
        }
    )
)



// 데이터베이스와 연결하기 위한 모듈을 로드 
const mysql = require('mysql2')

// express server에서 mysql server로 연결하기 위해
// mysql server 정보(서버의 주소, 서버의 포트, 유저명, 비밀번호, 데이터베이스)를 등록

// 231016 수정
const pool = mysql.createPool(
    {
        host : 'localhost', // 서버의 주소
        port : 3306, // 서버의 포트
        user : 'root', // 서버의 유저명
        password : '1234', // 서버의 패스워드
        database : 'blockchain' // 사용할 데이터베이스 선택
    }
)
const connection = pool.promise()

// 해당하는 데이터베이스에 user table이 존재하는가?
// 존재하지 않는다면 테이블 생성 
// 존재한다면 아무런 행동도 하지 않겠다. 

let create_table = `
    CREATE TABLE 
    IF NOT EXISTS
    user (
        id varchar(32) primary key, 
        password varchar(32) not null, 
        name varchar(32) not null
    )
`

// createPool 사용하는 경우

connection.execute(create_table)


// createConnection 사용하는 경우

// connection.query(
//     create_table, 
//     function(err, result){
//         if(err){
//             console.log(err)
//         }else{
//             console.log(result)
//         }
//     }
// )

// 함수 생성 -> 필요한 매개변수(sql, value) -> 매개변수 value는 데이터가 존재하는 경우와 존재하지 않는 경우  
async function sql_load(sql, value = []){
    const [result, field] = await connection.execute(
        sql, 
        value
    )
    // sql 매개변수에 입력이 되는 인자값의 좌우 공백을 제거하고 소문자로 변경한뒤 select로 시작하는가?
    if (sql.trim().toLowerCase().startsWith('select')){
        return_data = result
    }else{
        return_data = "Query OK"
    }
    return return_data
}


// 로그인 화면 api
app.get('/', function(req, res){
    res.render('index')
})

// 로그인 성공 여부 api 
app.post('/signin', async function(req, res){
    // 유저가 서버에게 보낸 정보를 변수 대입 & 확인
    const id = req.body._id
    const pass = req.body._pass
    console.log(id, pass)
    // 블록체인의 경우에서 로그인이 성공하는 조건 
    // id 값을 기준으로 하여 구조체 데이터를 리턴
    // 구조체 데이터에 있는 password의 항목과 유저가 입력한 password가 같은지 비교
    // 참이면 로그인 성공
    // 데이터베이스에서 로그인이 성공하는 조건
    // select 구문을 사용하여 아이디와 패스워드가 일치하는 데이터가 존재하는가?
    const sql  = `
        SELECT 
        * 
        FROM 
        user 
        WHERE 
        id = ? 
        AND
        password = ?
    `
    const values = [id, pass]
    await sql_load(sql, values).then(function(result){
        console.log(result)
        if(result[0]){
            // 로그인 성공시 session에 로그인 정보를 담아준다.
            // session은 유저에게 sid를 지급
            // 유저는 sid 서버에게 보낸다. 
            // 서버는 sid에 해당하는 데이터가 존재하는가 확인 
            // 존재한다면 해당 데이터를 유저에게 보낸다. 
            // blockchain을 이용해서 로그인 정보를 session에 대입
            // 유저의 정보의 데이터 형태 [id, password, name]
            // mysql을 이용하여 로그인 정보를 session 대입하는 경우
            // 유저의 정보 데이터 형태가 {id : xxx, password : xxxx, name : xxxx}
            req.session.logined = result[0] 
            // /main 이라는 주소로 이동
            res.redirect('/main')
        }else{
            // 로그인이 실패하는 경우 login_fail.html을 유저에게 보낸다.
            res.sendFile(__dirname + '/views/fail_login.html')
        }
    })
    // connection.query(
    //     sql, 
    //     values, 
    //     function(err, result){
    //         if(err){
    //             console.log(err)
    //         }else{
    //             // 로그인이 성공했을때 -> 배열 안에 데이터가 존재한다면? 데이터가 공란이 아니다
    //             // 로그인이 실패했을때
    //             console.log(result)
    //             if(result[0]){
    //                 res.send('로그인 성공')
    //             }else{
    //                 res.send('로그인 실패')
    //             }
    //         }
    //     }
    // )
})


// 회원 가입 화면 api
app.get('/signup', function(req, res){
    res.render('signup')
})

// 회원 정보를 받아와서 DB에 insert 
app.post('/signup', async function(req, res){
    // 유저가 서버에게 보낸 회원 정보를 변수에 대입 & 확인
    const id = req.body._id
    const pass = req.body._pass
    const name = req.body._name
    console.log(id, pass, name)

    // insert구문 생성
    const sql = `INSERT INTO user VALUES ("${id}", "${pass}", "${name}")`
    console.log(sql)
    const sql2 = `
        INSERT INTO 
        user 
        VALUES 
        (?, ?, ?)
    `
    const values = [id, pass, name]

    const result = await sql_load(sql2, values)
    console.log(result)
    res.redirect('/')

    // connection.query(
    //     sql2, 
    //     values, 
    //     function(err, result){
    //         if(err){
    //             console.log(err)
    //         }else{
    //             console.log(result)
    //             res.redirect('/')
    //         }
    //     }
    // )
})

app.get('/main', function(req, res){
    // 로그인 정보가 존재하지 않는다면 로그인 페이지로 되돌아간다.
    if(!req.session.logined){
        res.redirect('/')
    }else{
        console.log(req.session.logined)
        res.render('main', {
            'name' : req.session.logined.name
        })
    }
})


app.listen(port, function(){
    console.log('Server Start')
})