//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Survey{

    address internal owner;

    // 이벤트 생성 -> js에서의 console.log() 흡사 
    event testEvent(uint, address, uint[]);


    constructor(){
        owner = msg.sender;
    }

    modifier checkSurvey(
        uint _no, 
        address _user
    ){
        require(owner == msg.sender, 'Only owner can call function');
        require(surveys[_no][_user].length == 0, 'exist survey answer');
        _;
    }

    mapping (uint => mapping (address => uint[])) internal surveys;
    // 설문 조사에 응했는가를 확인하는 부분
    // express server : DB에서 survey_user table에 설문참가 컬럼 생성하여 조사에 응한 설문 no들을 저장
    // solidity : mapping안에 mapping 데이터가 [] 이라면 설문조사에 응하지 않았다. 
    // solidity : 새로운 mapping을 만들어서 유저당 참여한 설문 목록을 생성하여 확인

    // 설문의 답변을 추가하는 함수
    function add_survey(
        uint _no, 
        address _user, 
        uint[] memory _answer
    ) public checkSurvey(_no, _user){
        // _no : 설문조사의 고유 값 ( survey_list table의 no )
        // _user : 설문조사를 한 유저의 지갑 주소
        // _answer : 설문조사의 답변 내역
        surveys[_no][_user] = _answer;
        // 이벤트 호출 
        emit testEvent(_no, _user, _answer);
    }

    // 특정 설문에 참여 여부 리턴해주는 함수 
    function check_survey(
        uint _no, 
        address _user
    ) public view returns(
        bool
    ){
        /* 
            surveys -> {
                '_no1' : {
                    '_address1' : [0, 1, 2], 
                    '_address2' : [2, 2, 2] 
                }
            }

            // 설문 내역이 존재할때
            serveys['_no1']['_address1'] -> [0, 1, 2]
            // 설문 내역이 존재하지 않을때
            serveys['_no1']['_address3'] -> []
        */
        // surveys[_no][_user] 데이터의 형태는?? ->
        // 참여기록이 존재한다면(surveys[_no][_user]) False
        if (surveys[_no][_user].length != 0){
            return false;
        }else{
        // 참여 기록이 존재하지 않는다면 True
            return true;
        }
    }

    // 특정 설문에 유저가 대답한 답변을 리턴해주는 뷰 함수
    function view_survey(
        uint _no, 
        address _user
    ) public view returns(
        uint[] memory
    ){
        return surveys[_no][_user];
    }

    


}