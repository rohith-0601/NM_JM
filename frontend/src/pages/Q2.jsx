import React from "react";
import QuestionPage from "../components/QuestionPage";

const questionText = `
Find primes of the form (10^n - 1) / 9 where n itself is prime, for n between 2 and 1040.
`;

const pythonCode = `
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)

results = []
for n in range(2, 1040):
    if is_prime(n):
        b = (pow(10, n) - 1) // 9
        if is_prime(b):
            results.append(b)

print(results)  # will print list of primes
`;

function Q2() {
  return (
    <QuestionPage
      title="Question 2"
      questionText={questionText}
      pythonCode={pythonCode}
      apiEndpoint="http://127.0.0.1:5000/api/q2"
    />
  );
}

export default Q2;
