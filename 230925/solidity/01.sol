// SPDX-License-Identifier: MIT

// 솔리디티의 버전
pragma solidity >=0.7.0 <0.9.0;

// contract 선언
contract Test{

    // 변수 선언
    uint8 number;
    string name = 'test';

    // 생성자 함수
    // deploy할때 최초로 한번 실행이 되는 함수
    // number 변수에 0이라는 데이터를 할당당
    constructor() {
        number = 0;
    }

    // 데이터를 수정하는 함수 생성 
    function add_number(uint8 _num) public {
        // 함수를 호출 할때 입력 값을 number에 더해준다.
        number = number + _num;
    }

    function view_number() public view returns (uint8){
        return number;
    }

    // view 함수를 이용하여 변수를 되돌려받는다.(데이터를 조회)
    function view_name() public view returns (string memory){
        return name;
    }

}