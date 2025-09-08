import React from "react";
import QuestionPage from "../components/QuestionPage";

const questionText = `
Find primes of the form (10^n - 1) / 9 where n itself is prime,
for n between 51 and 1040.
`;

const pythonCode = `
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)
for n in range(51, 1040):
    if is_prime(n):
        b = (pow(10, n) - 1) // 9
        status = is_prime(b)
        if status:
            print(b)
`;

function Q5() {
  return (
    <QuestionPage
      title="Question 5"
      questionText={questionText}
      pythonCode={pythonCode}
      apiEndpoint="http://127.0.0.1:5000/api/q5"
    />
  );
}

export default Q5;
