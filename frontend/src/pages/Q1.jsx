import React from "react";
import QuestionPage from "../components/QuestionPage";

const questionText = `
A prime number is generated using a Kaprekar pattern:
1 2 3 ... n (n-1) ... 3 2 1
Find the next number that follows this pattern. That number n lies between 1000 and 3000.
`;

const pythonCode = `
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)

for n in range(1000, 3001):
    left = ''.join(str(j) for j in range(1, n+1))
    right = ''.join(str(j) for j in range(n-1, 0, -1))
    a = left + right
    b = int(a)

    if b % 3 == 0 or b % 11 == 0 or b % 7 == 0:
        continue

    if is_prime(b):
        print("n =", n, "prime =", b)
        break
`;

function Q1() {
  return (
    <QuestionPage
      title="Question 1"
      questionText={questionText}
      pythonCode={pythonCode}
      apiEndpoint="http://127.0.0.1:5000/api/q1"
    />
  );
}

export default Q1;
