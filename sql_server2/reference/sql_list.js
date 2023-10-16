// sql 쿼리문들을 작성 
const login_query = `
    SELECT 
    * 
    FROM 
    user 
    WHERE 
    id = ? AND password = ?
`
const signup_query = `
    INSERT INTO 
    user 
    VALUES 
    (?, ?, ?)
`
const info_add_query = `
    INSERT INTO 
    user_info 
    VALUES 
    (?, ?, ?, ?)
`
const check_id_query = `
    SELECT 
    * 
    FROM 
    user
    WHERE 
    id = ?
`
module.exports = {
    login_query, 
    signup_query, 
    info_add_query, 
    check_id_query
}