import React from "react";
import QuestionPage from "../components/QuestionPage";

const questionText = `
Check whether given numbers constructed with Mersenne primes
form perfect numbers using the sigma function.
`;

const pythonCode = `
import sys
sys.set_int_max_str_digits(0)

def check_perfect(p, mprime):
    n = (1 << (p - 1)) * mprime
    s1 = (1 << p) - 1
    s2 = mprime + 1
    total = s1 * s2
    ok = (total == 2 * n)

    print("\\ncheck for p =", p)
    print("mersenne prime :", mprime)
    print("number N       :", n)
    print("sigma part1    :", s1)
    print("sigma part2    :", s2)
    print("sigma(N)       :", total)
    print("2N             :", 2 * n)
    print("result         :", "perfect" if ok else "not perfect")

m1 = int("14759799...71007")
m2 = int("44608755...361")
check_perfect(2203, m1)
check_perfect(2281, m2)
`;

function Q6() {
  return (
    <QuestionPage
      title="Question 6"
      questionText={questionText}
      pythonCode={pythonCode}
      apiEndpoint="http://127.0.0.1:5000/api/q6"
    />
  );
}

export default Q6;
