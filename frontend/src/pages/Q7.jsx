import React, { useState } from "react";
import axios from "axios";

const questionText = `
Generate a random 50-digit odd number and attempt to decompose it
into a sum of three primes using a weak Goldbach approach.
`;

const pythonCode = `
from gmpy2 import mpz, is_prime, next_prime
import random

# Generate a random 50-digit odd number
lower = 10**49
upper = 10**50 - 1
N = random.randrange(lower, upper)
if N % 2 == 0:
    N += 1

# Attempt weak Goldbach decomposition
def weak_goldbach_three_primes(n, trials=10000):
    if n <= 5 or n % 2 == 0:
        return None
    for p1 in [3,5,7,11,13,17,19]:
        remainder = n - p1
        if remainder % 2 != 0:
            continue
        midpoint = remainder // 2
        candidate = next_prime(midpoint)
        for _ in range(trials):
            p2 = candidate
            p3 = remainder - p2
            if p3 > 1 and is_prime(p3):
                return (p1, p2, p3)
            candidate = next_prime(candidate)
    return None

triple = weak_goldbach_three_primes(mpz(N))
print("Random number:", N)
if triple:
    print("Primes triple:", triple)
else:
    print("No decomposition found")
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
    margin: "0.5rem auto",
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
  input: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "1rem",
  },
};

function Q7() {
  const [inputNumber, setInputNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    if (!inputNumber) {
      setResult("Please enter a number");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      // Send inputNumber to backend
      const res = await axios.post("http://127.0.0.1:5001/api/q7", {
        number: inputNumber,
      });

      if (res.data?.random_base) {
        let output = `Random number:\n${res.data.random_base}\n\n`;
        if (res.data.primes_triple?.length) {
          output += `Primes triple:\n${res.data.primes_triple.join(", ")}`;
        } else {
          output += "No decomposition found";
        }
        setResult(output);
      } else {
        setResult("No output received");
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

        {/* Input field for dynamic number */}
        <input
          type="text"
          placeholder="Enter a number here..."
          value={inputNumber}
          onChange={(e) => setInputNumber(e.target.value)}
          style={styles.input}
        />

        {/* Python code display */}
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
