// 카테고리 로드하는 sql 
const category = `
    select 
    * 
    from 
    account_category
    where
    type = ?
`

// 매출 장부 데이터 삽입 sql
const insert_sales = `
    insert into 
    account_sales(
        company, 
        code, 
        bisiness,
        unit_name, 
        unit_sold, 
        amount, 
        units_cost, 
        vat, 
        writer, 
        year, 
        month, 
        day, 
        create_dt, 
        etc
    )
    values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`

// 매입 장부 데이터 삽입 sql
const insert_purchase = `
    insert into 
    account_purchase(
        company, 
        code, 
        bisiness,
        unit_name, 
        unit_sold, 
        amount, 
        units_cost, 
        vat, 
        writer, 
        year, 
        month, 
        day, 
        create_dt, 
        etc
    )
    values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`

// 부가세 확인하는 sql 
const check_vat = `
        select 
        vat 
        from 
        account_category 
        where 
        code = ?
`

// 장부의 정보를 로드 
const purchase_list = `
        select 
        * 
        from 
        account_purchase
        where 
        company = ? 
`
const sales_list = `
        select 
        * 
        from 
        account_sales
        where 
        company = ?
`

// purchase table를 그룹화 연산 query
const purchase_month = `
        select 
        year, 
        month, 
        code, 
        SUM(units_cost)
        from 
        account_purchase
        where 
        year = ? 
        and
        month = ?
        group by 
        code
`

module.exports={
    category, 
    insert_purchase, 
    insert_sales, 
    check_vat, 
    purchase_list, 
    sales_list
}