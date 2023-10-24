// SPDX-License-Identifier: MIT

// Solidity version 
// >=, >, <=, < : solidity의 버전을 광범위하게 설정
// ^version : 버전을 선택
pragma solidity >=0.7.0 <0.9.0;

// contract를 선언
contract Mileage {

    // 컨트렉트에서 사용할 변수들을 지정(해당하는 변수가 존재하지 않는다면 아무런 변수도 지정하지 않는다)
    // 오너 라는 변수를 생성
    // internal : 컨트렉트 내부에서만 사용 가능
    address internal owner;

    // 생성자 함수 : 스마트 컨트렉트가 배포(deploy) 될 때 최초로 한번만 실행이 되는 함수
    constructor(){
        // 배포한 지갑의 주소를 owner에 대입
        owner = msg.sender;
    }

    // 마일리지 데이터를 저장할 mapping data를 생성
    // mapping : json의 형태와 흡사하다  key : value로 이루어진 데이터
    // solidity에서 mapping 데이터는 key의 데이터 타입과 value 데이터 타입을 기입하여 생성
    mapping(string => uint) internal mileage;
    // 등록된 유저를 나타내는 mapping 데이터 생성
    // mapping bool의 형태는 등록되어있지 않은 키값은 false 출력
    mapping(string => bool) internal exists;

    // 변경자 함수(modifier 함수) : 일반 함수를 변경 -> 일반함수에 변경자함수를 포함하여 함수를 실행
    // 오너만이 함수를 실행할 수 있도록 변경자 함수 생성
    modifier onlyOwner(){
        // require(조건식, 텍스트) : 조건식이 참이라면 코드를 이어서 실행, 
        // 거짓이라면 함수를 종료하고 텍스트를 거절 메시지로 되돌려준다.
        require(msg.sender == owner, "Only the owner can execute the function");
        // _ : 결합된 함수가 실행이 되는 부분
        _;
    }

    // 등록된 유저만이 마일리지를 받거나 거래할 수 있도록 변경자 함수 생성
    modifier checkUser(
        string memory _user
    ){
        // exists mapping 데이터에 유저가 등록되어있는가 확인
        // exists안에 _user라는 키 값의 데이터가 true라면
        require(exists[_user], "You are an unregistered user");
        _;
    }

    // 회원을 등록하는 함수(오너만이 해당하는 함수를 호출)
    function add_user(
        string memory _user
    ) public onlyOwner{
        // 등록되어있지 않은 유저만 등록 -> mapping데이터에 value true로 변경
        if(!exists[_user]){
            exists[_user] = true;
        }
    }

    // 마일리지를 지급하는 함수( 조건1 : 지급하는 사람이 오너인가?  , 조건2 : 등록된 유저에게 보내는가? )
    // 조건1은 onlyOwner 함수이고 조건2는 checkUser 함수
    function add_mileage(
        string memory _user, 
        uint _amount
    ) public onlyOwner checkUser(_user){
        // 마일리지를 지급 -> mileage mapping data에 value를 증가시킨다. 
        // a += 10 -> a = a + 10
        mileage[_user] += _amount;       // mileage[_user] = mileage[_user] + _amount ;
    }

    // 유저간의 마일리지 거래하는 함수 ( 조건1 : 함수를 호출하는 사람이 오너인가?, 조건2 : 보내는 유저가 등록된 유저 인가?  조건3 : 받는 유저가 등록된 유저인가? )
    function trans_mileage(
        string memory _sender, 
        string memory _receiver, 
        uint _amount
    )public onlyOwner checkUser(_sender) checkUser(_receiver){
        // 조건4 : 보내는 유저의 마일리지의 양이 _amount보다 크거나 같아야 한다.
        require(mileage[_sender] >= _amount, "Not enough mileage");
        // 보내는 유저의 마일리지를 _amount 만큼 감소
        mileage[_sender] -= _amount;
        // 받는 유저의 마일리지를 _amount 만큼 증가
        mileage[_receiver] += _amount;
    }

    // 유저의 마일리지를 확인하는 함수 생성 (조건1 : 등록된 유저여야 마일리지 조회 가능)
    function view_mileage(
        string memory _user
    )public checkUser(
        _user
    ) view returns(
        uint
    ){
        return mileage[_user];
    }

}