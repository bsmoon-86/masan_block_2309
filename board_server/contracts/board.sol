// SPDX-License-Identifier: MIT

// 솔리디티 컴파일 버전 지정
pragma solidity = 0.8.18;

// contract를 선언
contract Board{
    // 게시판에 저장되어야 되는 데이터들의 목록
    // 글번호, 제목, 작성자, 시간, 본문
    // mapping으로 데이터를 구성 key값(중복 불가)으로 사용할 데이터 : 글번호
    // mapping ( uint => (제목, 작성자, 시간, 본문)정보를 넣을수 있는 구조체  )
    // 글번호를 변수 생성(초기값은 1로 지정)
    uint no = 1;

    // 구조체(커스텀한 데이터의 타입)를 생성 (제목, 작성자, 시간, 본문)
    struct contents_info{
        string title;
        string writer;
        string time;
        string content;
    }

    // mapping data 생성 (키값 : 글번호, 벨류값 : contents_info)
    // mapping (데이터의 타입 => 데이터 타입) 변수명
    mapping ( uint => contents_info ) contents;

    // 게시글을 등록 하는 함수 
    function add_contents(
        string memory _title, 
        string memory _writer, 
        string memory _time, 
        string memory _content
    ) public {
        // mapping data에 데이터를 추가 
        contents[no] = contents_info(_title, _writer, _time, _content);
        // 게시글이 등록 되었으면 no 1 증가
        no++;
    }

    // 게시글을 조회하는 함수 
    function view_content(
        uint _no
    ) public view returns (
        contents_info memory
    ){
        // return contents[_no];
        contents_info memory result = contents[_no];
        return result;
    }

    // 최근 게시글의 번호를 조회하는 함수 (전체의 게시글의 정보를 확인할때 게시글의 개수를 확인하기 위한 함수)
    function view_no() public view returns(
        uint
    ){
        // no는 최근 게시글 번호보다 1이 높은 숫자 
        return no;
    }


}