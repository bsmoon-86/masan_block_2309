class Test{
    // 생성자 함수 
    constructor(_a, _b){
        // a는 붕어빵의 반죽
        // b는 붕어빵의 소
        // this변수는 지역(class)변수 
        this.a = _a
        this.b = _b
    }

    // 붕어빵을 만들어주자 (행동) -> 함수 생성
    create_bread(){
        // 붕어빵 제작 
        // 결과물 -> 팥 + 반죽 = 팥붕어빵
        // 슈크림 + 반죽 = 슈크림붕어빵
        const result = this.b + "붕어빵"
        return result
    }
}

// class 생성
x = new Test("반죽", '팥')
y = new Test('반죽', '슈크림')

console.log(x.create_bread())
console.log(y.create_bread())