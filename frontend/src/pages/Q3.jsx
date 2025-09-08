import React from "react";
import QuestionPage from "../components/QuestionPage";

const questionText = `
Find primes of the form 2^n - 1 for n between 2201 and 2300,
excluding n divisible by 4.
`;

const pythonCode = `
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)
a = []
b1 = 0
b2 = 0
for n in range(2201, 2300):
    if n % 4 != 0:
        b = pow(2, n) - 1
        if b % 3 == 0 or b % 11 == 0 or b % 7 == 0:
            status = False
        else:
            status = is_prime(b)
        if status:
            if b1 == 0:
                b1 = b
            else:
                b2 = b
            print(n)
            a.append(b)
`;

function Q3() {
  return (
    <QuestionPage
      title="Question 3"
      questionText={questionText}
      pythonCode={pythonCode}
      apiEndpoint="http://127.0.0.1:5000/api/q3"
    />
  );
}

export default Q3;
