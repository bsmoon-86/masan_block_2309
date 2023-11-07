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


sql = `CREATE TABLE 
    IF NOT EXISTS
    account_category (
        no int NOT NULL AUTO_INCREMENT,
        type varchar(45) NOT NULL,
        code int NOT NULL,
        name varchar(45) NOT NULL,
        vat int NOT NULL,
        PRIMARY KEY (no)
    ) 
    ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`

sql2 = `CREATE TABLE 
    IF NOT EXISTS
    account_purchase (
        no int NOT NULL AUTO_INCREMENT,
        company varchar(45) NOT NULL,
        code int NOT NULL,
        bisiness varchar(45) NOT NULL,
        unit_name varchar(45) NOT NULL,
        unit_sold int NOT NULL,
        amount int NOT NULL,
        units_cost int NOT NULL,
        vat int NOT NULL,
        writer varchar(45) NOT NULL,
        year int NOT NULL,
        month int NOT NULL,
        day int NOT NULL,
        create_dt varchar(45) NOT NULL,
        etc text,
        PRIMARY KEY (no)
    ) 
    ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`

sql3 = `CREATE TABLE 
    IF NOT EXISTS 
    account_sales (
        no int NOT NULL AUTO_INCREMENT,
        company varchar(45) NOT NULL,
        code int NOT NULL,
        bisiness varchar(45) NOT NULL,
        unit_name varchar(45) NOT NULL,
        unit_sold int NOT NULL,
        amount int NOT NULL,
        units_cost int NOT NULL,
        vat int NOT NULL,
        writer varchar(45) NOT NULL,
        year int NOT NULL,
        month int NOT NULL,
        day int NOT NULL,
        create_dt varchar(45) NOT NULL,
        etc text,
        PRIMARY KEY (no)
    ) 
    ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`

sql4 = `CREATE TABLE
    IF NOT EXISTS 
    account_user (
        id varchar(32) NOT NULL,
        password text NOT NULL,
        name varchar(45) NOT NULL,
        company varchar(45) NOT NULL,
        wallet_address text NOT NULL,
        private_key text NOT NULL,
        PRIMARY KEY (id)
    ) 
    ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`

  
// sql 쿼리문을 실행하는 함수 생성
async function execute_sql(){
    connection.execute(sql)
    connection.execute(sql2)
    connection.execute(sql3)
    connection.execute(sql4)
    return 'query ok'
}

module.exports = {execute_sql}