import React, { useState } from "react";
import axios from "axios";

const questionText = `
Check whether given numbers constructed with Mersenne primes
form perfect numbers using the sigma function.
`;

const pythonCode = `
def check_perfect(p, mprime):
    n = (1 << (p - 1)) * mprime
    s1 = (1 << p) - 1
    s2 = mprime + 1
    total = s1 * s2
    ok = (total == 2 * n)
    print("p:", p)
    print("mersenne_prime:", mprime)
    print("N:", n)
    print("sigma_part1:", s1)
    print("sigma_part2:", s2)
    print("sigma(N):", total)
    print("2N:", 2 * n)
    print("result:", "perfect" if ok else "not perfect")
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
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)",
    color: "#000",
    maxHeight: "60vh",
    overflowY: "auto",
  },
};

function Q6() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/q6");

      if (res.data?.results) {
        // Format each result as readable text
        const formatted = res.data.results
          .map((r, idx) => {
            return `Result ${idx + 1}:\n` +
              `p: ${r.p}\n` +
              `mersenne_prime: ${r.mersenne_prime}\n` +
              `N: ${r.N}\n` +
              `sigma_part1: ${r.sigma_part1}\n` +
              `sigma_part2: ${r.sigma_part2}\n` +
              `sigma(N): ${r.sigma_N}\n` +
              `2N: ${r["2N"]}\n` +
              `result: ${r.result}\n`;
          })
          .join("\n---------------------------\n");

        setResult(formatted);
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
        <h2 style={styles.title}>Question 6</h2>
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

export default Q6;
