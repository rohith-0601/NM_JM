import React, { useState } from "react";
import axios from "axios";

function QuestionPage({ title, questionText, pythonCode, apiEndpoint }) {
  const [result, setResult] = useState(null);

  const runCode = async () => {
    try {
      const res = await axios.get(apiEndpoint);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="question">
      <h2>{title}</h2>

      {/* Question text */}
      <div className="question-box">
        <p>{questionText}</p>
      </div>

      {/* Code section */}
      <div className="code-box">
        <pre>{pythonCode}</pre>
      </div>

      {/* Run button */}
      <button className="btn" onClick={runCode}>Run</button>

      {/* Output */}
      {result && (
        <div className="output-card">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default QuestionPage;
