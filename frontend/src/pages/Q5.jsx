import React, { useState } from "react";
import axios from "axios";

const questionText = `
Find primes of the form (10^n - 1) / 9 where n itself is prime,
for n between 51 and 1040.
`;

const pythonCode = `
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)

for n in range(51, 1040):
    if is_prime(n):
        b = (pow(10, n) - 1) // 9
        if is_prime(b):
            print(b)
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
    wordBreak: "break-word",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)",
    color: "#000",
    maxHeight: "60vh",
    overflowY: "auto",
    overflowX: "auto",
  },
};

function Q5() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get("http://127.0.0.1:5001/api/q5");

      if (res.data?.results) {
        // Ensure we handle very large numbers as strings
        const numbers = res.data.results.map((num) => num.toString());
        setResult(numbers.join("\n"));
      } else {
        setResult(JSON.stringify(res.data, null, 2));
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
        <h2 style={styles.title}>Question 5</h2>
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

export default Q5;
