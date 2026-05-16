import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import "../styles/AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsDeliveredHandler = async (orderId) => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to mark this order as delivered?"
    );

    if (!confirmUpdate) return;

    try {
      setMessage("");
      setError("");

      await API.put(`/orders/${orderId}/deliver`);

      setMessage("Order marked as delivered successfully.");
      fetchOrders();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update order status."
      );
    }
  };

  const formatMoney = (value) => {
    return `£${Number(value || 0).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((order) => order.isDelivered).length;
    const processingOrders = orders.filter((order) => !order.isDelivered).length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0
    );

    return {
      totalOrders,
      deliveredOrders,
      processingOrders,
      totalRevenue,
    };
  }, [orders]);

  if (loading) {
    return (
      <main className="admin-orders-page">
        <section className="orders-hero">
          <div>
            <span className="orders-kicker">Admin Control Centre</span>
            <h1>Order Management</h1>
            <p>Loading customer orders and fulfilment details...</p>
          </div>
        </section>

        <section className="orders-loading-grid">
          {[1, 2, 3].map((item) => (
            <div className="orders-loading-card" key={item}>
              <div className="loading-line loading-title"></div>
              <div className="loading-line"></div>
              <div className="loading-line loading-small"></div>
            </div>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-orders-page">
      <section className="orders-hero">
        <div className="orders-hero-content">
          <span className="orders-kicker">Admin Control Centre</span>
          <h1>Order Management</h1>
          <p>
            View customer orders, track fulfilment, monitor revenue and update
            delivery progress from one premium admin dashboard.
          </p>
        </div>

        <div className="orders-hero-metric">
          <span>Live Orders</span>
          <strong>{stats.totalOrders}</strong>
        </div>
      </section>

      <section className="orders-stats-grid">
        <article className="orders-stat-card">
          <span>Total Orders</span>
          <strong>{stats.totalOrders}</strong>
          <p>All customer purchases</p>
        </article>

        <article className="orders-stat-card">
          <span>Processing</span>
          <strong>{stats.processingOrders}</strong>
          <p>Waiting for delivery</p>
        </article>

        <article className="orders-stat-card">
          <span>Delivered</span>
          <strong>{stats.deliveredOrders}</strong>
          <p>Completed orders</p>
        </article>

        <article className="orders-stat-card orders-stat-dark">
          <span>Total Revenue</span>
          <strong>{formatMoney(stats.totalRevenue)}</strong>
          <p>Current order value</p>
        </article>
      </section>

      {message && <div className="orders-alert orders-success">{message}</div>}
      {error && <div className="orders-alert orders-error">{error}</div>}

      {orders.length === 0 ? (
        <section className="orders-empty">
          <div className="orders-empty-icon">🛒</div>
          <h2>No orders found</h2>
          <p>Customer orders will appear here when users complete checkout.</p>
        </section>
      ) : (
        <section className="orders-list">
          {orders.map((order, index) => (
            <article
              key={order._id}
              className={`order-card ${
                order.isDelivered ? "order-delivered" : "order-processing"
              }`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <header className="order-card-header">
                <div>
                  <span className="order-ref-label">Order Reference</span>
                  <h2>
                    #
                    {order._id
                      ? order._id.slice(-8).toUpperCase()
                      : "UNKNOWN"}
                  </h2>
                  <p>Placed on {formatDate(order.createdAt)}</p>
                </div>

                <div className="order-status-box">
                  <span
                    className={`order-status ${
                      order.isDelivered
                        ? "status-delivered"
                        : "status-processing"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Processing"}
                  </span>

                  {!order.isDelivered && (
                    <button
                      type="button"
                      className="deliver-btn"
                      onClick={() => markAsDeliveredHandler(order._id)}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </header>

              <section className="order-customer-grid">
                <div className="order-info-box">
                  <span>Customer</span>
                  <strong>{order.user?.name || "Unknown User"}</strong>
                </div>

                <div className="order-info-box">
                  <span>Email</span>
                  <strong>{order.user?.email || "No email available"}</strong>
                </div>

                <div className="order-info-box">
                  <span>Payment Method</span>
                  <strong>{order.paymentMethod || "Not specified"}</strong>
                </div>

                <div className="order-info-box">
                  <span>Paid</span>
                  <strong>{order.isPaid ? "Yes" : "No"}</strong>
                </div>
              </section>

              <section className="order-details-grid">
                <div className="order-panel">
                  <div className="panel-heading">
                    <h3>Shipping Address</h3>
                    <span>Delivery</span>
                  </div>

                  <p>{order.shippingAddress?.address || "Address unavailable"}</p>
                  <p>
                    {order.shippingAddress?.city || "City unavailable"},{" "}
                    {order.shippingAddress?.postalCode ||
                      "Postcode unavailable"}
                  </p>
                  <p>{order.shippingAddress?.country || "Country unavailable"}</p>
                </div>

                <div className="order-panel">
                  <div className="panel-heading">
                    <h3>Status Details</h3>
                    <span>Tracking</span>
                  </div>

                  <div className="status-row">
                    <span>Paid</span>
                    <strong>{order.isPaid ? "Yes" : "No"}</strong>
                  </div>

                  <div className="status-row">
                    <span>Delivered</span>
                    <strong>{order.isDelivered ? "Yes" : "No"}</strong>
                  </div>

                  {order.deliveredAt && (
                    <div className="status-row">
                      <span>Delivered At</span>
                      <strong>{formatDate(order.deliveredAt)}</strong>
                    </div>
                  )}
                </div>
              </section>

              <section className="items-panel">
                <div className="panel-heading">
                  <h3>Ordered Items</h3>
                  <span>{order.orderItems?.length || 0} item(s)</span>
                </div>

                <div className="items-list">
                  {order.orderItems?.length > 0 ? (
                    order.orderItems.map((item, itemIndex) => (
                      <div
                        className="order-item-row"
                        key={`${item.product || item.name}-${itemIndex}`}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Product image"}
                          />
                        ) : (
                          <div className="item-img-placeholder">No Image</div>
                        )}

                        <div className="item-details">
                          <h4>{item.name || "Unnamed Product"}</h4>
                          <p>
                            {formatMoney(item.price)} × {item.qty || 0}
                          </p>
                        </div>

                        <strong>
                          {formatMoney(
                            Number(item.price || 0) * Number(item.qty || 0)
                          )}
                        </strong>
                      </div>
                    ))
                  ) : (
                    <p className="no-items">No items found for this order.</p>
                  )}
                </div>
              </section>

              <footer className="order-total-panel">
                <div>
                  <span>Items Price</span>
                  <strong>{formatMoney(order.itemsPrice)}</strong>
                </div>

                <div>
                  <span>Shipping</span>
                  <strong>{formatMoney(order.shippingPrice)}</strong>
                </div>

                <div>
                  <span>Tax</span>
                  <strong>{formatMoney(order.taxPrice)}</strong>
                </div>

                <div className="grand-total">
                  <span>Total</span>
                  <strong>{formatMoney(order.totalPrice)}</strong>
                </div>
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default AdminOrders;