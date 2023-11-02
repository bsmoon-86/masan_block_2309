// 카테고리 로드하는 sql 
const category = `
    select 
    * 
    from 
    account_category
    where
    type = ?
`

module.exports={
    category
}