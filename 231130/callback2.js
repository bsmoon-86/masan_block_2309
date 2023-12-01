function test_callback(a, b, c){
    c(a + b)
}

// test_callback(1, 2, function(result){
//     console.log(result)
// })

function first(){
    console.log(1)
}
function second(){
    console.log(2)
}
function third(){
    console.log(3)
}

// first()
// setTimeout(second, 2000) //second 함수의 호출을 2초 뒤에 실행
// third()
// 위의 함수 호출이 동기 방식이라면 1, 2, 3
// 동기 방식은 코드를 한줄씩 실행을 하면서 해당하는 라인의 코드가 완료될때까지 대기
// 비동기 방식이라면 1, 3, 2
// 비동기 방식은 코드를 한줄씩 실행하지만 해당하는 코드가 완료될때까지 대기하지 않는다. 

function square(num){
    console.log(num)
    let number = num * num
    console.log(number)
}

function plus(callback){
    const a = 2
    const b = 3

    const sum = a + b

    callback(sum)
}
// square()함수를 호출할때 2+3을 더한 데이터를 1초 뒤에 대입

// square()함수를 호출할때 setTimeout이 제대로 실행이 되지 않고 함수가 호출
// square(
//     setTimeout(()=>{
//         const a = 3
//         const b = 2
//         const sum = a + b
//         return sum
//     }, 5000)
// )

// // plus()함수가 호출이 되고 그 이후에 square()함수가 호출
// setTimeout(plus(square), 5000)


// let 변수명 = new promise(function(resolve, reject){함수 코드})

let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
        resolve('a')
        // console.log(1)
    }, 3000)
})

// promise1.then(function(value){
//     console.log(2)
//     console.log(value)
// })

// promise2 = new Promise(function(resolve, reject){
//     setTimeout(function(){
//         reject('실패')
//     }, 2000)
// })

// promise2.then(function(value){
//     console.log(value)
// }).catch(function(err){
//     console.log(err)
// })

// function promise_test(){
//     promise1.then(function(result){
//         console.log(result)
//     })
// }
// promise_test()

function test(){
    const name = 'kim'
    function display(){
        // 부모에 있는 변수의 값을 호출
        console.log(name)
    }
    display();
}
// test()

// const e = 10
// function sum(a){
//     return function(b){
//         return function(c){
//             return function(d){
//                 return a + b + c + d + e
//             }
//         }
//     }
// }
// console.log(sum(1)(2)(3)(4))

const e = 10
function sum(a){
    return function sum2(b){
        return function sum3(c){
            return function sum4(d){
                return a+b+c+d+e
            }
        }
    }
}

const sum2 = sum(1)
const sum3 = sum2(2)
const sum4 = sum3(3)
const sum5 =sum4(4)
console.log(sum5)