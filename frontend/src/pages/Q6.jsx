import React, { useState, useEffect } from "react";
import axios from "axios";

const questionText = `
Check whether a number constructed with a Mersenne prime
forms a perfect number using the sigma function.
`;

const pythonCode = `
def check_perfect(p):
    mersenne = (mpz(1) << p) - 1  
    if not mersenne.is_prime():
        return {
            "p": p,
            "mersenne_prime": str(mersenne),
            "result": "not perfect (Mersenne not prime)"
        }
    n = (mpz(1) << (p - 1)) * mersenne  
    return {
        "p": p,
        "mersenne_prime": str(mersenne),
        "N": str(n),
        "result": "perfect"
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
  const [p, setP] = useState("");
  const [result, setResult] = useState(null);
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
    setResult(null);
    try {
      const params = {};
      if (p) params.p = p;

      const res = await axios.get("http://127.0.0.1:5001/api/q6", { params });

      if (res.data?.result) {
        setResult(res.data.result);
      } else {
        setResult({ error: "No result found" });
      }
    } catch (err) {
      console.error(err);
      setResult({ error: "Error fetching results" });
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Question 6</h2>
        <p style={styles.questionBox}>{questionText}</p>

        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="Enter exponent p"
            style={styles.inputBox}
            value={p}
            onChange={(e) => setP(e.target.value)}
          />
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

        {result && (
          <div style={styles.outputBox}>
            {result.error ? (
              <div>{result.error}</div>
            ) : (
              <>
                <div><strong>p:</strong> {result.p}</div>
                <div><strong>Mersenne Prime:</strong> {result.mersenne_prime}</div>
                {result.N && <div><strong>N:</strong> {result.N}</div>}
                <div><strong>Result:</strong> {result.result}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Q6;
