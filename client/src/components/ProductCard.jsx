import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const productId = product._id || product.id;
  const productName = product.name || "Product";
  const productBrand = product.brand || "No Brand";
  const productCategory = product.category || "Featured";
  const productImage = product.image;
  const productPrice = Number(product.price || 0).toFixed(2);
  const productRating = Number(product.rating || 0).toFixed(1);
  const productReviews = Number(product.numReviews || 0);
  const productStock = Number(product.countInStock ?? product.stock ?? 0);

  const isInStock = productStock > 0;

  return (
    <article className="product-card">
      <div className="product-card-image-wrap">
        <img src={productImage} alt={productName} className="product-card-image" />

        <div className="product-card-overlay"></div>

        <span className="product-card-category">{productCategory}</span>

        <span
          className={
            isInStock
              ? "product-card-stock-badge in-stock"
              : "product-card-stock-badge out-stock"
          }
        >
          {isInStock ? "In Stock" : "Sold Out"}
        </span>
      </div>

      <div className="product-card-content">
        <div className="product-card-brand-row">
          <span>{productBrand}</span>

          <div className="product-card-rating">
            <span>★</span>
            <strong>{productRating}</strong>
          </div>
        </div>

        <h3 className="product-card-name">{productName}</h3>

        <div className="product-card-review-row">
          <span>
            {productReviews} {productReviews === 1 ? "review" : "reviews"}
          </span>

          <span className={isInStock ? "stock-text-green" : "stock-text-red"}>
            {isInStock ? `${productStock} available` : "Unavailable"}
          </span>
        </div>

        <div className="product-card-price-row">
          <div>
            <span className="product-card-price-label">Price</span>
            <strong className="product-card-price">£{productPrice}</strong>
          </div>
        </div>

        <div className="product-card-actions">
          <Link to={`/products/${productId}`} className="product-card-details-btn">
            View Details
          </Link>

          {isInStock ? (
            <button
              type="button"
              className="product-card-cart-btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          ) : (
            <button type="button" className="product-card-disabled-btn" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;