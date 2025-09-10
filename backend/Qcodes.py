from flask import Blueprint, jsonify
import sys, random
from gmpy2 import is_prime, mpz,next_prime


bp = Blueprint("qcodes", __name__, url_prefix="/api")

sys.set_int_max_str_digits(0)

# ----------------------------
# Helper for Q3 (to be reused in Q4)
# ----------------------------
def compute_q3():
    primes = []
    b1 = None
    b2 = None
    for n in range(2201, 2300):
        if n % 4 != 0:
            b = pow(2, n) - 1
            if b % 3 == 0 or b % 11 == 0 or b % 7 == 0:
                status = False
            else:
                status = is_prime(b)
            if status:
                if b1 is None:
                    b1 = str(b)  # convert to string
                else:
                    b2 = str(b)  # convert to string
                primes.append({"n": n, "prime": str(b)})  # convert prime to string
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
                results.append(str(b))  # ✅ convert to string
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
# ----------------------------
# Question 4 (hardcoded b1 and b2)
# ----------------------------
@bp.route("/q4", methods=["GET"])
def q4():
    # Hardcoded b1 and b2 from Q3
    b1 = mpz(
        "1475979915214180235084898622737381736312066145333169775147771216478570297878078949377407337049389289382748507531496480477281264838760259191814463365330269540496961201113430156902396093989090226259326935025281409614983499388222831448598601834318536230923772641390209490231836446899608210795482963763094236630945410832793769905399982457186322944729636418890623372171723742105636440368218459649632948538696905872650486914434637457507280441823676813517852099348660847172579408422316678097670224011990280170474894487426924742108823536808485072502240519452587542875349976558572670229633962575212637477897785501552646522609988869914013540483809865681250419497686697771007"
    )
    b2 = mpz(
        "446087557183758429571151706402101809886208632412859901111991219963404685792820473369112545269003989026153245931124316702395758705693679364790903497461147071065254193353938124978226307947312410798874869040070279328428810311754844108094878252494866760969586998128982645877596028979171536962503068429617331702184750324583009171832104916050157628886606372145501702225925125224076829605427173573964812995250569412480720738476855293681666712844831190877620606786663862190240118570736831901886479225810414714078935386562497968178729127629594924411960961386713946279899275006954917139758796061223803393537381034666494402951052059047968693255388647930440925104186817009640171764133172418132836351"
    )

    # For demonstration, we limit the range to avoid huge loops
    c = b1
    d = b1 + 10000  # 🔹 check 10000 numbers after b1² (adjust as needed)

    primes = []
    n = c
    while n < d:
        # skip obvious small divisors
        if n % 2 != 0 and n % 3 != 0 and n % 5 != 0 and n % 7 != 0 and n % 11 != 0:
            if is_prime(n):
                primes.append(str(n))
        n += 1

    return jsonify({
        "b1": str(b1),
        "b2": str(b2),
        "primes_found_in_demo_range": primes,
        "count": len(primes)
    })


# ----------------------------
# Question 5
# ----------------------------


def make_palindromes(num_digits):
    mid = num_digits // 2
    lower = 10 ** (mid - 1)
    upper = 10 ** mid

    for base in range(lower, upper):
        left = str(base)
        right = left[::-1]
        if num_digits % 2 == 1:
            pal = left + right[1:]  # odd-length
        else:
            pal = left + right      # even-length
        yield int(pal)

def find_pal_prime(min_digits=3, how_many=5):
    results = []
    digits = min_digits if min_digits % 2 == 1 else min_digits + 1  # ensure odd length
    count = 0

    while count < how_many:
        for candidate in make_palindromes(digits):
            if is_prime(candidate):
                results.append({
                    "prime_palindrome": str(candidate),
                    "size": len(str(candidate))
                })
                count += 1
                if count >= how_many:
                    break
        digits += 2  # next odd digit length

    return results

@bp.route("/q5", methods=["GET"])
def q5():
    results = find_pal_prime(min_digits=53, how_many=5)
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
    # ✅ Full numbers from Q3
    m1 = int(
        "1475979915214180235084898622737381736312066145333169775147771216478570297878078949377407337049389289382748507531496480477281264838760259191814463365330269540496961201113430156902396093989090226259326935025281409614983499388222831448598601834318536230923772641390209490231836446899608210795482963763094236630945410832793769905399982457186322944729636418890623372171723742105636440368218459649632948538696905872650486914434637457507280441823676813517852099348660847172579408422316678097670224011990280170474894487426924742108823536808485072502240519452587542875349976558572670229633962575212637477897785501552646522609988869914013540483809865681250419497686697771007"
    )
    m2 = int(
        "446087557183758429571151706402101809886208632412859901111991219963404685792820473369112545269003989026153245931124316702395758705693679364790903497461147071065254193353938124978226307947312410798874869040070279328428810311754844108094878252494866760969586998128982645877596028979171536962503068429617331702184750324583009171832104916050157628886606372145501702225925125224076829605427173573964812995250569412480720738476855293681666712844831190877620606786663862190240118570736831901886479225810414714078935386562497968178729127629594924411960961386713946279899275006954917139758796061223803393537381034666494402951052059047968693255388647930440925104186817009640171764133172418132836351"
    )

    result1 = check_perfect(2203, m1)
    result2 = check_perfect(2281, m2)

    return jsonify({"results": [result1, result2]})



# ----------------------------
# Question 7
# ----------------------------




@bp.route("/q7", methods=["GET"])
def q7():
    # Generate a random 50-digit odd number
    lower = 10**49
    upper = 10**50 - 1
    N = random.randrange(lower, upper)
    if N % 2 == 0:
        N += 1
    N = mpz(N)

    # Weak Goldbach decomposition: n = p1 + p2 + p3
    def weak_goldbach_three_primes(n, trials=10000):
        if n <= 5 or n % 2 == 0:
            return None
        for p1 in [3, 5, 7, 11, 13, 17, 19]:
            remainder = n - p1
            if remainder % 2 != 0:
                continue
            midpoint = remainder // 2
            candidate = next_prime(midpoint)
            for _ in range(trials):
                p2 = candidate
                p3 = remainder - p2
                if p3 > 1 and is_prime(p3):
                    return (int(p1), int(p2), int(p3))
                candidate = next_prime(candidate)
        return None

    triple = weak_goldbach_three_primes(N)

    if triple:
        response = {
            "random_base": str(N),
            "primes_triple": [str(triple[0]), str(triple[1]), str(triple[2])]
        }
    else:
        response = {
            "random_base": str(N),
            "primes_triple": [],
            "message": "No decomposition found (try increasing trials)"
        }

    return jsonify(response)
