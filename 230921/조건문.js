// 주석
// 해당하는 코드를 보는 사람들에게 설명

// 변수
// const, let, var
// const : 상수(변수 안에 데이터를 수정 불가)
// let : 변수 안에 데이터를 수정이 가능한 변수
// 변수 선언, 할당
// 변수를 선언 : 메모리에 데이터를 저장할 수 있는 비어있는 공간을 변수의 이름으로 라벨링
// 변수에 값을 할당 : 변수를 선언 할때 만들어진 공간에 데이터를 할당

const a = "Hello World"
const b = 10;
let c = "Hi";
let d;
d = 20;

// console.log() : 커맨드라인에 데이터를 출력
// console.log(a)
// console.log(b)
// console.log(c)
// console.log(d)

// 비교 연산자 
const x = 10;
const y = 5;
const z = "10";

// == : 데이터의 값이 같으면 참 다르면 거짓
// x와 y가 같은가?
// console.log(x == y)
// x와 z가 같은가?
// console.log(x == z)

// === : 데이터의 값과 타입이 모두 같은 경우 참 그 외의 경우는 거짓
// console.log(x === z)

// x 와 y가 같지 않은가?
// console.log(x != y)
// console.log(x != z)

// 조건문 

// if문
// if(조건식){실행할 코드}
// else{조건식이 거짓일 경우 실행 할 코드}
let num = 10;

// 만약에 num가 5보다 크다면?   -> 참
if(num > 5){
    // 조건식이 참인 경우 실행 할 코드 
    // console.log("num는 5보다 크다")
}

let num2 = 3

if(num2 > 10){
    // 조건식이 참인 경우
    // console.log("num2변수의 값은 10보다 크다")
}else{
    // 조건식이 거짓인 경우
    // console.log("num2변수의 값은 10보다 작거나 같다")
}

// 조건식이 여러개인 경우
let num3 = 0;
let data;
// console.log(data)
if (num3 > 0){
    // num3가 0보다 큰 경우
    data = '양수'
}else if(num3 < 0){
    // num3가 0보다 작은 경우
    data = '음수'
}else {
    // 위의 두개의 조건식이 모두 거짓인 경우
    data = '영'
}
// console.log(data)

// swith문
let num4 = 1;
let ordinal;

switch(num4){
    // break구문은 swith문을 종료
    case 1 :
        ordinal = 'first';
        break;
    case 2 :
        ordinal = 'second';
        break;
    case 3 :
        ordinal = 'third';
        break;
    default :
        ordinal = 'number out or range'
}
// console.log(ordinal)

// swith문을 if으로 작성
let num5 = 3;
let ordinal2;

if(num5 == 1){
    ordinal2 = 'first';
}else if (num5 == 2){
    ordinal2 = 'second';
}else if (num5 == 3){
    ordinal2 = 'third';
}else{
    ordinal2 = 'number out or range';
}
console.log(ordinal2)