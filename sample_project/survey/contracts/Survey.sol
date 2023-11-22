//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Survey{

    address internal owner;

    constructor(){
        owner = msg.sender;
    }

    mapping (uint => mapping (string => uint[])) internal surveys;
    // 설문 조사에 응했는가를 확인하는 부분
    // express server : DB에서 survey_user table에 설문참가 컬럼 생성하여 조사에 응한 설문 no들을 저장
    // solidity : mapping안에 mapping 데이터가 [] 이라면 설문조사에 응하지 않았다. 
    // solidity : 새로운 mapping을 만들어서 유저당 참여한 설문 목록을 생성하여 확인

    function add_survey(
        uint _no, 
        string memory _user, 
        uint[] memory _answer
    ) public {
        surveys[_no][_user] = _answer;
    }

    function view_survey(
        uint _no, 
        string memory _user
    ) public view returns(
        uint[] memory
    ){
        return surveys[_no][_user];
    }

    


}