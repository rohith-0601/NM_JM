# optimized_qcodes.py
from flask import Blueprint, jsonify, request
import random
import math
from gmpy2 import mpz, is_prime, next_prime

bp = Blueprint("qcodes", __name__, url_prefix="/api")

# ---------- utilities ----------
# small primes for quick trial division / wheel skipping
_SMALL_PRIMES = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,
                 101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199]

def quick_composite_check(n: mpz) -> bool:
    """Return True if n is obviously composite by small primes."""
    for p in _SMALL_PRIMES:
        if n == p:
            return False
        if n % p == 0:
            return True
    return False

def is_probable_prime(n: mpz) -> bool:
    """Fast check: do small-prime sieve then gmpy2.is_prime (probable/primality test)."""
    if n < 2:
        return False
    if quick_composite_check(n):
        return False
    # gmpy2.is_prime is fast and uses probable prime tests / deterministic checks for many sizes
    return bool(is_prime(n))

# ---------- Q1 ----------
# Find smallest n in [1000,3000] where b = concat(1..n..1) is prime (original intent).
# Optimization: build string once per n, skip using banned small-moduli first.
@bp.route("/q1", methods=["POST"])
def q1():
    data = request.json
    start = data.get("start", 1000)
    end = data.get("end", 3000)

    for n in range(start, end + 1):
        left = ''.join(str(j) for j in range(1, n+1))
        right = ''.join(str(j) for j in range(n-1, 0, -1))
        b = mpz(left + right)
        if b % 3 == 0 or b % 7 == 0 or b % 11 == 0:
            continue
        if is_probable_prime(b):
            return jsonify({"result": {"n": n, "kaprekar_number": str(b)}})

    return jsonify({"result": None})


# ---------- Q2 ----------
# Repunit primes R_n = (10^n -1)/9 where n is prime
# Only check when n is prime and use mpz pow.
@bp.route("/q2", methods=["POST"])
def q2():
    data = request.json
    start_n = int(data.get("start_n", 2))
    end_n = int(data.get("end_n", 1040))
    results = []

    for n in range(start_n, end_n + 1):
        if not is_probable_prime(mpz(n)):
            continue
        rep = (mpz(10) ** n - 1) // 9
        composite = False
        for p in _SMALL_PRIMES:
            if rep % p == 0 and rep != p:
                composite = True
                break
        if composite:
            continue
        if is_probable_prime(rep):
            results.append(str(rep))

    return jsonify({"results": results})



# ---------- Q3 ----------
# Compute Mersenne numbers 2^n - 1 in a range and return those which are prime.
# Key optimization: M_n can only be prime if n is prime. Use bit shifts for 2^n - 1.
def compute_q3_range(start_n=2201, end_n=2300):
    results = []
    b1 = None
    b2 = None
    for n in range(start_n, end_n + 1):
        # Mersenne can be prime only if exponent is prime
        if not is_probable_prime(mpz(n)):
            continue
        # compute M_n quickly using bit-shift
        m = (mpz(1) << n) - 1
        # quick small-prime divisibility by known small divisors
        if m % 3 == 0 or m % 7 == 0 or m % 11 == 0:
            continue
        if is_probable_prime(m):
            if b1 is None:
                b1 = str(m)
            elif b2 is None:
                b2 = str(m)
            results.append({"n": n, "prime": str(m)})
    return {"results": results, "b1": b1, "b2": b2}

@bp.route("/q3", methods=["POST"])
def q3():
    data = request.json
    start_n = int(data.get("start", 2201))
    end_n = int(data.get("end", 2300))
    return jsonify(compute_q3_range(start_n, end_n))



# ---------- Q4 ----------
# Given two very large numbers (b1, b2) produced in Q3, search for primes starting at b1.
# Rather than scanning every integer, use gmpy2.next_prime to jump to the next probable prime
# and check primality; limit allows safe demo runs.
# ----------------------------
# Question 4
# ----------------------------
DEFAULT_B1 = mpz(
    "1475979915214180235084898622737381736312066145333169775147771216478570297878078949377407337049389289382748507531496480477281264838760259191814463365330269540496961201113430156902396093989090226259326935025281409614983499388222831448598601834318536230923772641390209490231836446899608210795482963763094236630945410832793769905399982457186322944729636418890623372171723742105636440368218459649632948538696905872650486914434637457507280441823676813517852099348660847172579408422316678097670224011990280170474894487426924742108823536808485072502240519452587542875349976558572670229633962575212637477897785501552646522609988869914013540483809865681250419497686697771007"
)
DEFAULT_B2 = mpz(
    "446087557183758429571151706402101809886208632412859901111991219963404685792820473369112545269003989026153245931124316702395758705693679364790903497461147071065254193353938124978226307947312410798874869040070279328428810311754844108094878252494866760969586998128982645877596028979171536962503068429617331702184750324583009171832104916050157628886606372145501702225925125224076829605427173573964812995250569412480720738476855293681666712844831190877620606786663862190240118570736831901886479225810414714078935386562497968178729127629594924411960961386713946279899275006954917139758796061223803393537381034666494402951052059047968693255388647930440925104186817009640171764133172418132836351"
)

@bp.route("/q4", methods=["POST"])
def q4():
    data = request.json or {}
    b1 = mpz(data.get("b1", DEFAULT_B1))
    b2 = mpz(data.get("b2", DEFAULT_B2))
    max_primes = int(data.get("max_primes", 5))

    found = []
    current = b1
    while len(found) < max_primes:
        current = next_prime(current)
        found.append(str(current))

    return jsonify({
        "b1": str(b1),
        "b2": str(b2),
        "primes_found_in_demo_range": found,
        "count": len(found),
        "status": "ok" if found else "no primes found"
    })


# ----------------------------
# Question 5
# ----------------------------
def iter_palindromes_odd(num_digits):
    half_len = (num_digits + 1) // 2
    start = 10 ** (half_len - 1)
    end = 10 ** half_len
    for left in range(start, end):
        s = str(left)
        pal = s + s[-2::-1]
        yield mpz(pal)

@bp.route("/q5", methods=["GET"])
def q5():
    min_digits = int(request.args.get("min_digits", 3))
    how_many = int(request.args.get("how_many", 5))

    digits = min_digits if min_digits % 2 == 1 else min_digits + 1
    results = []

    while len(results) < how_many:
        for candidate in iter_palindromes_odd(digits):
            if is_prime(candidate):
                results.append(str(candidate))
                if len(results) >= how_many:
                    break
        digits += 2

    return jsonify({"results": results})

# ---------- Q6 ----------
# Verify the perfect number identity for given p and mersenne m.
def check_perfect(p, mprime):
    n = (mpz(1) << (p - 1)) * mprime
    s1 = (mpz(1) << p) - 1
    s2 = mprime + 1
    return {
        "p": p,
        "mersenne_prime": str(mprime),
        "N": str(n),
        "sigma_N": str(s1 * s2),
        "2N": str(2 * n),
        "result": "perfect" if (s1 * s2) == 2 * n else "not perfect"
    }

@bp.route("/q6", methods=["GET"])
def q6():
    m1 = mpz(
        "1475979915214180235084898622737381736312066145333169775147771216478570297878078949377407337049389289382748507531496480477281264838760259191814463365330269540496961201113430156902396093989090226259326935025281409614983499388222831448598601834318536230923772641390209490231836446899608210795482963763094236630945410832793769905399982457186322944729636418890623372171723742105636440368218459649632948538696905872650486914434637457507280441823676813517852099348660847172579408422316678097670224011990280170474894487426924742108823536808485072502240519452587542875349976558572670229633962575212637477897785501552646522609988869914013540483809865681250419497686697771007"
    )
    m2 = mpz(
        "446087557183758429571151706402101809886208632412859901111991219963404685792820473369112545269003989026153245931124316702395758705693679364790903497461147071065254193353938124978226307947312410798874869040070279328428810311754844108094878252494866760969586998128982645877596028979171536962503068429617331702184750324583009171832104916050157628886606372145501702225925125224076829605427173573964812995250569412480720738476855293681666712844831190877620606786663862190240118570736831901886479225810414714078935386562497968178729127629594924411960961386713946279899275006954917139758796061223803393537381034666494402951052059047968693255388647930440925104186817009640171764133172418132836351"
    )

    res1 = check_perfect(2203, m1)
    res2 = check_perfect(2281, m2)
    return jsonify({"results": [res1, res2]})

# ---------- Q7 ----------
# Try to express a large odd N as p1 + p2 + p3 with p1 small prime and p2,p3 primes.
# Use randomization + gmpy2.next_prime to find candidates quickly.
def weak_goldbach_three_primes(N, trials=1000):
    small_primes = [3, 5, 7, 11, 13, 17, 19]
    for p1 in small_primes:
        remainder = N - p1
        if remainder % 2 != 0:
            continue
        candidate = next_prime(remainder // 2)
        for _ in range(trials):
            p2 = candidate
            p3 = remainder - p2
            if p3 > 1 and is_prime(p3):
                return (p1, int(p2), int(p3))
            candidate = next_prime(candidate)
    return None

@bp.route("/q7", methods=["GET"])
def q7():
    lower = 10**49
    upper = 10**50 - 1
    N = mpz(random.randrange(lower, upper) | 1)  # random odd 50-digit
    triple = weak_goldbach_three_primes(N)
    if triple:
        return jsonify({"random_base": str(N), "primes_triple": [str(x) for x in triple]})
    else:
        return jsonify({"random_base": str(N), "primes_triple": [], "message": "No decomposition found"})