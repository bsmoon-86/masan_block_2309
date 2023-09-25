// SPDX-License-Identifier: MIT

// 솔리디티의 버전
pragma solidity >=0.7.0 <0.9.0;

contract Test2{

    // mapping 데이터 생성
    // mappping (key값의 데이터 타입 => value의 데이터 타입) 변수명
    mapping (string => uint) user_data;

    // 배열 데이터 생성
    // 데이터타입[] 변수명
    string[] users;

    // mapping데이터에 데이터를 추가 함수
    function add_user(string memory _name, uint _age) public {
        // mapping 데이터를 추가 
        user_data[_name] = _age;
        // 배열 데이터에 _name값을 추가 
        users.push(_name);
    }

    function view_user(string memory _name) public view returns (uint){
        return user_data[_name];
    }

    function view_user_list() public view returns (string[] memory){
        return users;
    }

}