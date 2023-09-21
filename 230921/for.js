// 반복문 
/* 
    for(초기조건; 조건식; 증감식){
        반복 실행 할 코드
    }
*/

for(
    let i = 0;  // 초기조건
    i < 5;      // 조건식
    i = i + 1         // 증감식
){
    // console.log(i)
}

// 1부터 시작하여 10까지의 합계 -> 55
// 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10

// 합계라는 초기 값을 지정
let result = 0;

for(let i = 1; i <= 10; i++){
    // i를 result변수에 합
    // result = result + i
    result += i
}
// console.log(result)

// 1부터 100까지의 짝수의 합계
// 합계라는 변수 하나 생성 0을 할당
let result2 = 0
// 반복문 사용하여 1부터 100까지 반복
for(let i = 1; i <= 100; i++){    
    // i가 짝수라면? -> 2로 나눈 나머지의 값이 0인 경우
    if(i % 2 == 0){
        // 합계에 더해서 합계 변수에 대입 
        result2 = result2 + i
    }
}
// console.log(result2)

// 다중 for문

// i가 1부터 시작해서 5보다 작을때 까지 실행
for(let i = 1; i < 5; i++){
    // console.log(i)
    // j가 1부터 5보다 작을때 까지 실행
    for(let j = 1; j < 5; j++){
        // console.log(i)
        // console.log(j)
    }
}

// 2개의 주사위를 굴렸을 때 두 주사위의 합이 5의 배수인(주사위의 합 % 5 == 0) 경우를 출력하시오
// 첫번째 주사위의 경우를 반복문을 이용하여 작성
for(let i = 1; i <= 6; i++){
    // 두번째 주사위의 경우를 반복문을 이용하여 작성
    for(let j = 1; j <= 6; j++){
        // 두 주사위의 합이 5의 배수인 경우
        if( (i + j) % 5 == 0 ){
            // console.log(i, j)
        }
    }
}

// while문

// 초기 조건
let i = 1;
// 초기 합계 변수 생성
let result3 = 0

while(i <= 10){

    // 반복 실행 할 코드 
    // console.log(i)
    result3 += i
    // 증감식
    i++
    // i = i + 1
    // i += 1

}
// console.log(result3)



// do...while문

let j = 9

do{
    console.log(j)
    j++
}while(j < 10)

// while(j < 10){
//     console.log(j)
//     j++
// }