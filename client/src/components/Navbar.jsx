import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Akash_AI Shoping</h2>

      <div style={styles.links}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    height: "70px",
    padding: "0 40px",
    background: "#111827",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "24px",
  },
  links: {
    display: "flex",
    gap: "20px",
    fontSize: "16px",
  },
};

export default Navbar;