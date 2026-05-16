import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const logoutHandler = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="lux-header">
      <div className="lux-announcement">
        <span>Premium AI-powered shopping experience</span>
        <span>Fast checkout • Smart recommendations • Secure orders</span>
      </div>

      <nav className="lux-navbar">
        <Link to="/" className="lux-logo" onClick={closeMenu}>
          <span className="lux-logo-mark">A</span>

          <span className="lux-logo-text">
            Akash<span>AI</span>
          </span>
        </Link>

        <button
          type="button"
          className={`lux-menu-btn ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`lux-nav-panel ${menuOpen ? "is-open" : ""}`}>
          <div className="lux-nav-links">
            <NavLink to="/" onClick={closeMenu} className="lux-nav-link">
              Home
            </NavLink>

            <NavLink to="/products" onClick={closeMenu} className="lux-nav-link">
              Products
            </NavLink>

            <NavLink to="/cart" onClick={closeMenu} className="lux-nav-link">
              Cart
            </NavLink>

            {userInfo && (
              <NavLink
                to="/my-orders"
                onClick={closeMenu}
                className="lux-nav-link"
              >
                My Orders
              </NavLink>
            )}

            {userInfo?.role === "admin" && (
              <div className="lux-admin-links">
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className="lux-nav-link lux-admin-link"
                >
                  Admin Products
                </NavLink>

                <NavLink
                  to="/admin/orders"
                  onClick={closeMenu}
                  className="lux-nav-link lux-admin-link"
                >
                  Admin Orders
                </NavLink>
              </div>
            )}
          </div>

          <div className="lux-nav-actions">
            {userInfo ? (
              <>
                <div className="lux-user-card">
                  <span className="lux-user-avatar">
                    {userInfo.name?.charAt(0).toUpperCase() || "U"}
                  </span>

                  <div>
                    <span className="lux-user-label">Signed in as</span>
                    <strong>{userInfo.name || "User"}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logoutHandler}
                  className="lux-logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="lux-login-btn"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className="lux-register-btn"
                >
                  Create Account
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;