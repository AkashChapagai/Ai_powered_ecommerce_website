import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatPrice = (price) => Number(price || 0).toFixed(2);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await API.get("/orders/myorders");
        setOrders(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  if (loading) {
    return (
      <main className="orders-page">
        <section className="orders-loading-card">
          <div className="orders-spinner"></div>
          <h1>Loading orders...</h1>
          <p>Please wait while we fetch your order history.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <section className="orders-hero">
        <div>
          <span className="orders-kicker">Account Orders</span>
          <h1>My Orders</h1>
          <p>
            View your previous purchases, check order status, and review the
            products you have ordered from Akash AI Shopping.
          </p>
        </div>

        <div className="orders-summary-mini">
          <div>
            <strong>{orders.length}</strong>
            <span>{orders.length === 1 ? "Order" : "Orders"}</span>
          </div>

          <div>
            <strong>
              £
              {formatPrice(
                orders.reduce(
                  (total, order) => total + Number(order.totalPrice || 0),
                  0
                )
              )}
            </strong>
            <span>Total Spent</span>
          </div>
        </div>
      </section>

      {error && (
        <div className="orders-error" role="alert">
          <span>!</span>
          <p>{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <section className="orders-empty-card">
          <div className="orders-empty-icon">📦</div>
          <span className="orders-kicker">No Orders Yet</span>
          <h2>You have not placed any orders yet</h2>
          <p>
            Start shopping now and your completed orders will appear here with
            product details, payment method, and delivery status.
          </p>

          <Link to="/products" className="orders-primary-link">
            Start Shopping
          </Link>
        </section>
      ) : (
        <section className="orders-list">
          {orders.map((order) => (
            <article key={order._id} className="orders-card">
              <div className="orders-card-header">
                <div>
                  <span className="orders-order-label">Order ID</span>
                  <h2>#{order._id.slice(-8).toUpperCase()}</h2>
                  <p>{formatDate(order.createdAt)}</p>
                </div>

                <span
                  className={
                    order.isDelivered
                      ? "orders-status delivered"
                      : "orders-status processing"
                  }
                >
                  {order.isDelivered ? "Delivered" : "Processing"}
                </span>
              </div>

              <div className="orders-progress">
                <div className="orders-progress-step active">
                  <span>1</span>
                  <p>Placed</p>
                </div>

                <div className="orders-progress-line active"></div>

                <div
                  className={
                    order.isDelivered
                      ? "orders-progress-step active"
                      : "orders-progress-step"
                  }
                >
                  <span>2</span>
                  <p>{order.isDelivered ? "Delivered" : "Processing"}</p>
                </div>
              </div>

              <div className="orders-items">
                {order.orderItems.map((item) => {
                  const qty = Number(item.qty || item.quantity || 0);
                  const subtotal = Number(item.price || 0) * qty;

                  return (
                    <div
                      key={item.product || item._id || item.name}
                      className="orders-item"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="orders-item-image"
                      />

                      <div className="orders-item-info">
                        <h3>{item.name}</h3>
                        <p>
                          £{formatPrice(item.price)} × {qty}
                        </p>
                      </div>

                      <strong>£{formatPrice(subtotal)}</strong>
                    </div>
                  );
                })}
              </div>

              <div className="orders-card-footer">
                <div className="orders-payment-box">
                  <span>Payment Method</span>
                  <strong>{order.paymentMethod}</strong>
                </div>

                <div className="orders-total-box">
                  <span>Order Total</span>
                  <strong>£{formatPrice(order.totalPrice)}</strong>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MyOrders;