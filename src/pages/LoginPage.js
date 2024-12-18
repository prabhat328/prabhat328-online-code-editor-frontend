import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Send POST request to backend for login
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        { email, password },
        { withCredentials: true } // Ensures cookies (JWT) are sent
      );

      // Handle success
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/editor"); // Redirect to the editor/dashboard
      }, 1500);
    } catch (err) {
      // Handle specific error messages
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
    }
  };

  return (
    <div className="loginPageWrapper">
      <h1 className="titleLabel">Welcome to Too-Coderzz !!</h1>
      <div className="formWrapper">
        <img src="/giphy.gif" alt="Loading..." className="formGif" />
        <h4 className="mainLabel">Fill Your Login Credentials</h4>

        <form onSubmit={handleSubmit} className="inputGroup">
          <input
            type="email"
            className="inputBox"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="inputBox"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn submitBtn">
            Submit
          </button>
        </form>

        {/* Display errors and success messages */}
        {error && <p className="errorMessage">{error}</p>}
        {success && <p className="successMessage">{success}</p>}

        <span className="registerPageSpan">
          If you don't have an account? <a href="/register">Register Now</a>
        </span>
      </div>

      <footer>
        Built with 💚 by <a href="#">Prabhat Tiwari</a> and{" "}
        <a href="#">Vedant Vaidya</a>
      </footer>
    </div>
  );
}

export default LoginPage;
