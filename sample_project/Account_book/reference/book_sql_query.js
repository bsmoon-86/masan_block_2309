// 카테고리 로드하는 sql 
const category = `
    select 
    * 
    from 
    account_category
    where
    type = ? 
    and 
    company in ('0', ?)
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
        SELECT bisiness, unit_name, 
        min(unit_sold) as sold,
        sum(amount) as amount, 
        sum(units_cost) as cost, 
        sum(vat) as vat
        FROM account_purchase 
        where concat(year, month) = ? and company = ?
        group by bisiness, unit_name
        order by bisiness, unit_name;
`
const sales_month = `
        SELECT bisiness, unit_name, 
        min(unit_sold) as sold,
        sum(amount) as amount, 
        sum(units_cost) as cost, 
        sum(vat) as vat
        FROM account_sales 
        where concat(year, month) = ? and company = ?
        group by bisiness, unit_name
        order by bisiness, unit_name;
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

const period_purchase = `
        select 
        * 
        from 
        account_purchase
        where 
        company = ? 
        AND
        concat(year, month) >= ?
        AND
        concat(year, month) <= ?
`
// ex) 202211 ~ 202303 데이터를 확인한다 -> 202211 크거나 같고 202303보다 작거나 같은 값

const period_sales = `
        select 
        * 
        from 
        account_sales 
        where 
        company = ? 
        AND
        concat(year, month) >= ?
        AND
        concat(year, month) <= ?
`

const period_purchase_sum = `
        select 
        sum(vat) as vat, 
        sum(units_cost) as cost
        from 
        account_purchase
        where 
        company = ? 
        AND
        concat(year, month) >= ?
        AND
        concat(year, month) <= ?
`

const period_sales_sum = `
        select 
        sum(vat) as vat, 
        sum(units_cost) as cost
        from 
        account_sales
        where 
        company = ? 
        AND
        concat(year, month) >= ?
        AND
        concat(year, month) <= ?
`

const add_category = `
        insert 
        into 
        account_category(
                type,
                code, 
                name, 
                vat,
                company 
        ) 
        values (
                ?, ?, ?, ?, ?
        )
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
    auto_bisiness2, 
    period_purchase, 
    period_sales, 
    period_purchase_sum, 
    period_sales_sum, 
    add_category
}