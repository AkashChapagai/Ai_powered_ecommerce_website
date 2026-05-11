import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const productId = product._id || product.id;
  const productRating = product.rating ?? 0;
  const productStock = product.countInStock ?? product.stock ?? 0;

  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />

      <div style={styles.content}>
        <p style={styles.category}>{product.category}</p>
        <h3>{product.name}</h3>
        <p>{product.brand}</p>
        <h2>£{product.price}</h2>
        <p>⭐ {productRating}</p>
        <p>Stock: {productStock}</p>

        <div style={styles.buttons}>
          <Link to={`/products/${productId}`} style={styles.button}>
            View Details
          </Link>

          <button style={styles.cartButton} onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },
  content: {
    padding: "16px",
  },
  category: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  button: {
    display: "inline-block",
    padding: "10px 14px",
    background: "#111827",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
  },
  cartButton: {
    padding: "10px 14px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ProductCard;