// sql 쿼리문들을 작성 
const login_query = `
    SELECT 
    * 
    FROM 
    user 
    WHERE 
    id = ? AND password = ?
`

const info_query = `
    SELECT 
    * 
    FROM 
    user_info
    WHERE id = ?
`

// SQL 쿼리문에서 JOIN은 2개의 테이블의 정보를 특정한 조건에 맞춰서 결합하여 보여주는 형태
const join_login_query = `
    SELECT 
    user.id,
    user.password, 
    user.name, 
    user_info.age, 
    user_info.gender, 
    user_info.phone  
    FROM 
    user 
    LEFT JOIN 
    user_info 
    ON user.id = user_info.id
    WHERE user.id = ? AND user.password = ?
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
const add_info_query = `
    INSERT INTO 
    user_info 
    VALUES 
    (?, ?, ?, ?)
`
const add_content_query=`
    INSERT INTO 
    board (
        title, 
        content, 
        writer, 
        create_dt
    ) VALUES 
    (?, ?, ?, ?)
`
// board table의 모든 데이터를 로드 (조건 : No를 내림차순 정렬)-> ORDER BY '필드명' DESC
// DESC(describe)는 sql 쿼리문에서 테이블의 필드 정보를 출력하는 구문
// ORDER BY 뒤의 
//      DESC(descending) 내림차순 정렬 
//      ASC(ascending) 오름차순 정렬 (기본값)
const board_query = `
    SELECT 
    * 
    FROM 
    board
    ORDER BY No DESC
`

const view_content_query = `
    SELECT 
    * 
    FROM 
    board 
    WHERE 
    No = ?
`
const del_content_query = `
    DELETE 
    FROM 
    board
    WHERE 
    No = ?
`

const update_content_query=`
    UPDATE 
    board 
    SET 
    title = ?, 
    content = ?
    WHERE 
    No = ?
`

module.exports = {
    login_query, 
    signup_query, 
    info_add_query, 
    check_id_query, 
    add_info_query, 
    info_query, 
    join_login_query, 
    add_content_query, 
    board_query, 
    view_content_query, 
    del_content_query, 
    update_content_query
}