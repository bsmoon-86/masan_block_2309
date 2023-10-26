// mysql2 라이브러리 로드 
const mysql = require('mysql2')

// mysql class 선언
class Mysql{

    // 생성자 함수 : 데이터베이스 서버의 정보를 저장
    constructor(_host, _port, _user, _pass, _db){
        this.pool = mysql.createPool({
            host : _host, 
            port : _port, 
            user : _user, 
            password : _pass, 
            database : _db
        })
        // promice() : 비동기 처리방식
        this.connection = this.pool.promise()
    }

    // sql 쿼리문을 실행하고 결과 값을 받아오는 함수 생성
    async execute(_sql, _value = []){
        // sql 쿼리문을 실행하고 결과 값을 result에 대입
        const [result, field] = await this.connection.execute(_sql, _value)
        console.log("execute field : ", field)
        // sql 쿼리문이 select 문이라면
        if (_sql.trim().toLowerCase().startsWith('select')){
            console.log("execute result :", result)
            return result
        }else{
            return 'Query OK'
        }
    }
}

module.exports = {Mysql}