    설문조사 데이터를 블록체인 네트워크상에 저장 프로젝트 

    회원 가입 DB 설정
        회원 정보 
            - id -> primary key
            - password
            - name 
            - age 
            - wallet address
            - private key
    설문조사 질문은 DB 에 저장 
        설문조사 정보
            - 설문조사 아이디 no -> primary key, auto increment
            - 질문 내역1
            - 질문 답변1
            - 질문 내역2
            - 질문 답변2
            - 질문 내역3
            - 질문 답변3
            - 질문 내역4
            - 질문 답변4
            - 질문 내역5
            - 질문 답변5
    설문에 대한 답변들은 블록체인 네트워크 저장(smart contract)
        mapping data를 이용하여 저장
        mapping (uint => mapping data2) 설문조사종류
            mapping data2 
            mapping (유저아이디 => uint[])

        mapping data의 형태를 json 표현 
            - data = {
                1 : {
                    '유저1' : [답변 내역], 
                    '유저2' : [답변 내역], 
                    .....
                }, 
                2 : {
                    '유저1' : [답변 내역], 
                    '유저2' : [답변 내역], 
                    ....
                }, ....
            }
            - 1번 설문에서 유저1의 답변 내역 -> data[1]['유저1']
            - 1번 설문에서 유저1의 1번 질문의 답변 -> data[1]['유저1'][0]
                
    설문을 완료한다면 보상 ERC-20 token을 지급 
        - 새로 토큰을 발급 
        - 설문이 완료된다면 관리자가 유저에게 토큰을 발급 

    front page -> 메뉴바 고정형 하나 생성 페이지들마다 메뉴바 로드 페이지 구성 
            -- reference
                - 상단의 메뉴바
                - 외부 파일 참조
            
            - 로그인 화면
            - 회원가입 화면 
            - 설문조사를 선택 화면
            - 설문 답변을 등록 화면
            - 내가 설문한 내역을 확인 화면
            - 설문을 등록한 사람이 전체 데이터를 조회 화면
    backend -> js file들을 모듈화 기능별 js을 구성 
            - 유저에 대한 기능 부분
            - 설문 조사 입력
            - 비동기 통신 
            - 설문 조사 조회

            -- reference 
            - create_table
            - sql_list
            - sql_class
            - blockchain function