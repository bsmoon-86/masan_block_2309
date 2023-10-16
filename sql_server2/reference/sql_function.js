// mysql에 접속 
const mysql = require('mysql2')

const pool = mysql.createPool({
    host : '127.0.0.1',  // 127.0.0.1 : 내 컴퓨터(localhost)
    port : 3306, 
    user : 'root', 
    password : '1234', 
    database : 'blockchain'
})

const connection = pool.promise() 

async function execute(sql, values = []){
    // 인자값들을 받아와서 mysql에 sql쿼리문을 실행하고 결과 값을 받아오는 부분
    const [result, field] = await connection.execute(sql, values)
    console.log(result)
    // sql 쿼리문이 select문이라면 
    if (sql.trim().toLowerCase().startsWith('select')){
        return result
    }else{
        return 'Query Ok'
    }
}

module.exports = {execute}