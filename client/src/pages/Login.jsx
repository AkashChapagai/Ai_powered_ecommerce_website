import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      login(res.data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      <div className="login-shell">
        <aside className="login-showcase">
          <div className="login-brand-pill">AI Powered E-Commerce</div>

          <div className="login-showcase-content">
            <span className="login-small-label">Welcome to</span>
            <h1>Akash AI Shopping</h1>
            <p>
              Log in to access your personalised shopping experience, saved
              cart, order tracking, and smart product recommendations.
            </p>
          </div>

          <div className="login-benefit-grid">
            <div className="login-benefit-card">
              <span>01</span>
              <strong>Faster checkout</strong>
              <p>Use saved details and complete purchases quickly.</p>
            </div>

            <div className="login-benefit-card">
              <span>02</span>
              <strong>Smart recommendations</strong>
              <p>Discover products based on your shopping behaviour.</p>
            </div>

            <div className="login-benefit-card">
              <span>03</span>
              <strong>Order tracking</strong>
              <p>Check your orders and account details in one place.</p>
            </div>
          </div>
        </aside>

        <div className="login-card">
          <div className="login-card-header">
            <span className="login-kicker">Secure account access</span>
            <h2>Welcome back</h2>
            <p>Sign in to continue shopping with your AI Shop account.</p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          <form className="login-form" onSubmit={submitHandler}>
            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <div className="login-input-wrap">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="login-input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="login-security-note">
            <span>🔒</span>
            <p>Secure login. Your account details are protected.</p>
          </div>

          <p className="login-bottom-text">
            New to Akash AI Shopping? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;