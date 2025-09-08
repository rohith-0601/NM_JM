from flask import Blueprint, jsonify
from gmpy2 import is_prime
import sys, random

bp = Blueprint("qcodes", __name__, url_prefix="/api")

sys.set_int_max_str_digits(0)

# ----------------------------
# Question 1
# ----------------------------
@bp.route("/q1", methods=["GET"])
def q1():
    result = None
    for n in range(1000, 3001):
        left = ''.join(str(j) for j in range(1, n + 1))
        right = ''.join(str(j) for j in range(n - 1, 0, -1))
        b = int(left + right)

        if b % 3 == 0 or b % 11 == 0 or b % 7 == 0:
            status = False
        else:
            status = is_prime(b)

        if status:
            result = {"n": n, "kaprekar_number": b}
            break
    return jsonify(result)


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
    return jsonify({"results": primes, "b1": b1, "b2": b2})


# ----------------------------
# Question 4
# ----------------------------
@bp.route("/q4", methods=["GET"])
def q4():
    # Reuse Q3 function directly
    q3_data = q3().json
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
    m1 = int("1475979915214180235084898622737381736312066145333169775147771216478570297878078949377407337049389289382748507531496480477281264838760259191814463365330269540496961201113430156902396093989090226259326935025281409614983499388222831448598601834318536230923772641390209490231836446899608210795482963763094236630945410832793769905399982457186322944729636418890623372171723742105636440368218459649632948538696905872650486914434637457507280441823676813517852099348660847172579408422316678097670224011990280170474894487426924742108823536808485072502240519452587542875349976558572670229633962575212637477897785501552646522609988869914013540483809865681250419497686697771007")
    m2 = int("446087557183758429571151706402101809886208632412859901111991219963404685792820473369112545269003989026153245931124316702395758705693679364790903497461147071065254193353938124978226307947312410798874869040070279328428810311754844108094878252494866760969586998128982645877596028979171536962503068429617331702184750324583009171832104916050157628886606372145501702225925125224076829605427173573964812995250569412480720738476855293681666712844831190877620606786663862190240118570736831901886479225810414714078935386562497968178729127629594924411960961386713946279899275006954917139758796061223803393537381034666494402951052059047968693255388647930440925104186817009640171764133172418132836351")

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
