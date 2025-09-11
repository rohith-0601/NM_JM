import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div className="home-container">
      <div className="question">
        <h2>Welcome to Prime Numbers Assignment 🚀</h2>
        <p className="question-box">
          This project explores prime numbers through different mathematical
          patterns and properties and python modules. Select any question below to see its problem
          statement, Python solution, and computed results.
        </p>

        <div className="question-buttons">
          <Link to="/q1"><button className="btn">Question 1</button></Link>
          <Link to="/q2"><button className="btn">Question 2</button></Link>
          <Link to="/q3"><button className="btn">Question 3</button></Link>
          <Link to="/q4"><button className="btn">Question 4</button></Link>
          <Link to="/q5"><button className="btn">Question 5</button></Link>
          <Link to="/q6"><button className="btn">Question 6</button></Link>
          <Link to="/q7"><button className="btn">Question 7</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
