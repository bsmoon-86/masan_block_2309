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

    // 게시글을 수정하는 함수
    function update_contents(
        uint _no, 
        string memory _title, 
        string memory _writer, 
        string memory _content
    ) public {
        // 게시글이 존재하는가?
        // mapping data에 입력받은 키 값으로 데이터를 출력하였을때 
        // 데이터가 존재하는가?(데이터의 길이가 0이 아니라면)
        require(bytes(contents[_no].title).length != 0, "Error");
        // 게시글을 작성한 사람인가?
        bytes memory writer = bytes(contents[_no].writer);
        bytes memory writer2 = bytes(_writer);
        require(keccak256(writer) == keccak256(writer2), "Writer not match");
        contents[_no].title = _title;
        contents[_no].content = _content;
    }

    // 게시글 삭제 함수
    function delete_contetns(
        uint _no, 
        string memory _writer
    )public {
        // 게시글중 해당하는 키 값에 데이터가 존재하는가?
        require(bytes(contents[_no].title).length != 0, "Error");
        bytes memory writer = bytes(contents[_no].writer);
        bytes memory writer2 = bytes(_writer);
        require(keccak256(writer) == keccak256(writer2), "Writer not match");
        // 게시글을 제거 
        delete contents[_no];
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