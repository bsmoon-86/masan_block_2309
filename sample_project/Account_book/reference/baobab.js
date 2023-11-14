// baobab testnet에 배포한 smartcontract를 연동하기 위한 라이브러리 로드
// 이더리움 네트워크에서 smartcontract를 연동하기 위한 라이브러리의 이름은? web3
// caver-js는 이더리움 환경에서 web3 동일한 역할 
const Caver = require('caver-js')
// 배포된 smartcontract의 정보를 로드
// 상대 경로를 이용하여 Account.json 파일 로드 
// 상위 폴더로 이동(../) ->  build 하위 폴더로 이동(build/) -> 
// contracts 하위폴더로 이동(contracts/) -> Account.json 
const contract_info = require("../build/contracts/Account.json")
// smartcontract가 배포 된 주소를 입력
const caver = new Caver('https://api.baobab.klaytn.net:8651')
// 배포 된 주소에서 smartcontract를 연동
const smartcontract = new caver.klay.Contract(
    contract_info.abi, 
    contract_info.networks['1001'].address
)

// dotenv를 로드 config()
require('dotenv').config()


// 지갑의 정보를 등록 
const account = caver.klay.accounts.createWithAccountKey(
    process.env.public_key, 
    process.env.private_key
)
caver.klay.accounts.wallet.add(account)


// 배포한 smartcontract는 3개의 함수가 존재

// 월별 장부를 등록하는 함수 생성 
async function add_data(
    _company, 
    _date, 
    _purchase_vat, 
    _purchase_cost, 
    _sales_vat, 
    _sales_cost, 
    _register
){
    // smartcontract안에 있는 add_book()함수를 호출
    const result = await smartcontract
        .methods
        .add_book(
            _company, 
            _date, 
            _purchase_vat, 
            _purchase_cost, 
            _sales_vat, 
            _sales_cost, 
            _register
        )
        // call(), send()
        .send({
            from : account.address, 
            gas : 2000000
        })
    
    console.log('BC - add_book() result -', result)
    return "add data success"
}

// 뷰 함수1 : 월별 장부의 정보를 출력하는 함수
async function view_data(
    _company, 
    _date
){
    // smartcontract에 있는 view_book() 함수를 호출
    const result = await smartcontract
                    .methods
                    .view_book(
                        _company, 
                        _date
                    )
                    .call()

    console.log('BC - view_data() result -', result)
    return result
}

// 뷰 함수2 : 회사별 등록된 장부의 리스트를 출력하는 함수 
async function view_list(
    _company
){
    // smartcontract에 있는 view_book_list() 함수를 호출
    const result = await smartcontract
                    .methods
                    .view_book_list(
                        _company
                    )
                    .call()

    console.log('BC - view_list() result -', result)
    return result
}

// 해당하는 module에서 외부에서 사용할 수 있도록 함수를 지정 
module.exports = {
    add_data, 
    view_data, 
    view_list
}