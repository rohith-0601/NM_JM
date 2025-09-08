import React from "react";
import QuestionPage from "../components/QuestionPage";

const questionText = `
Pick a random 26-digit number f, square it (c = f^2),
and check for the first 2 primes in the range [c, (c+1)^2].
`;

const pythonCode = `
import random
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)
f = random.randint(10**25, 10**26)
c = f
d = (c + 1)**2
c = c**2
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
        if i == 2: break
print(primes, len(primes))
`;

function Q7() {
  return (
    <QuestionPage
      title="Question 7"
      questionText={questionText}
      pythonCode={pythonCode}
      apiEndpoint="http://127.0.0.1:5000/api/q7"
    />
  );
}

export default Q7;
