import React, { useState, useEffect } from "react";
import axios from "axios";

const questionText = `
Check whether given numbers constructed with Mersenne primes
form perfect numbers using the sigma function.
Only the resulting numbers (N) will be displayed.
`;

const pythonCode = `
def check_perfect(p, mprime):
    n = (mpz(1) << (p - 1)) * mprime
    s1 = (mpz(1) << p) - 1
    s2 = mprime + 1
    return {
        "p": p,
        "mersenne_prime": str(mprime),
        "N": str(n),
        "sigma_N": str(s1 * s2),
        "2N": str(2 * n),
        "result": "perfect" if (s1 * s2) == 2 * n else "not perfect"
    }
`;

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh", background: "linear-gradient(135deg, #928DAB, #1F1C2C)", padding: "20px" },
  card: { background: "#FEFAF1", padding: "2rem", borderRadius: "12px", boxShadow: "0 6px 12px rgba(0,0,0,0.15)", maxWidth: "900px", width: "100%" },
  title: { textAlign: "center", marginBottom: "1rem", color: "#1F1C2C" },
  questionBox: { background: "#FCFCF7", padding: "1rem", borderLeft: "4px solid #928DAB", marginBottom: "1.5rem", borderRadius: "6px", fontSize: "1rem", lineHeight: "1.6", color: "#333" },
  codeBox: { background: "#1F1C2C", color: "#FEFAF1", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontFamily: "monospace", fontSize: "0.9rem", whiteSpace: "pre-wrap", wordBreak: "break-word" },
  inputRow: { display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" },
  inputBox: { padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #928DAB", fontSize: "1rem", flex: 1, minWidth: "200px" },
  button: { background: "linear-gradient(135deg, #928DAB, #1F1C2C)", color: "#FEFAF1", border: "none", padding: "0.7rem 1.5rem", fontSize: "1rem", borderRadius: "8px", cursor: "pointer", display: "block", margin: "0 auto", transition: "0.3s" },
  outputBox: { background: "#FCFCF7", padding: "1rem", marginTop: "1rem", borderRadius: "8px", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)", color: "#000", maxHeight: "50vh", overflowY: "auto" },
  timer: { textAlign: "center", marginBottom: "1rem", fontWeight: "bold" },
};

function Q6() {
  const [b1, setB1] = useState("");
  const [b2, setB2] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (loading) {
      setSeconds(0);
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const runCode = async () => {
    setLoading(true);
    setResult([]);
    try {
      const params = {};
      if (b1) params.b1 = b1;
      if (b2) params.b2 = b2;

      const res = await axios.get("http://127.0.0.1:5001/api/q6", { params });

      if (res.data?.results) {
        const numbers = res.data.results.map((r) => r.N);
        setResult(numbers.join("\n"));
      } else {
        setResult(["No numbers found"]);
      }
    } catch (err) {
      console.error(err);
      setResult(["Error fetching results"]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Question 6</h2>
        <p style={styles.questionBox}>{questionText}</p>

        <div style={styles.inputRow}>
          <input type="text" placeholder="Optional: b1 Mersenne prime" style={styles.inputBox} value={b1} onChange={(e) => setB1(e.target.value)} />
          <input type="text" placeholder="Optional: b2 Mersenne prime" style={styles.inputBox} value={b2} onChange={(e) => setB2(e.target.value)} />
        </div>

        <div style={styles.codeBox}>
          <pre>{pythonCode}</pre>
        </div>

        {loading && <div style={styles.timer}>⏱ Time elapsed: {seconds}s</div>}

        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.opacity = 0.8)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
          onClick={runCode}
        >
          {loading ? "Running..." : "Run Code ▶"}
        </button>

        {result.length > 0 && (
          <div style={styles.outputBox}>
            {result.map((n, i) => (
              <div key={i}>{n}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Q6;
