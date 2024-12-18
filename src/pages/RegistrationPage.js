import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegistrationPage() {
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
      // Send POST request to register
      const response = await axios.post(
        "http://localhost:8000/auth/register",
        { email, password },
        { withCredentials: true } // Allows httpOnly cookies
      );

      // On success, show success message and redirect
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/"); // Redirect to login
      }, 2000);
    } catch (err) {
      // Check specific error responses
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
    }
  };

  return (
    <div className="loginPageWrapper">
      <h1 className="titleLabel">Welcome to Too-Coderzz !!</h1>
      <div className="formWrapper">
        <img src="/giphy.gif" alt="Loading..." className="formGif" />
        <h4 className="mainLabel">Fill Your Registration Details</h4>

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
            placeholder="Password (6-18 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn submitBtn">
            Register
          </button>
        </form>

        {/* Display errors */}
        {error && <p className="errorMessage">{error}</p>}
        {success && <p className="successMessage">{success}</p>}

        <span className="registerPageSpan">
          Already have an account? <a href="/">Login Now</a>
        </span>
      </div>

      <footer>
        Built with 💚 by <a href="#">Prabhat Tiwari</a> and{" "}
        <a href="#">Vedant Vaidya</a>
      </footer>
    </div>
  );
}

export default RegistrationPage;
