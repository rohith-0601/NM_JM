import React from "react";
import QuestionPage from "../components/QuestionPage";

const questionText = `
Using the primes b1 and b2 from Question 3, compute the square ranges
and find the first 6 primes between b1^2 and b2^2 + 1.
`;

const pythonCode = `
from gmpy2 import is_prime
from prime3 import b1, b2
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)
c = pow(b1, 2)
d = pow(b2, 2) + 1
primes = set()
i = 0
for n in range(c, d):
    if n % 3 == 0 or n % 11 == 0 or n % 7 == 0 or n % 5 == 0 or n % 2 == 0:
        status = False
    else:
        status = is_prime(n)
    if status:
        primes.add(n)
        i += 1
        if i == 6: break
print(primes, len(primes))
`;

function Q4() {
  return (
    <QuestionPage
      title="Question 4"
      questionText={questionText}
      pythonCode={pythonCode}
      apiEndpoint="http://127.0.0.1:5000/api/q4"
    />
  );
}

export default Q4;
