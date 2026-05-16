import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/AdminDashboard.css";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/analytics");

      setAnalytics(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load admin analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="analytics-loading-pro">
        <div className="pulse-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Loading dashboard analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error-pro">
        <strong>!</strong>
        <p>{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const {
    summary = {},
    lowStockProducts = [],
    outOfStockProducts = [],
    recentOrders = [],
  } = analytics;

  const cards = [
    ["Total Products", summary.totalProducts ?? 0, "📦", ""],
    ["Total Orders", summary.totalOrders ?? 0, "🛒", ""],
    [
      "Total Revenue",
      `£${Number(summary.totalRevenue || 0).toFixed(2)}`,
      "💷",
      "premium",
    ],
    ["Total Users", summary.totalUsers ?? 0, "👤", ""],
    ["Pending Orders", summary.pendingOrders ?? 0, "⏳", ""],
    ["Delivered Orders", summary.deliveredOrders ?? 0, "✅", ""],
    ["Total Reviews", summary.totalReviews ?? 0, "💬", ""],
    ["Average Rating", Number(summary.averageRating || 0).toFixed(1), "⭐", ""],
    ["Low Stock", summary.lowStockCount ?? 0, "⚠️", "warning"],
    ["Out of Stock", summary.outOfStockCount ?? 0, "⛔", "danger"],
    [
      "Inventory Value",
      `£${Number(summary.inventoryValue || 0).toFixed(2)}`,
      "🏷️",
      "",
    ],
  ];

  return (
    <section className="analytics-pro">
      <div className="analytics-head-pro">
        <div>
          <span>Business Intelligence</span>
          <h2>Analytics Overview</h2>
          <p>
            Real-time overview of products, revenue, orders, users, reviews,
            and stock health.
          </p>
        </div>

        <button type="button" onClick={fetchAnalytics}>
          Refresh
        </button>
      </div>

      <div className="analytics-grid-pro">
        {cards.map(([label, value, icon, type]) => (
          <div key={label} className={`analytics-card-pro ${type}`}>
            <div className="analytics-card-icon">{icon}</div>
            <p>{label}</p>
            <h3>{value}</h3>
          </div>
        ))}
      </div>

      <div className="analytics-lower-grid-pro">
        <div className="alert-panel-pro">
          <span className="section-pill warning">Stock Warning</span>
          <h3>Low Stock Alerts</h3>
          <p>Products with 1–5 items left.</p>

          {lowStockProducts.length === 0 ? (
            <div className="good-state-pro">✓ No low stock products.</div>
          ) : (
            <div className="alert-list-pro">
              {lowStockProducts.map((product) => (
                <div key={product._id} className="alert-product-pro">
                  <img src={product.image} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>
                      {product.brand} · {product.category}
                    </span>
                    <em className="warning">
                      Only {product.countInStock} left
                    </em>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="alert-panel-pro">
          <span className="section-pill danger">Stock Critical</span>
          <h3>Out of Stock Products</h3>
          <p>Products currently unavailable.</p>

          {outOfStockProducts.length === 0 ? (
            <div className="good-state-pro">✓ No out of stock products.</div>
          ) : (
            <div className="alert-list-pro">
              {outOfStockProducts.map((product) => (
                <div key={product._id} className="alert-product-pro">
                  <img src={product.image} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>
                      {product.brand} · {product.category}
                    </span>
                    <em className="danger">Out of stock</em>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="orders-panel-pro">
        <span className="section-pill">Recent Orders</span>
        <h3>Latest Customer Orders</h3>
        <p>Latest 5 customer orders from the platform.</p>

        {recentOrders.length === 0 ? (
          <div className="orders-empty-pro">
            <strong>No recent orders yet</strong>
            <span>New orders will appear here once checkout is connected.</span>
          </div>
        ) : (
          <div className="orders-table-shell-pro">
            <table className="orders-table-pro">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.user?.name || "Unknown User"}</td>
                    <td>£{Number(order.totalPrice || 0).toFixed(2)}</td>
                    <td>
                      <span
                        className={`order-status-pro ${
                          order.isDelivered ? "delivered" : "pending"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "Pending"}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminAnalytics;