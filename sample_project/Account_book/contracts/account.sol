// SPDX-License-Identifier: MIT

// solidity compile version 설정
pragma solidity >= 0.7.0 <0.9.0;

// contract를 선언
contract Account{

    // owner 변수 생성
    address internal owner;

    // 생성자 함수 : 배포를 한 주소값을 owner에 저장
    constructor(){
        owner = msg.sender;
    }

    // 조건 : owner만이 함수를 호출할 수 있다. 
    // 변경자 함수(함수에 결합되어 사용) 생성
    modifier onlyOwner(){
        // require를 사용하는 이유는 해당하는 함수에 조건이 만족하지 않는다면 
        // 아래의 코드들을 실행하지 않고 강제로 종료
        // 이유는 코드가 실행됨에 따라 수수료가 증가하기 때문에 밑의 코드들을 실행하지 않고 수수료를 적게 발생시킨다.
        require(msg.sender == owner, "Only the owner can execute the function");
        // _ : 결합된 함수가 실행이 되는 부분을 뜻한다. 
        _;
    }

    // 구조체 (커스텀한 데이터의 타입 만드는 과정)
    // 숫자형태의 데이터는 데이터가 존재하지 않는다면 0을 출력
    // 주소 형태의 데이터는 데이터가 존재하지 않는다면 address(0) 출력
    struct book_list{
        uint purchase_vat;
        uint purchase_cost;
        uint sales_vat;
        uint sales_cost;
        uint profit;
        address register;
    }

    // mapping data
    mapping (string => book_list) books;
    // books는 sql에서 table의 이름과 같다. 
    // 키 값은 문자열로 들어와야된다 (primary_key)
    // book_list -> primary_key를 제외한 컬럼의 이름들
    // books -> {
    //     key1(string 형태) : {
    //         purchase_vat : xxxxx, 
    //         purchase_cost : xxxxx, 
    //         sales_vat : xxxxx, 
    //         sales_cost : xxxxxx, 
    //         profit : xxxxxx
    //     },
    //     key2(string 형태) : {
    //         purchase_vat : xxxxx, 
    //         purchase_cost : xxxxx, 
    //         sales_vat : xxxxx, 
    //         sales_cost : xxxxxx, 
    //         profit : xxxxxx
    //     }
    // }

    // 회사별 등록된 장부 리스트
    mapping (string => string[]) company_book;

    // 월별 장부를 등록하는 함수 생성
    function add_book(
        string memory _company, 
        string memory _date, 
        uint _purchase_vat, 
        uint _purchase_cost, 
        uint _sales_vat, 
        uint _sales_cost, 
        address _register
    ) public onlyOwner() {
        // 해당하는 함수를 호출하기위한 요구 조건
        // 기존에 데이터가 저장되어 있다면 다시 기입을 할 수 없도록 한다. (데이터 등록에 수수료 중복납입 방지)
        // 구조체를 기준으로 데이터가 존재하는지 확인

        // books mapping에 데이터를 삽입
        string memory key = string.concat(_company, _date);
        require(books[key].register == address(0), "Exist Data");
        books[key] = book_list(_purchase_vat, _purchase_cost, _sales_vat, _sales_cost, _sales_cost - _purchase_cost, _register);
        // company_book mapping에 데이터 삽입
        company_book[_company].push(_date);
    }

    // 월별 장부를 확인
    function view_book(
        string memory _company, 
        string memory _date
    ) public view returns(
        book_list memory
    ){
        string memory key = string.concat(_company, _date);
        return books[key];
    }

    // 회사별 등록된 장부의 리스트를 확인하는 함수
    // company_book 이라는 맵핑 데이터의 벨류 값을 출력
    // 해당하는 벨류를 출력하기 위해서는 company_book의 키값(회사명)이 필요하다. 
    function view_book_list(
        string memory _company
    ) public view returns(
        string[] memory
    ){
        return company_book[_company];
    }

}