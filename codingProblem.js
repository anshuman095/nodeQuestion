function reverseOnlyLetters(s) {
  let arr = s.split("");

  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    if (!/[a-zA-Z]/.test(arr[left])) {
      left++;
    } else if (!/[a-zA-Z]/.test(arr[right])) {
      right--;
    } else {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  }

  return arr.join("");
}

console.log(reverseOnlyLetters("ab-cd"));
console.log(reverseOnlyLetters("a-bC-dEf-ghIj"));

function isPowerOfFour(n) {
  if (n <= 0) return false;

  while (n % 4 === 0) {
    n /= 4;
  }

  return n === 1;
}

console.log(isPowerOfFour(16));
console.log(isPowerOfFour(5));
console.log(isPowerOfFour(1));

function concatenateArrays(...arrays) {
  return arrays.flat();
}

const example1 = [[1, 5], [44, 67, 3], [2, 5], [7], [4], [3, 7], [6]];
console.log(concatenateArrays(...example1));

const example2 = [[4, 4, 4, 4, 4]];
console.log(concatenateArrays(...example2));

const example3 = [[1], [2], [6], [9], [7]];
console.log(concatenateArrays(...example3));
