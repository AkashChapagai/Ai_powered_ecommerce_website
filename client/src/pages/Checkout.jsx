import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cartItems, cartTotal } = useCart();

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

      <div style={styles.layout}>
        <form style={styles.formBox}>
          <h2>Delivery Details</h2>

          <div style={styles.field}>
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" style={styles.input} />
          </div>

          <div style={styles.field}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" style={styles.input} />
          </div>

          <div style={styles.field}>
            <label>Address</label>
            <input type="text" placeholder="Enter your address" style={styles.input} />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label>City</label>
              <input type="text" placeholder="City" style={styles.input} />
            </div>

            <div style={styles.field}>
              <label>Postcode</label>
              <input type="text" placeholder="Postcode" style={styles.input} />
            </div>
          </div>

          <button type="button" style={styles.button}>
            Place Order
          </button>
        </form>

        <div style={styles.summaryBox}>
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.id} style={styles.orderItem}>
              <img src={item.image} alt={item.name} style={styles.image} />

              <div>
                <h4>{item.name}</h4>
                <p>
                  £{item.price} × {item.quantity}
                </p>
              </div>

              <strong>£{(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}

          <div style={styles.total}>
            <h2>Total</h2>
            <h2>£{cartTotal.toFixed(2)}</h2>
          </div>

          <p style={styles.note}>
            Stripe test payment will be added later after backend setup.
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
  total: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
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
};

export default Checkout;