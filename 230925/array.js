// 배열 데이터의 형태

const a_list = new Array(1,2,3)

const b_list = ["Hello","How","Are","You"]

// console.log(a_list)
// console.log(b_list)

// 배열의 길이를 출력
// console.log(a_list.length)
// console.log(b_list.length)

// 배열에서 원소 항목을 출력
// 배열명[위치] -> 위치는 0부터 시작
// a_list에서 3이라는 데이터를 추출하려면? -> 세번째 위치[2]의 데이터
// console.log(a_list[2])
// b_list에서 'You'라는 데이터를 추출하려면? -> 네번째 위치[3]이기도 하지만 가장 마지막의 데이터[배열의 길이 - 1]
// console.log(b_list[b_list.length - 1])

// 배열의 각각의 원소들을 하나씩 출력
// 반복문 이용하여 배열 데이터를 하나씩 console.log()
/* 
for (초기조건; 조건식; 증감식){
    반복 실행 할 코드 
}
초기 조건 : 첫번째 위치가 초기 조건
조건식 : 초기 조건의 변수의 값이 배열의 길이보다 작은 경우
증감식 : 1씩 증가
*/
for (let i = 0; i < b_list.length; i++){
    // i는 b_list의 위치 값들을 반복
    // console.log(b_list[i])
}

// for ... in
for (let i in b_list){
    // index라는 변수에는 b_list 위치 값들을 넣어서 반복 실행
    // console.log(i)
}

// for ... of
for (let i of b_list){
    // b_list의 각각의 원소들을 i 변수에 대입하여 반복 실행
    // console.log(i)
}

 
let _list = ['apple', 'banana', 'melon']
// 배열 데이터에 가장 마지막에 원소를 추가
_list.push('berry')
// console.log(_list)
// 배열 데이터에서 가장 마지막 원소를 제거 
_list.pop()
// console.log(_list)
// 두개의 배열 데이터를 결합
let _list2 = ['coconut', 'water melon']
let result = _list + _list2  
result = _list.concat(_list2)
// console.log(result)

// 배열에서 특정한 데이터의 위치 값을 출력
// console.log(result.indexOf('melon'))
// indexOf()를 이용하여 데이터를 검색하는데 데이터가 배열에 존재하지 않는 경우에는 -1로 출력
// console.log(result.indexOf('berry'))

// 배열 데이터에 특정한 데이터가 존재하는가?를 출력하는 함수
// include({검색할 문자})
// console.log(result.includes('melon'))
// console.log(result.includes('berry'))


// JSON 데이터 -> (python에서 dict형태)
// 사전형 데이터 -> 사전의 구성(단어 -> 풀이)
// 데이터의 형태는 {key : value, key2 : value2, ....}
let param = {
    'name' : 'test', 
    'phone' : '01012345678', 
    'age' : 25
}

// param JSON데이터에서 'test'문자열만 출력하려면?
// JSON 데이터에서 key값들은 배열에서 인덱스(위치)와 같다
// console.log(param['name'])
// console.log(param.name)
// JSON 데이터에서 .을 이용하여 키 값을 호출하는 방법과 [key]를 이용하여 데이터를 출력하는 방법이 존재
// []을 이용하여 특수한 키값에 대응하는 벨류를 출력할때 사용
let param2 = {
    "networks" : "localhost", 
    "5777" : '0x001111', 
    'bc host' : 'ganache'
} 
console.log(param2.networks)
console.log(param2['5777'])
console.log(param2["bc host"])
// json데이터에서 []를 이용하여 데이터를 추출하는 경우 키 값이 숫자로 시작하는 경우, 
// 키 값에 공백이 존재할때는 []를 이용해서만 데이터 추출이 가능

// 복잡한 데이터의 형태
// DataBase를 이용하여 데이터를 호출
let param3 = [
    {
        'ID' : 'test', 
        'password' : '1234'
    }, 
    {
        'ID' : 'test2', 
        'password' : '1111'
    }
]
// param3에서 '1234' 데이터만 추출하려면?
// 가장 외곽의 괄호를 확인! -> [] 형태 -> 배열에서 데이터를 추출하는 방법 사용
console.log(param3[0])
// param3[0]는 json 데이터 형태 -> json에서 데이터를 추출하는 방법 사용
console.log(param3[0]['password'])
console.log(param3[0].password)

 
let param4 = {
    'name' : 'kim', 
    'age' : 20
}
// json 데이터에 새로운 키 값을 추가
param4['loc'] = 'Busan'
console.log(param4)

// 기존의 키 값에 데이터를 수정 
param4['age'] = 30
console.log(param4)

// json에서 key:value을 제거 
delete param4['age']
console.log(param4)