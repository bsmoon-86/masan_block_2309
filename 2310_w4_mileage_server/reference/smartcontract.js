// web3 라이브러리 로드 
const Web3 = require('web3')

// 환경변수를 사용하기 위해 dotenv 설정
require('dotenv').config()

// 컨트렉트가 배포된 네트워크를 등록 
const web3 = new Web3(new Web3.providers.HttpProvider(
    process.env.bc_host
))

// 컨트렉트의 정보(abi, contract address)가 저장되어 있는 파일을 로드 
// 상위 폴더 이동 -> build 하위 폴더 이동 -> contracts 하위 폴더 이동 -> Mileage.json
const contract_info = require("../build/contracts/Mileage.json")
const contract_abi = contract_info.abi
const contract_address = contract_info.networks['5777'].address

const smartcontract = new web3.eth.Contract(
    contract_abi, 
    contract_address
)

module.exports = {smartcontract}