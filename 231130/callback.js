// 콜백 함수 
// 매개변수로 함수를 전달하여 호출하는 함수 내에서 매개변수를 가지고 함수를 실행


function sayHello(name, callback){
    const result = `안녕하세요 ${name}님`
    // result -> 안녕하세요 홍길동님

    callback(result)
    // callback(안녕하세요 홍길동님)
}

// sayHello('홍길동', function(name){
//     console.log(name)
// })

// sayHello('문병선', function(x){
//     console.log(x)
// })


function sum(x, y, callback){
    callback(x+y)
}

// sum(10, 20, function(result){
//     console.log(result)
// })

function introduce(lastName, firstName, callback){
    let fullName = lastName + firstName

    callback(fullName)
}

function say_hello(name){
    console.log(`안녕하세요 ${name}님`)
}

function say_bye(name){
    console.log(`안녕히계세요 ${name}님`)
}

// introduce('문', '병선', function(result){
//     console.log(result)
// })
// introduce('문', '병선', say_hello)

// introduce('문', '병선', say_bye)


const _list = [1,2,3,4]

_list.forEach(function(num){
    console.log(num)
})