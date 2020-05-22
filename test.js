let sample1 = [3,9,9,0]
// [2,9,9,9] -> [3,0,0,0]
// [1,6,7,8] -> [1,6,7,9]

let sumArray = (array) => {
    for(let i=array.length-1;i>=0;i--){
        if(array[i] <= 8){
            array[i] = array[i] + 1;
            break;
        } else {
            array[i] = 0
        }
    }
    return array
}

//console.log(sumArray(sample1));
let numbers = [];
let onethrutwenty = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,18,19,20]
let findSmallestPositive = () => {
  for(k=0;k<=10000;k++){
    for(i=0;i<=20;i++){
        if(k % i == 0) {
            numbers.push(i)
        }
    }
  }
}

let makeBricks = (small, large, goal) => {
    let sum = 0;
    for(i=0;i<=large;i++){
        if(sum <= goal){
            sum = sum + 5
        } else {
            break;
        }
    }
    return sum;
}

console.log(makeBricks(3,2,9));