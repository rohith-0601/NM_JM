import React, { useState } from "react";
import axios from "axios";

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

// ✅ Internal CSS
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
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    color: "#1F1C2C",
  },
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
    whiteSpace: "pre-wrap",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)",
    color: "#000",
  },
};

function Q7() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/q7");
      if (res.data?.output) {
        setResult(res.data.output);
      } else {
        setResult(JSON.stringify(res.data, null, 2));
      }
    } catch (err) {
      setResult("Error fetching results");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Question 7</h2>
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

export default Q7;
