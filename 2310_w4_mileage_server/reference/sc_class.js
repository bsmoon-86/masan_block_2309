// Web3 라이브러리 
const Web3 = require('web3')
// dotenv 환경변수 설정
require('dotenv').config()

// 컨트렉트가 배포된 네트워크를 등록
const web3 = new Web3(new Web3.providers.HttpProvider(
    process.env.bc_host
))

// 오너 변수에 대입
const owner = process.env.bc_owner

// 컨트렉트 정보를 로드 
const contract_info = require('../build/contracts/Mileage.json')
const contract_abi = contract_info.abi
const contract_address = contract_info.networks['5777'].address

// class 선언
// class의 이름은 일반적으로 앞 글자를 대문자 생성
class Mileage{

    // 생성자 함수 : class가 생성이 될때 최초로 한번 실행이 되는 함수
    // class  내부에서 사용할 변수들을 지정
    constructor(){
        // class가 생성될 때 배포한 스마트를 연동하여 변수에 대입 
        console.log('Create Class')
        // this : 자기 자신(python에서는 self)
        this.smartcontract = new web3.eth.Contract(
            contract_abi, 
            contract_address
        )
    }

    // 유저를 등록하는 함수
    async add_user(_user){
        const result = await this.smartcontract
        .methods
        .add_user(
            _user
        ).send(
            {
                from : owner, 
                gas : 2000000
            }
        )
        
        console.log('sc_class - add_user() result :', result)
        return "add_user_success"
    }

    // 마일리지를 지급하는 함수 
    async payment(_user, _amount){
        const result = await this.smartcontract
        .methods
        .add_mileage(
            _user, 
            _amount
        ).send(
            {
                from : owner, 
                gas : 2000000
            }
        )
        
        console.log('sc_class - payment() result :', result)
        return "add_mileage_success"
    }

    // 마일리지를 거래하는 함수
    async transaction(_sender, _receiver, _amount){
        const result = await this.smartcontract
        .methods
        .trans_mileage(
            _sender, 
            _receiver, 
            _amount
        ).send(
            {
                from : owner, 
                gas : 2000000
            }
        )
        
        console.log("sc_class - transaction() result :", result)
        return "trans_mileage_success"
    }

    // 마일리지를 확인하는 함수
    async balance(_user){
        const result = await this.smartcontract
        .methods
        .view_mileage(
            _user
        ).call()
        console.log('sc_class - balance() result :', result)
        return result
    }
}

// 선언한 class를 외부에서 사용이 가능하도록 모듈 설정
module.exports = {Mileage}





// Class : 값과 행위를 갖는 객체
// 값 -> 데이터 -> 변수
// 행위 -> 행동 -> 함수
// class는 변수와 함수의 모음
// 붕어빵 제작 과정 
// 1. 빵틀에 반죽을 붓는다
// 2. 소를 넣는다
// 3. 반죽을 위에 한번 더 붓는다
// 4. 가열한다
// 5. 한번 뒤집는다
// 6. 완성된 붕어빵을 꺼낸다
// 해당하는 과정에서 변수는 ? -> 반죽, 소(팥, 슈크림)
// 클래스를 선언 -> 레시피를 생성(붕어빵의 틀을 제작)
// 클래스를 생성 -> 해당하는 레시피에 재료를 선택(반죽과 소를 선택)
// 클래스 안에 있는 함수를 호출 -> 붕어빵을 제작(팥붕어빵, 슈크림붕어빵)