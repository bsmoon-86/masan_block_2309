// SPDX-License-Identifier: MIT

// 솔리디티의 버전
pragma solidity >=0.7.0 <0.9.0;

contract modifier_constructor{

    address owner;

    // 생성자 함수 : deploy가 될때 최초로 한번만 실행되는 함수수
    // 생성자 함수를 생성하여 deploy를 한 지갑의 주소를 owner로 등록
    constructor(){
        owner = msg.sender;
    }

    uint public num1 = 0;
    uint public num2 = 0;

    // 변경자 함수 : 함수의 기능을 추가
    modifier owner_check {
        // 함수를 호출한 지갑의 주소가 컨트렉트를 배포한 지갑의 주소와 같다면 함수를 실행
        // 같지 않다면 함수를 강제 종료하고 거절 메시지 'owner not match'를 보여준다.
        require(owner == msg.sender, 'owner not match');
        _; // function 함수가 실행되는 부분
    }

    modifier check{
        num1++; // num1 데이터가 0 + 1 -> 1
        _;  // 결합되어있는 function이 실행되는 부분분
        num1--; // num1 데이터가 1 - 1 -> 0
    }

    function add_num() check public {
        if(num1 == 1){
            num2 = num2 + num1;
        }
    }
    // add_num()함수를 호출
    /*
        num1++;

        if(num1 == 1){
            num2 = num2 + num1;
        }

        num1--;
    */

    uint count = 0;

    function add_count(uint _num) owner_check public {
        count = count + _num;
    }

    /* 
    add_count()함수를 호출하면 
        require(owner == msg.sender, 'owner not match');
        count = count + _num;
    */
    
    function view_count() public view returns (uint){
        return count;
    }
    

}