import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <section>
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products" style={styles.link}>
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your Cart</h1>

      <div style={styles.cartBox}>
        {cartItems.map((item) => {
          const itemId = item._id || item.id;

          return (
            <div key={itemId} style={styles.cartItem}>
              <img src={item.image} alt={item.name} style={styles.image} />

              <div style={styles.info}>
                <h3>{item.name}</h3>
                <p>£{item.price}</p>
                <p>{item.category}</p>
              </div>

              <div style={styles.quantityBox}>
                <button onClick={() => decreaseQuantity(itemId)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(itemId)}>+</button>
              </div>

              <h3>£{(Number(item.price) * item.quantity).toFixed(2)}</h3>

              <button
                style={styles.removeButton}
                onClick={() => removeFromCart(itemId)}
              >
                Remove
              </button>
            </div>
          );
        })}

        <div style={styles.summary}>
          <h2>Total: £{cartTotal.toFixed(2)}</h2>

          <div>
            <button style={styles.clearButton} onClick={clearCart}>
              Clear Cart
            </button>

            <Link to="/checkout" style={styles.checkoutButton}>
              Go to Checkout
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  cartBox: {
    marginTop: "25px",
    background: "white",
    padding: "25px",
    borderRadius: "14px",
  },
  cartItem: {
    display: "grid",
    gridTemplateColumns: "100px 1fr 120px 120px 100px",
    gap: "20px",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    padding: "20px 0",
  },
  image: {
    width: "100px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  info: {
    lineHeight: "1.6",
  },
  quantityBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  removeButton: {
    padding: "8px 10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  summary: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clearButton: {
    padding: "10px 14px",
    marginRight: "12px",
    background: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  checkoutButton: {
    padding: "10px 14px",
    background: "#111827",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
  },
  link: {
    display: "inline-block",
    marginTop: "15px",
    color: "#2563eb",
    fontWeight: "bold",
  },
};

export default Cart;