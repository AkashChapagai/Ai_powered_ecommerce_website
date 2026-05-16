import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (!password) {
      return {
        label: "Password strength",
        className: "empty",
        width: "0%",
      };
    }

    if (score <= 2) {
      return {
        label: "Weak password",
        className: "weak",
        width: "35%",
      };
    }

    if (score <= 4) {
      return {
        label: "Good password",
        className: "good",
        width: "70%",
      };
    }

    return {
      label: "Strong password",
      className: "strong",
      width: "100%",
    };
  }, [password]);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      login(res.data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-orb register-orb-one"></div>
      <div className="register-orb register-orb-two"></div>

      <div className="register-shell">
        <aside className="register-showcase">
          <div className="register-pill">Join the AI shopping experience</div>

          <div className="register-showcase-content">
            <span className="register-mini-title">Create your account</span>
            <h1>Shop faster, smarter, and more personally.</h1>
            <p>
              Sign up to unlock saved carts, personalised recommendations,
              order tracking, and a smoother checkout experience.
            </p>
          </div>

          <div className="register-stats">
            <div>
              <strong>AI</strong>
              <span>Product suggestions</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Account access</span>
            </div>

            <div>
              <strong>Fast</strong>
              <span>Checkout flow</span>
            </div>
          </div>
        </aside>

        <div className="register-card">
          <div className="register-card-header">
            <span className="register-kicker">New account</span>
            <h2>Create account</h2>
            <p>
              Join Akash AI Shopping and start building your personalised
              shopping profile.
            </p>
          </div>

          {error && (
            <div className="register-error" role="alert">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          <form className="register-form" onSubmit={submitHandler}>
            <div className="register-field">
              <label htmlFor="name">Full name</label>
              <div className="register-input-wrap">
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="email">Email address</label>
              <div className="register-input-wrap">
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

            <div className="register-field">
              <div className="register-label-row">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="register-input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength="6"
                />
              </div>

              <div className="register-strength">
                <div className="register-strength-top">
                  <span>{passwordStrength.label}</span>
                  <small>Minimum 6 characters</small>
                </div>

                <div className="register-strength-track">
                  <div
                    className={`register-strength-bar ${passwordStrength.className}`}
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="register-field">
              <div className="register-label-row">
                <label htmlFor="confirmPassword">Confirm password</label>
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="register-input-wrap">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength="6"
                />
              </div>

              {confirmPassword && (
                <p
                  className={
                    passwordsMatch
                      ? "register-match success"
                      : "register-match warning"
                  }
                >
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match yet"}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="register-security-note">
            <span>🔒</span>
            <p>Your account is protected with secure authentication.</p>
          </div>

          <p className="register-bottom-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;