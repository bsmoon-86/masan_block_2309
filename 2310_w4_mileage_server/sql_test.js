// sql_class 파일을 로드 
const sql_class = require("./reference/sql_class")

// Mysql class 생성 (host, port, name, password, db_name)

// class1이라는 class는 내 컴퓨터의 데이터베이스에 연동
const class1 = new sql_class.Mysql(
    'localhost', 
    3306, 
    'root', 
    '1234', 
    'blockchain'
)

// class2라는 class는 외부의 컴퓨터에 있는 데이터베이스 연동
const class2 = new sql_class.Mysql(
    'darkpreist.iptime.org', 
    3306, 
    'ubion', 
    '1234', 
    'ubion'
)

sql = `
    select 
    * 
    from 
    user
`

console.log(class1.execute(sql))
console.log(class2.execute(sql))