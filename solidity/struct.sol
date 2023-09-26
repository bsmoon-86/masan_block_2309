// SPDX-License-Identifier: MIT

// 솔리디티의 버전
pragma solidity >=0.7.0 <0.9.0;

contract Test3{

    // 구조체 생성
    // 커스텀한 데이터의 구조 생성
    // JSON형태에서 키값들만 지정 
    struct user_info {
        string name;
        uint age;
        string loc;
    }

    user_info[] users;

    // 배열데이터에 데이터를 추가 하는 함수 생성
    function add_user(string memory _name, uint _age, string memory _loc) public {
        // users 배열에 데이터(구조체)를 추가 
        users.push(user_info(_name, _age, _loc));
    }

    // 배열 데이터의 각 원소 결과를 출력하는 함수 생성 
    function view_user(uint _index) public view returns (user_info memory){
        return users[_index];
    }

    // 배열 전체를 리턴하는 함수 생성
    function view_users() public view returns (user_info[] memory){
        return users;
    }


}