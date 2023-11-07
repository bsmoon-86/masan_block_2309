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
        bisiness, 
        code, 
        SUM(vat) as vat,
        SUM(units_cost) as cost
        from 
        account_purchase
        where 
        year = ? 
        and
        month = ?
        group by 
        blockchain.account_purchase.bisiness,
        blockchain.account_purchase.code
`
const sales_month = `
        select 
        bisiness, 
        code, 
        SUM(vat) as vat,
        SUM(units_cost) as cost
        from 
        account_sales
        where 
        year = ? 
        and
        month = ?
        group by 
        blockchain.account_sales.bisiness,
        blockchain.account_sales.code
`

// 자동 완성을 위한 query
const auto_bisiness = `
        select 
        distinct 
        bisiness 
        from 
        account_purchase
        where 
        company = ?
`

const auto_bisiness2 = `
        select 
        distinct 
        bisiness 
        from account_sales 
        where 
        company = ?
`

module.exports={
    category, 
    insert_purchase, 
    insert_sales, 
    check_vat, 
    purchase_list, 
    sales_list, 
    purchase_month, 
    sales_month,
    auto_bisiness, 
    auto_bisiness2
}