// mysql에 접속 
const mysql = require('mysql2')

require('dotenv').config()

const pool = mysql.createPool({
    host : process.env.host,  // 127.0.0.1 : 내 컴퓨터(localhost)
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.db_pass, 
    database : process.env.db_name
})

const connection = pool.promise() 

module.exports = async function (sql, values = []){
    // 인자값들을 받아와서 mysql에 sql쿼리문을 실행하고 결과 값을 받아오는 부분
    const [result, field] = await connection.execute(sql, values)

    // sql 쿼리문이 select문이라면 
    if (sql.trim().toLowerCase().startsWith('select')){
        console.log("execute result console : ",  result)
        return [result]
    }else{
        return 'Query Ok'
    }
}

