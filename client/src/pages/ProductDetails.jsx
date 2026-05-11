import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import API from "../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      const productResponse = await API.get(`/products/${id}`);
      const productsResponse = await API.get("/products");

      setProduct(productResponse.data);
      setAllProducts(productsResponse.data);
    } catch (error) {
      console.log("Failed to fetch product details:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <section>
        <h1>Loading product...</h1>
      </section>
    );
  }

  if (!product) {
    return (
      <section>
        <h1>Product not found</h1>
        <Link to="/products">Back to Products</Link>
      </section>
    );
  }

  const similarProducts = allProducts.filter(
    (item) =>
      item._id !== product._id &&
      item.category?.toLowerCase() === product.category?.toLowerCase()
  );

  return (
    <section>
      <Link to="/products" style={styles.backLink}>
        ← Back to Products
      </Link>

      <div style={styles.details}>
        <img src={product.image} alt={product.name} style={styles.image} />

        <div>
          <p style={styles.category}>{product.category}</p>
          <h1>{product.name}</h1>
          <h2>£{product.price}</h2>
          <p>Brand: {product.brand}</p>
          <p>Rating: ⭐ {product.rating || 0}</p>
          <p>Stock: {product.countInStock ?? 0}</p>
          <p style={styles.description}>{product.description}</p>

          <button style={styles.button} onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>

      <div style={styles.similarSection}>
        <h2>Recommended Products</h2>

        {similarProducts.length === 0 ? (
          <p>No similar products available yet.</p>
        ) : (
          <div style={styles.grid}>
            {similarProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const styles = {
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#2563eb",
    fontWeight: "bold",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    background: "white",
    padding: "30px",
    borderRadius: "14px",
  },
  image: {
    width: "100%",
    height: "420px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  category: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  description: {
    marginTop: "20px",
    lineHeight: "1.6",
  },
  button: {
    marginTop: "25px",
    padding: "12px 18px",
    border: "none",
    background: "#111827",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  similarSection: {
    marginTop: "40px",
  },
  grid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
};

export default ProductDetails;