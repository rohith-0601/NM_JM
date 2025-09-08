import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Q1 from "./pages/Q1";
import Q2 from "./pages/Q2";
import Q3 from "./pages/Q3";
import Q4 from "./pages/Q4";
import Q5 from "./pages/Q5";
import Q6 from "./pages/Q6";
import Q7 from "./pages/Q7";

import "./App.css";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navbar */}
        <nav className="navbar">
          <h1 className="logo">Prime Numbers Assignment</h1>
          <ul className="nav-links">
            <li>
              <Link to="/q1">Q1</Link>
            </li>
            <li>
              <Link to="/q2">Q2</Link>
            </li>
            <li>
              <Link to="/q3">Q3</Link>
            </li>
            <li>
              <Link to="/q4">Q4</Link>
            </li>
            <li>
              <Link to="/q5">Q5</Link>
            </li>
            <li>
              <Link to="/q6">Q6</Link>
            </li>
            <li>
              <Link to="/q7">Q7</Link>
            </li>
          </ul>
        </nav>

        {/* Pages */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/q1" element={<Q1 />} />
            <Route path="/q2" element={<Q2 />} />
            <Route path="/q3" element={<Q3 />} />
            <Route path="/q4" element={<Q4 />} />
            <Route path="/q5" element={<Q5 />} />
            <Route path="/q6" element={<Q6 />} />
            <Route path="/q7" element={<Q7 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
