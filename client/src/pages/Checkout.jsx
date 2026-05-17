import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal } = useCart();
  const { userInfo } = useAuth();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United Kingdom");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPrice = Number(cartTotal.toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 4.99;
  const taxPrice = Number((itemsPrice * 0.2).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const placeOrderHandler = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id || item.id,
        })),

        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },

        paymentMethod: "Stripe Test Payment",
        shippingPrice,
        taxPrice,
      };

      const orderRes = await API.post("/orders", orderData);

      const paymentRes = await API.post("/payments/create-checkout-session", {
        orderId: orderRes.data._id,
      });

      if (!paymentRes.data.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = paymentRes.data.url;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start Stripe payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>

        <Link to="/products" style={styles.link}>
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Checkout</h1>
      <p>Review your order and enter delivery details.</p>

      {!userInfo && (
        <p style={styles.error}>You must login before placing an order.</p>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.layout}>
        <form style={styles.formBox} onSubmit={placeOrderHandler}>
          <h2>Delivery Details</h2>

          <div style={styles.field}>
            <label>Full Name</label>
            <input
              type="text"
              value={userInfo?.name || ""}
              placeholder="Login to show your name"
              style={styles.input}
              readOnly
            />
          </div>

          <div style={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={userInfo?.email || ""}
              placeholder="Login to show your email"
              style={styles.input}
              readOnly
            />
          </div>

          <div style={styles.field}>
            <label>Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              style={styles.input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                style={styles.input}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label>Postcode</label>
              <input
                type="text"
                placeholder="Postcode"
                style={styles.input}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label>Country</label>
            <input
              type="text"
              placeholder="Country"
              style={styles.input}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Redirecting to Stripe..." : "Pay with Stripe Test Mode"}
          </button>

          <p style={styles.secureNote}>
            This project uses Stripe test mode only. No real money is taken when
            using Stripe test cards.
          </p>
        </form>

        <div style={styles.summaryBox}>
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item._id || item.id} style={styles.orderItem}>
              <img src={item.image} alt={item.name} style={styles.image} />

              <div>
                <h4>{item.name}</h4>
                <p>
                  £{Number(item.price).toFixed(2)} × {item.quantity}
                </p>
              </div>

              <strong>
                £{(Number(item.price) * Number(item.quantity)).toFixed(2)}
              </strong>
            </div>
          ))}

          <div style={styles.priceRow}>
            <span>Items</span>
            <strong>£{itemsPrice.toFixed(2)}</strong>
          </div>

          <div style={styles.priceRow}>
            <span>Shipping</span>
            <strong>£{shippingPrice.toFixed(2)}</strong>
          </div>

          <div style={styles.priceRow}>
            <span>Tax</span>
            <strong>£{taxPrice.toFixed(2)}</strong>
          </div>

          <div style={styles.total}>
            <h2>Total</h2>
            <h2>£{totalPrice.toFixed(2)}</h2>
          </div>

          <p style={styles.note}>
            Payment method: by card with stripe.
          </p>
        </div>
      </div>
    </section>
  );
}

const styles = {
  layout: {
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "30px",
  },

  formBox: {
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    display: "grid",
    gap: "18px",
  },

  summaryBox: {
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    height: "fit-content",
  },

  field: {
    display: "grid",
    gap: "8px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },

  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
  },

  button: {
    padding: "13px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },

  secureNote: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  orderItem: {
    display: "grid",
    gridTemplateColumns: "70px 1fr auto",
    gap: "15px",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    padding: "15px 0",
  },

  image: {
    width: "70px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  priceRow: {
    marginTop: "12px",
    display: "flex",
    justifyContent: "space-between",
  },

  total: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "15px",
  },

  note: {
    marginTop: "15px",
    color: "#6b7280",
    fontSize: "14px",
  },

  link: {
    display: "inline-block",
    marginTop: "15px",
    color: "#2563eb",
    fontWeight: "bold",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "15px",
    marginBottom: "15px",
  },
};

export default Checkout;