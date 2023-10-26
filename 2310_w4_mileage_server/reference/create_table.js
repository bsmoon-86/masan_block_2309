const mysql = require('mysql2')

require('dotenv').config()


const pool = mysql.createPool({
    host : process.env.host, 
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.db_pass, 
    database : process.env.db_name
})

const connection = pool.promise()

const sql = `
    CREATE TABLE 
    IF NOT EXISTS
    mileage(
        id varchar(32) primary key, 
        mileage int not null
    )
`


module.exports = function (){
    connection.query(sql)
    console.log('module load')
    return 'table create'
}
