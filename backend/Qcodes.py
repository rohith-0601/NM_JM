from flask import Blueprint, jsonify
from gmpy2 import is_prime
import sys, random

bp = Blueprint("qcodes", __name__, url_prefix="/api")

sys.set_int_max_str_digits(0)

# ----------------------------
# Helper for Q3 (to be reused in Q4)
# ----------------------------
def compute_q3():
    primes = []
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
                primes.append({"n": n, "prime": b})
    return {"results": primes, "b1": b1, "b2": b2}

# ----------------------------
# Question 1
# ----------------------------
@bp.route("/q1", methods=["GET"])
def q1():
    for n in range(1000, 3001):
        left = ''.join(str(j) for j in range(1, n + 1))
        right = ''.join(str(j) for j in range(n - 1, 0, -1))
        b = int(left + right)

        if b % 3 == 0 or b % 11 == 0 or b % 7 == 0:
            continue

        if is_prime(b):
            return jsonify({"result": {"n": n, "kaprekar_number": b}})



# ----------------------------
# Question 2
# ----------------------------
@bp.route("/q2", methods=["GET"])
def q2():
    results = []
    for n in range(2, 1040):
        if is_prime(n):
            b = (pow(10, n) - 1) // 9
            if is_prime(b):
                results.append(b)
    return jsonify({"results": results})


# ----------------------------
# Question 3
# ----------------------------
@bp.route("/q3", methods=["GET"])
def q3():
    return jsonify(compute_q3())


# ----------------------------
# Question 4
# ----------------------------
@bp.route("/q4", methods=["GET"])
def q4():
    q3_data = compute_q3()
    b1 = q3_data["b1"]
    b2 = q3_data["b2"]

    c = pow(b1, 2)
    d = pow(b2, 2) + 1

    primes = []
    i = 0
    for n in range(c, d):
        if n % 3 == 0 or n % 11 == 0 or n % 7 == 0 or n % 5 == 0 or n % 2 == 0:
            status = False
        else:
            status = is_prime(n)
        if status:
            primes.append(n)
            i += 1
            if i == 6:
                break
    return jsonify({"primes": primes, "count": len(primes)})


# ----------------------------
# Question 5
# ----------------------------
@bp.route("/q5", methods=["GET"])
def q5():
    results = []
    for n in range(51, 1040):
        if is_prime(n):
            b = (pow(10, n) - 1) // 9
            if is_prime(b):
                results.append(b)
    return jsonify({"results": results})


# ----------------------------
# Question 6
# ----------------------------
def check_perfect(p, mprime):
    n = (1 << (p - 1)) * mprime
    s1 = (1 << p) - 1
    s2 = mprime + 1
    total = s1 * s2
    ok = (total == 2 * n)

    return {
        "p": p,
        "mersenne_prime": str(mprime),
        "N": str(n),
        "sigma_part1": str(s1),
        "sigma_part2": str(s2),
        "sigma_N": str(total),
        "2N": str(2 * n),
        "result": "perfect" if ok else "not perfect"
    }

@bp.route("/q6", methods=["GET"])
def q6():
    m1 = int("1475979915...1007")  # keep full number in code
    m2 = int("4460875571...6351")  # keep full number in code

    result1 = check_perfect(2203, m1)
    result2 = check_perfect(2281, m2)

    return jsonify({"results": [result1, result2]})


# ----------------------------
# Question 7
# ----------------------------
@bp.route("/q7", methods=["GET"])
def q7():
    f = random.randint(10**25, 10**26)
    c = f
    d = (c + 1) ** 2
    c = c ** 2

    primes = []
    i = 0
    for n in range(c, d):
        if n % 3 == 0 or n % 11 == 0 or n % 7 == 0 or n % 5 == 0 or n % 2 == 0:
            status = False
        else:
            status = is_prime(n)
        if status:
            primes.append(n)
            i += 1
            if i == 2:
                break
    return jsonify({"random_base": f, "primes": primes, "count": len(primes)})
