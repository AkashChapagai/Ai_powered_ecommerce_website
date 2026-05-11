import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(res.data));

      setLoading(false);

      navigate("/");
    } catch (err) {
      setLoading(false);

      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.card}>
        <h1>Register</h1>
        <p style={styles.subtitle}>Create your AI Shop account.</p>

        {error && <p style={styles.error}>{error}</p>}

        <form style={styles.form} onSubmit={submitHandler}>
          <div>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={styles.bottomText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    padding: "35px",
    borderRadius: "14px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: "25px",
    color: "#6b7280",
  },
  form: {
    display: "grid",
    gap: "18px",
  },
  input: {
    width: "100%",
    marginTop: "8px",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  bottomText: {
    marginTop: "20px",
    textAlign: "center",
  },
};

export default Register;