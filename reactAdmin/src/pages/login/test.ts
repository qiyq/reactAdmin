// interface test:function (name:string)=>void;
//
// function tes

interface People {
  name: string;
  age: number;

  [propName: string]: any;
}

const arr: [] = [];
console.log(arr);

class S {

}

interface AddFunc {
  (x: number, y: number): void
}

const add1: AddFunc = function(x: number, y: number) {
  const a = x + y;
  console.log(a);
};

function add(x: number, y: number): void {
  const a = x + y;
  console.log(a);
}

add(1, 2);
add1(1, 2);

class P extends S {

}

const w = new P();
console.log(w);

const tom: People = {
  name: '11',
  age: 12,
  dad: '12',
};
console.log(tom);
