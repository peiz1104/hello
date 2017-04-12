
// 新增变量
const arg1 = 1;
// data = 2; Error
let arg2 = 1;

//====================================//

// class类概念
class Person {
    constructor() {
        console.log('constructor A')
    }
    say() {
        console.log('say')
    }
    say2() {
        console.log('say2')
    }
}
class Man extends Person {
    name = undefined;
    static sex = '男';

    constructor(name) {
        super(); //必须执行
        console.log('constructor B')
        this.name = name;
    }
    // 静态方法
    static staticMethod() {
        console.log('staticMethod')
    }
    say2() {
        console.log('say2 in ' + this.name)
    }
}
let man = new Man('JACK');
man.say(); // say
man.say2(); // say2 in JACK
Man.staticMethod(); // staticMethod
console.log(Man.sex) // 男

//====================================//

// 箭头函数
class Obj {
    name = 'obj1';
    sayName() {
        console.log(this.name)
    }
    sayName2 = () => {
        console.log(this.name)
    }
}
class Obj2 {
    name = 'obj2';
}
let obj = new Obj();
let obj2 = new Obj2();
obj2.sayName = obj.sayName;
obj2.sayName2 = obj.sayName2;

obj2.sayName();
obj2.sayName2();

//====================================//

// 解构
const data = {
    name: 'liuyang',
    age: 18
}

const { name, age } = data; // 解构获取属性

const newData = { ...data }; // 简单的拷贝对象
const data1 = {
    name: 'liuyang',
    age: 18
}
const data2 = {
    name: 'liuyang2',
    sex: '男'
}
const newData2 = {
    ...data1,
    ...data2,
    text: '新属性'
};
console.log(newData2) // { name: 'liuyang2',age: 18,sex:'男',text: '新属性' }
