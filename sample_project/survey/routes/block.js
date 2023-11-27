const express = require('express')
const Caver = require('caver-js')
const router = express.Router()

// sql_class 호출
const sql_class = require('../reference/sql_class')

// class 생성
const mydb = new sql_class.Mysql()


// blockchain 기본 설정 

// contract의 정보가 저장되어 있는 파일을 로드 
const contract_info = require("../build/contracts/Survey.json")

const abi = contract_info.abi
const constract_address = contract_info.networks['1001']['address']

// contract가 배포되어 있는 네트워크 주소를 입력 
const caver = new Caver('https://api.baobab.klaytn.net:8651')

// 배포한 contract를 로드 
const smartcontract = new caver.klay.Contract(
    abi, 
    constract_address
)

// 지갑 등록 
const account = caver.klay.accounts.createWithAccountkey(
    process.env.public_key, 
    process.env.private_key
)
caver.klay.accounts.wallet.add(account)
