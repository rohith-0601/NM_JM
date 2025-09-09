import React, { useState } from "react";
import axios from "axios";

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
primes = []
i = 0
for n in range(c, d):
    if n % 2 == 0 or n % 3 == 0 or n % 5 == 0 or n % 7 == 0 or n % 11 == 0:
        continue
    if is_prime(n):
        primes.append(n)
        i += 1
        if i == 6: break
print(primes, len(primes))
`;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "75vh",
    background: "linear-gradient(135deg, #928DAB, #1F1C2C)",
    padding: "20px",
  },
  card: {
    background: "#FEFAF1",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
    maxWidth: "900px",
    width: "100%",
  },
  title: { textAlign: "center", marginBottom: "1rem", color: "#1F1C2C" },
  questionBox: {
    background: "#FCFCF7",
    padding: "1rem",
    borderLeft: "4px solid #928DAB",
    marginBottom: "1.5rem",
    borderRadius: "6px",
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#333",
  },
  codeBox: {
    background: "#1F1C2C",
    color: "#FEFAF1",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontFamily: "monospace",
    fontSize: "0.9rem",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  button: {
    background: "linear-gradient(135deg, #928DAB, #1F1C2C)",
    color: "#FEFAF1",
    border: "none",
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    display: "block",
    margin: "0 auto",
    transition: "0.3s",
  },
  outputBox: {
    background: "#FCFCF7",
    padding: "1rem",
    marginTop: "1rem",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "0.9rem",
    lineHeight: "1.4",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)",
    color: "#000",
    maxHeight: "60vh",
    overflowY: "auto",
  },
};

function Q4() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get("http://127.0.0.1:5001/api/q4");
      if (res.data?.primes_found_in_demo_range) {
        // Only print numbers, each in a new line
        setResult(res.data.primes_found_in_demo_range.join("\n"));
      } else if (res.data?.primes) {
        setResult(res.data.primes.join("\n"));
      } else {
        setResult("No primes found");
      }
    } catch (err) {
      console.error(err);
      setResult("Error fetching results");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Question 4</h2>
        <p style={styles.questionBox}>{questionText}</p>

        <div style={styles.codeBox}>
          <pre>{pythonCode}</pre>
        </div>

        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.opacity = 0.8)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
          onClick={runCode}
        >
          {loading ? "Running..." : "Run Code ▶"}
        </button>

        {result && <div style={styles.outputBox}>{result}</div>}
      </div>
    </div>
  );
}

export default Q4;
