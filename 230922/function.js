// 함수

// 함수를 선언
// 매개변수가 존재하지 않는 함수
function func_1(){
    const result = 'Hello World'
    // 함수를 호출하면 결과를 되돌려준다.
    return result
}

// func_1()함수는 매개변수가 존재하지 않기 때문에 인자 값도 필요하지 않다. 
// console.log(func_1())


// 매개변수(x, y)가 존재하는 함수 생성
function func_2(x, y){
    // 매개변수 x, y는 함수 내부에서 사용이 가능
    const result = x + y;
    return result;
}

// func_2()함수를 호출 
// func_2()함수를 호출하면서 x라는 매개변수에는 5라는 데이터를 할당
// y라는 매개변수에는 3이라는 데이터를 할당
// console.log(func_2(5, 3))
// console.log(func_2(123, 111))

// 함수를 선언할때 매개변수의 개수와 함수를 호출할때 인자의 개수는 동일해야된다. 
// 매개변수의 개수와 인자의 개수가 다른 경우
// 함수의 결과를 받아오지 못한다. 
const a = func_2(8)
// console.log(a)


// 함수를 선언할 때 매개변수에 기본값을 지정 
function func_3(x, y = 2){
    const result = x ** y
    return result
}

console.log(func_3(5, 3))
/*
    let x;
    let y = 2;

    x = 5;
    y = 3;

    const result = x ** y 
    console.log(result)     125
*/

console.log(func_3(8))

/*
    let x;
    let y = 2;

    x = 8

    const result = x ** y
    console.log(result)
*/

// 반복문 1부터 10합계를 함수로 표현 
// a변수 값부터 b변수 값까지의 합계 함수생성
function func_4(a, b = 10){
    // 초기 합계라는 변수를 생성하여 0을 대입
    let result = 0
    for(a; a <= b; a++){
        result += a;
    }
    return result
}

console.log(func_4(1))
console.log(func_4(1, 100))