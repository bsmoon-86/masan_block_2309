// SPDX-License-Identifier: MIT

// 솔리디티의 버전
pragma solidity >=0.7.0 <0.9.0;

contract Wallet_User{

    // 구조체를 생성하여 유저의 정보를 담는 형태
    struct user_info{
        string name;
        uint age;
        string phone;
    }

    // 구조체와 mapping 연결
    // mapping (key 데이터타입 => value 데이터타입) 변수명;
    // JSON데이터에서 key : value
    mapping (address => user_info) users;

    // 유저의 정보를 추가하는 함수 
    function add_user(
        address _wallet, 
        string memory _name, 
        uint _age, 
        string memory _phone
        ) public {
            // mapping 데이터에 데이터를 추가하는 방법?
            // JSON데이터에 새로운 키 값을 추가하는 방법과 동일
            users[_wallet] = user_info(_name, _age, _phone);
        }
    
    // mapping 데이터에서 한 명의 유저의 정보를 출력하는 함수 
    function view_user(address _wallet) public view returns (user_info memory){
        return users[_wallet];
    }

    // 유저의 정보를 추가하는 함수 생성 (매개변수에 address가 없는경우)
    function add_user2(
        string memory _name, 
        uint _age, 
        string memory _phone
    ) public {
        // 함수를 요청하는 지갑의 주소를 확인하여 user_info에 데이터가 존재한다면
        // transaction를 거절한다. (데이터의 수정을 거절한다. )
        if(users[msg.sender].age == 0){
            // mapping 데이터에 넣어줄 키 값이??? -> transaction을 발생 시키는 지갑의 주소
            // 함수를 호출하는 지갑의 주소 -> msg.sender
            users[msg.sender] = user_info(_name, _age, _phone);
        }

    }
    // 유저의 정보를 추가하는 함수 생성 (매개변수에 address가 없는경우)
    function add_user3(
        string memory _name, 
        uint _age, 
        string memory _phone
    ) public {
        // 함수를 요청하는 지갑의 주소를 확인하여 user_info에 데이터가 존재한다면
        // transaction를 거절한다. (데이터의 수정을 거절한다. )
        // require(조건식, 메시지)
        // 조건식이 거짓이라면 해당하는 함수를 강제 종료하고 메시지를 띄워준다.
        require(users[msg.sender].age == 0, "Error");
        // mapping 데이터에 넣어줄 키 값이??? -> transaction을 발생 시키는 지갑의 주소
        // 함수를 호출하는 지갑의 주소 -> msg.sender
        users[msg.sender] = user_info(_name, _age, _phone);

        /*
            users는 변수는 mapping data
            {
                '0x617F2E2fD72FD9D5503197092aC168c91465E7f2' : {
                    name : "", 
                    age : 0, 
                    phone : ""
                }, 
                address2 : {
                    name : "", 
                    age : 0, 
                    phone : ""
                }, ...
            }
            users[msg.sender] ->    {
                                        name : "", 
                                        age : 0, 
                                        phone : ""
                                    }
            users[msg.sender].age -> 0                        
            (users[msg.sender].age == 0)의 결과는? True
            ( 0 == 0) -> True

            users[msg.sender] = user_info('kim', 20, '01011112222');
            users[msg.sender] ->    {
                                        name : "kim", 
                                        age : 20, 
                                        phone : "01011112222"
                                    } 
            users[msg.sender].age -> 20          
            (users[msg.sender].age == 0)의 결과는? False
            (20 == 0) -> False

        */ 

    }
    function view_user2() public view returns (user_info memory){
        return users[msg.sender];
    }


}