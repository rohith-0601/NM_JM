import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const questionText = `
Find primes of the form 2^n - 1 for n in a given range, excluding n divisible by 4.
`;

const pythonCode = `
from gmpy2 import *
import sys
sys.set_int_max_str_digits(0)

# Compute primes of the form 2^n - 1 for n in range(start_n, end_n)
# excluding n divisible by 4
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
  primeItem: { marginBottom: "0.5rem", wordBreak: "break-all" },
  timer: { textAlign: "center", marginTop: "0.5rem", fontWeight: "bold", color: "#1F1C2C" },
};

function Q3() {
  const [startN, setStartN] = useState(2201);
  const [endN, setEndN] = useState(2300);
  const [result, setResult] = useState([]);
  const [bValues, setBValues] = useState({ b1: null, b2: null });
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const runCode = async () => {
    if (startN > endN) {
      alert("Start must be less than or equal to End");
      return;
    }

    setLoading(true);
    setResult([]);
    setBValues({ b1: null, b2: null });
    setSeconds(0);

    timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);

    try {
      const res = await axios.post("http://127.0.0.1:5001/api/q3", { start: startN, end: endN });
      if (res.data?.results) {
        setResult(res.data.results.map(r => r.prime));
        setBValues({ b1: res.data.b1, b2: res.data.b2 });
      } else {
        setResult([JSON.stringify(res.data, null, 2)]);
      }
    } catch (err) {
      setResult(["Error fetching results"]);
      console.error(err);
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
        <h2 style={styles.title}>Question 3</h2>
        <p style={styles.questionBox}>{questionText}</p>

        <div style={styles.inputBox}>
          <input type="number" style={styles.input} value={startN} onChange={e => setStartN(Number(e.target.value))} placeholder="Start n" />
          <input type="number" style={styles.input} value={endN} onChange={e => setEndN(Number(e.target.value))} placeholder="End n" />
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

        {result.length > 0 && (
          <div style={styles.outputBox}>
            {bValues.b1 && <div style={styles.primeItem}>b1: {bValues.b1}</div>}
            {bValues.b2 && <div style={styles.primeItem}>b2: {bValues.b2}</div>}
            {result.map((prime, i) => (
              <div key={i} style={styles.primeItem}>{prime}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Q3;
