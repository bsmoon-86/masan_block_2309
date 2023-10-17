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
// table 생성하는 sql 쿼리문을 작성 

const sql = `
    CREATE TABLE 
    IF NOT EXISTS 
    user(
        id varchar(32) primary key, 
        password varchar(32) not null, 
        name varchar(32) not null
    )
`

const sql2 = `
    CREATE TABLE 
    IF NOT EXISTS
    user_info(
        id varchar(32) primary key, 
        age int, 
        gender int, 
        phone varchar(45),
        FOREIGN KEY (id) 
        REFERENCES user(id)
    )
`

const sql3 = `
    CREATE TABLE 
    IF NOT EXISTS
    board (
        No int auto_increment primary key, 
        title varchar(45) not null, 
        writer varchar(32) not null, 
        content TEXT not null, 
        create_dt varchar(32) not null
    )
`

// sql 쿼리문을 실행하는 함수 생성
async function execute_sql(){
    connection.execute(sql)
    connection.execute(sql2)
    connection.execute(sql3)
    return 'query ok'
}

module.exports = {execute_sql}