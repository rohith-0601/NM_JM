import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const questionText = `
Using the primes b1 and b2 from Question 3, compute the first N primes
starting from b1 using gmpy2 next_prime function. You can override b1, b2, or max primes.
`;

const pythonCode = `
from gmpy2 import mpz, next_prime

b1 = mpz(...)
b2 = mpz(...)
max_primes = 5
found = []
current = b1
while len(found) < max_primes:
    current = next_prime(current)
    found.append(current)
print(found)
`;

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh", background: "linear-gradient(135deg, #928DAB, #1F1C2C)", padding: "20px" },
  card: { background: "#FEFAF1", padding: "2rem", borderRadius: "12px", boxShadow: "0 6px 12px rgba(0,0,0,0.15)", maxWidth: "900px", width: "100%" },
  title: { textAlign: "center", marginBottom: "1rem", color: "#1F1C2C" },
  questionBox: { background: "#FCFCF7", padding: "1rem", borderLeft: "4px solid #928DAB", marginBottom: "1rem", borderRadius: "6px", fontSize: "1rem", lineHeight: "1.6", color: "#333" },
  inputBox: { display: "flex", gap: "10px", marginBottom: "1rem" },
  input: { flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #928DAB" },
  codeBox: { background: "#1F1C2C", color: "#FEFAF1", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", fontFamily: "monospace", fontSize: "0.9rem", whiteSpace: "pre-wrap", wordBreak: "break-word" },
  button: { background: "linear-gradient(135deg, #928DAB, #1F1C2C)", color: "#FEFAF1", border: "none", padding: "0.7rem 1.5rem", fontSize: "1rem", borderRadius: "8px", cursor: "pointer", display: "block", margin: "0 auto", transition: "0.3s" },
  outputBox: { background: "#FCFCF7", padding: "1rem", marginTop: "1rem", borderRadius: "8px", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)", color: "#000", maxHeight: "50vh", overflowY: "auto" },
  timer: { textAlign: "center", marginTop: "0.5rem", fontWeight: "bold", color: "#1F1C2C" },
};

function Q4({ defaultB1, defaultB2 }) {
  const [b1, setB1] = useState(defaultB1 || "");
  const [b2, setB2] = useState(defaultB2 || "");
  const [maxPrimes, setMaxPrimes] = useState(5);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const runCode = async () => {
    setLoading(true);
    setResult([]);
    setSeconds(0);

    timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);

    try {
      const res = await axios.post("http://127.0.0.1:5001/api/q4", {
        b1: b1 || defaultB1,
        b2: b2 || defaultB2,
        max_primes: maxPrimes
      });

      if (res.data?.primes_found_in_demo_range) {
        setResult(res.data.primes_found_in_demo_range);
      } else {
        setResult(["No primes found"]);
      }
    } catch (err) {
      console.error(err);
      setResult(["Error fetching results"]);
    }

    clearInterval(timerRef.current);
    setLoading(false);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Question 4</h2>
        <p style={styles.questionBox}>{questionText}</p>

        <div style={styles.inputBox}>
          <input type="text" style={styles.input} value={b1} onChange={e => setB1(e.target.value)} placeholder={`b1`} />
          <input type="text" style={styles.input} value={b2} onChange={e => setB2(e.target.value)} placeholder={`b2`} />
          <input type="number" style={styles.input} value={maxPrimes} onChange={e => setMaxPrimes(Number(e.target.value))} placeholder="Max primes" />
        </div>

        <div style={styles.codeBox}><pre>{pythonCode}</pre></div>

        <button
          style={styles.button}
          onMouseOver={e => (e.target.style.opacity = 0.8)}
          onMouseOut={e => (e.target.style.opacity = 1)}
          onClick={runCode}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Code ▶"}
        </button>

        {loading && <div style={styles.timer}>Elapsed: {seconds} sec</div>}

        {result.length > 0 && (
          <div style={styles.outputBox}>
            {result.map((prime, i) => <div key={i}>{prime}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Q4;
