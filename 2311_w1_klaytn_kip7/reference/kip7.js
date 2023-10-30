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
const kas_info = require('../kas/kas.json')
const accesskeyID = kas_info.accessKeyId
const secretAccessKey = kas_info.secretAccessKey
// baobab testnet chainID 지정
const chainID = 1001
console.log(accesskeyID, secretAccessKey)

// kas api 에 정보를 저장하는 함수
caver.initKASAPI(chainID, accesskeyID, secretAccessKey)

// KAS에서 외부의 지갑(klaytn wallet으로 만든 지갑)을 사용하기 위한 지갑 등록
const keyringContainer = new caver.keyringContainer()
// 외부의 privateKey값을 이용하여 Container에 저장될 수 있게 지갑의 정보를 호출하여 대입
const keyring = keyringContainer.keyring.createFromPrivateKey(
    process.env.private_key
)

keyringContainer.add(keyring)

// 토큰을 발행하는 함수 생성
async function create_token(_name, _symbol, _decimal, _amount){
    console.log(_name, _symbol, _decimal, _amount)
    const kip7 = await caver.kct.kip7.deploy(
        {
            name : _name, 
            symbol : _symbol, 
            decimals : Number(_decimal), 
            initialSupply : _amount
        }, 
        keyring.address, 
        keyringContainer
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
    fs.writeFileSync("./kas/kip7.json", data)
    return '토큰 발행 완료'
}

module.exports = {create_token}