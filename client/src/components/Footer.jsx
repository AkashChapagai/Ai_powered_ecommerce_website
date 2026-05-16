import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-glow footer-glow-one"></div>
      <div className="footer-glow footer-glow-two"></div>

      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>AI</span>
              Akash AI Shopping
            </Link>

            <p>
              An AI-enhanced full-stack e-commerce platform designed to deliver
              smarter product discovery, secure shopping, and a smoother online
              buying experience.
            </p>

            <div className="footer-feature-tags">
              <span>AI Recommendations</span>
              <span>Secure Auth</span>
              <span>MERN Stack</span>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h3>Shop</h3>
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
              <Link to="/cart">Shopping Cart</Link>
              <Link to="/checkout">Checkout</Link>
            </div>

            <div className="footer-column">
              <h3>Account</h3>
              <Link to="/login">Login</Link>
              <Link to="/register">Create Account</Link>
              <span>Saved Cart</span>
              <span>Order Tracking</span>
            </div>

            <div className="footer-column">
              <h3>Platform Features</h3>
              <span>Smart Product Search</span>
              <span>Personalised Suggestions</span>
              <span>Product Management</span>
              <span>Admin Dashboard</span>
            </div>

            <div className="footer-column">
              <h3>Project</h3>
              <span>Final Year Project</span>
              <span>De Montfort University</span>
              <span>Full-Stack E-Commerce</span>
              <span>AI-Powered System</span>
            </div>
          </div>
        </div>

        <div className="footer-feature-strip">
          <div className="footer-feature-card">
            <span className="footer-icon">🤖</span>
            <div>
              <strong>AI Product Recommendation</strong>
              <p>Suggests relevant products based on user activity.</p>
            </div>
          </div>

          <div className="footer-feature-card">
            <span className="footer-icon">🛒</span>
            <div>
              <strong>Smart Shopping Flow</strong>
              <p>Supports browsing, cart, checkout, and account access.</p>
            </div>
          </div>

          <div className="footer-feature-card">
            <span className="footer-icon">🔐</span>
            <div>
              <strong>Secure Authentication</strong>
              <p>JWT-based login system with protected user access.</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {year} Akash AI Shopping. Final Year Project by{" "}
            <strong>Akash Chapagai</strong>.
          </p>

          <div className="footer-bottom-links">
            <span>Built with React, Node.js, Express & MongoDB</span>
            <span className="footer-dot"></span>
            <span>AI-Enhanced E-Commerce Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;