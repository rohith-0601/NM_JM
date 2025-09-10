import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const questionText = `
A prime number is generated using a Kaprekar pattern:
1 2 3 ... n (n-1) ... 3 2 1
Find the next number that follows this pattern.
`;

const pythonCode = `
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)

# start and end are now received from frontend
for n in range(start, end+1):
    left = ''.join(str(j) for j in range(1, n+1))
    right = ''.join(str(j) for j in range(n-1, 0, -1))
    b = mpz(left + right)
    if b % 3 == 0 or b % 7 == 0 or b % 11 == 0:
        continue
    if is_prime(b):
        print(n, b)
        break
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
  outputBox: { background: "#FCFCF7", padding: "1rem", marginTop: "1rem", borderRadius: "8px", fontFamily: "monospace", whiteSpace: "pre-wrap", wordWrap: "break-word", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)", color: "#000" },
  timer: { textAlign: "center", marginTop: "0.5rem", fontWeight: "bold", color: "#1F1C2C" },
};

function Q1() {
  const [start, setStart] = useState(1000);
  const [end, setEnd] = useState(3000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const runCode = async () => {
    setLoading(true);
    setResult(null);
    setSeconds(0);

    // start timer
    timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);

    try {
      const res = await axios.post("http://127.0.0.1:5001/api/q1", { start, end });
      if (res.data?.result) {
        const { n, kaprekar_number } = res.data.result;
        setResult(`n = ${n}\nKaprekar prime = ${kaprekar_number}`);
      } else {
        setResult("No Kaprekar prime found in this range");
      }
    } catch (err) {
      console.error(err);
      setResult("Error fetching results");
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
        <h2 style={styles.title}>Question 1</h2>
        <p style={styles.questionBox}>{questionText}</p>

        <div style={styles.inputBox}>
          <input type="number" style={styles.input} value={start} onChange={e => setStart(Number(e.target.value))} placeholder="Start (e.g., 1000)" />
          <input type="number" style={styles.input} value={end} onChange={e => setEnd(Number(e.target.value))} placeholder="End (e.g., 3000)" />
        </div>

        <div style={styles.codeBox}>
          <pre>{pythonCode}</pre>
        </div>

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
        {result && <div style={styles.outputBox}>{result}</div>}
      </div>
    </div>
  );
}

export default Q1;
