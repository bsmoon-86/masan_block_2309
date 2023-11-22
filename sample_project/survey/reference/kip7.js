// caver-js-ext-kas 라이브러리 로드 
const CaverExtKas = require('caver-js-ext-kas')

// class 생성
const caver = new CaverExtKas()

// fs 모듈 로드 
const fs = require('fs')

require('dotenv').config()

// KAS에 접속하기 위한 ID, PASSWORD 파일을 로드 
// AccessKey, Secret AccessKey 정보를 가진 파일의 경로?
// 상위 폴더로 이동(../) -> kas 하위 폴더로 이동(kas/) -> kas.json
const kas_info = require('./kas.json')
const accesskeyID = kas_info.accessKeyId
const secretAccessKey = kas_info.secretAccessKey
// baobab testnet chainID 지정
const chainID = 1001
console.log(accesskeyID, secretAccessKey)

// kas api 에 정보를 저장하는 함수
caver.initKASAPI(chainID, accesskeyID, secretAccessKey)

// KAS에서 외부의 지갑(klaytn wallet으로 만든 지갑)을 사용하기 위한 지갑 등록
// KAS에서 제공하는 wallet 기본 툴이 존재
// klaytn에서 제공하는 wallet 기본 툴이 존재
const keyringContainer = new caver.keyringContainer()
// 외부의 privateKey값을 이용하여 Container에 저장될 수 있게 지갑의 정보를 호출하여 대입

// keyringContainer에서 사용할 수 있도록 지갑의 형태를 변경(parsing)
const keyring = keyringContainer.keyring.createFromPrivateKey(
    process.env.private_key
)

keyringContainer.add(keyring)

// 토큰을 발행하는 함수 생성
async function create_token(_name, _symbol, _decimal, _amount, _path){
    console.log(_name, _symbol, _decimal, _amount)
    // KAS에서 제공하는 함수형태로 ERC20 token을 생성하는 방법
    // kip7 토큰 : 이더리움 환경에서 ERC20 토큰과 같은 성질을 가지고 있다. 
    // ERC20 토큰의 특징 : 거래가 가능한 화폐(조건 : 내 지갑에 있는 토큰은 나만이 보내줄수 있다.(예외는 존재))
    const kip7 = await caver.kct.kip7.deploy(
        {
            name : _name,       // 토큰의 이름
            symbol : _symbol,   //토큰의 심볼
            decimals : Number(_decimal),    // 토큰의 소수점 자리수
            initialSupply : _amount         // 토큰의 발행량
        }, 
        keyring.address,        // 컨트렉트를 배포할 지갑의 주소
        keyringContainer        // Container를 지정(KAS wallet에서 제공하는 지갑의 주소가 아니므로)
    )
    // kip7 데이터에서 토큰 주소 값은 파일로 따로 저장 
    const addr = kip7._address
    console.log(kip7)
    // 토큰의 주소 값을 json 파일로 저장 
    const kip7_address = {
        address : addr
    }
    // json데이터를 문자형으로 변환 
    const data = JSON.stringify(kip7_address)
    // 파일로 저장
    fs.writeFileSync(_path, data)
    return '토큰 발행 완료'
}

// 토큰을 사용할 지갑들을 생성하는 함수 
async function create_wallet(){
    // KAS에서 제공하는 wallet
    // const account = await caver.kas.wallet.createAccount()
    // klaytn에서 제공하는 wallet
    const keyring2 = await caver.wallet.keyring.generate()
    // console.log('KAS에서 제공하는 walllet 생성', account)
    console.log('Klaytn에서 제공하는 wallet 생성', keyring2)
    /* 
        keyring2 -> {
            _address : 지갑주소, 
            _key : {
                _privateKey : privatekey
            }
        }
    */
   const wallet_address = keyring2._address
   const private_key = keyring2._key._privateKey
    return [wallet_address, private_key]
}   

async function transfer(_receiver, _amount){
    // _receiver : 토큰은 받는 지갑의 wallet_addess
    // _amount : 보내는 토큰의 양
    
    // 어떠한 kip7 토큰을 사용할것인가
    const kip7_info = require('./kip7.json')
    const kip7 = await new caver.kct.kip7(kip7_info.address) 
    kip7.setWallet(keyringContainer)
    
    const receipt  = await kip7.transfer(
        _receiver, 
        _amount, 
        {
            from : keyring.address
        }
    )
    console.log('Trasfer result :', receipt)
    return "토큰 거래 완료"
}
// 유저가 관리자에게 토큰을 전송하는 함수
async function payment(_sender, _amount = 1){
    // _sender는 유저의 private_key
    // 해당하는 keyring을 keyringContainer 추가
    // 어떠한 kip7 토큰을 사용할것인가
    const kip7_info = require('./kip7.json')
    const kip7 = await new caver.kct.kip7(kip7_info.address) 
    kip7.setWallet(keyringContainer)
    // 유저의 private_key를 이용하여 keyring의 형태로 변경
    const keyring2 =keyringContainer.keyring.createFromPrivateKey(
        _sender
    )
    console.log('keyring data form :', keyring2)
    keyringContainer.add(keyring2)
    const receipt = await kip7.transfer(
        keyring.address, // 관리자의 지갑 주소
        _amount, 
        {
            from : keyring2.address
        }
    )
    console.log('payment result :', receipt)
    return '토큰 지불 완료'
}
// 유저가 관리자에게 토큰 사용 권한을 주고 관리자가 transfer를 호출
async function transferfrom(_sender, _amount){
    const kip7_info = require('./kip7.json')
    const kip7 = await new caver.kct.kip7(kip7_info.address) 
    kip7.setWallet(keyringContainer)
    const sender = keyringContainer.keyring.createFromPrivateKey(
        _sender
    )
    console.log(sender)
    keyringContainer.add(sender)
    
    
    //  approve()함수를 이용하여 토큰에 대한 사용 권한이 지급
    // approve(권한을 받는 지갑의 주소, 토큰의 양, {from : 유저의 지갑})
    const approve_result = await kip7.approve(
        keyring.address, 
        1, 
        {
            from : sender.address
        }
    ) 
        console.log(approve_result)
    const result  = await kip7.transferFrom(
        // 보내는 사람의 지갑 주소
        sender.address, 
        // 받는 사람의 지갑 주소
        keyring.address, 
        1,
        {
            from : keyring.address
        }
    )
    console.log(result)
    return '거래 완료'
}

// 토큰의 양을 확인하는 함수 
async function balance(_address){
    // 토큰의 정보를 로드 
    const token_info = require('./kip7.json')
    const token = token_info.address
    const kip7 = await new caver.kct.kip7(token)
    kip7.setWallet(keyringContainer)
    // 잔여량을 체크하는 함수 호출 (데이터 변화 x)
    const amount = await kip7.balanceOf(_address)
    console.log('BalanceOf result :', amount)
    return amount
}

module.exports = {
    create_token, 
    create_wallet, 
    transfer, 
    balance, 
    payment, 
    transferfrom
}