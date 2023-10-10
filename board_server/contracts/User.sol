// SPDX-License-Identifier: MIT

// 솔리디티의 버전
pragma solidity >=0.7.0 <0.9.0;

contract User{

    // 회원 가입 정보의 구조
    // 구조체를 생성하여 회원 정보라는 데이터의 타입 
    // 구조체 안에 abled 값은 회원 가입이 완료됬다면 1로 변경
    // 디폴트값은 0
    struct user_info{
        string id;
        string password;
        string name;
        string tel;
        string loc;
        string gender;
        string email;
        uint8 abled;
    }

    // mapping 데이터 생성하여 구조체와 연결
    mapping (string => user_info) users;

    // 회원 가입 -> 회원 정보를 추가 
    function add_user(
        string memory _id, 
        string memory _pass, 
        string memory _name, 
        string memory _tel, 
        string memory _loc, 
        string memory _gender, 
        string memory _email
    ) public {
        // 회원 정보가 없는 경우 
        if ( users[_id].abled == 0 ){
            users[_id] = user_info(_id, _pass, _name, _tel, _loc, _gender, _email, 1);
        }
    }

    // 회원 정보를 수정
    function update_user(
        string memory _id, 
        string memory _pass, 
        string memory _name, 
        string memory _tel, 
        string memory _loc, 
        string memory _gender, 
        string memory _email
    ) public {
        // 회원 정보가 존재하는 경우
        if ( users[_id].abled == 1 ){
            users[_id] = user_info(_id, _pass, _name, _tel, _loc, _gender, _email, 1);
        }
    }

    // 아이디 중복 체크를 하는 함수
    function check_id(string memory _id) public view returns (bool) {
        if (users[_id].abled == 0){
            return true;
        }else{
            return false;
        }
    }
    // 회원 정보를 출력해주는 함수 (하나의 회원정보를 출력)
    function view_user(string memory _id) public view returns (user_info memory){
        // 되돌려주는 데이터는 mapping data인 users에서 키 값이 _id인 value를 출력
        // 동적 타입의 언어 : 변수 생성 시 데이터의 타입을 지정하지 않는다.(js, python) -> const, let
        // 정적 타입의 언어 : 변수 생성 시 데이터의 타입을 지정해야 된다. (java, c, solidity) -> string, uint, bool
        user_info memory result = users[_id];
        return result;
    } 

}