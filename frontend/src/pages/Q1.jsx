import React, { useState } from "react";
import axios from "axios";

const questionText = `
A prime number is generated using a Kaprekar pattern:
1 2 3 ... n (n-1) ... 3 2 1
Find the next number that follows this pattern. That number n lies between 1000 and 3000.
`;

const pythonCode = `
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)

for n in range(1000, 3001):
    left = ''.join(str(j) for j in range(1, n+1))
    right = ''.join(str(j) for j in range(n-1, 0, -1))
    a = left + right
    b = int(a)

    if b % 3 == 0 or b % 11 == 0 or b % 7 == 0:
        continue

    if is_prime(b):
        print("n =", n, "prime =", b)
        break
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
    whiteSpace: "pre-wrap",   // ✅ wrap code lines
    wordBreak: "break-word",  // ✅ break long words
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
    wordWrap: "break-word",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)",
    color: "#000",
  },
};

function Q1() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setResult(null);
    try {
      // 🔹 Adjust port if you’re running Flask on something other than 5000
      const res = await axios.get("http://127.0.0.1:5001/api/q1");
      if (res.data?.result) {
        const { n, kaprekar_number } = res.data.result;
        setResult(`n = ${n}\nKaprekar prime = ${kaprekar_number}`);
      } else {
        setResult("No result received");
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
        <h2 style={styles.title}>Question 1</h2>
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

export default Q1;
