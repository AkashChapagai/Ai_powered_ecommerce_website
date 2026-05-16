import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { getRecommendedProducts } from "../utils/recommendProducts";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const { addToCart } = useCart();
  const { userInfo } = useAuth();

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

  const addToCartHandler = () => {
    addToCart(product);
    setCartMessage("Product added to cart successfully.");

    setTimeout(() => {
      setCartMessage("");
    }, 1800);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      setReviewError("Please login before writing a review.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please write a review comment.");
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError("");
      setReviewSuccess("");

      await API.post(`/products/${id}/reviews`, {
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
      });

      setReviewSuccess("Review added successfully.");
      setReviewComment("");
      setReviewRating(5);

      await fetchProductDetails();
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <section className="product-loading-card">
          <div className="product-loading-spinner"></div>
          <h1>Loading product...</h1>
          <p>Getting product details, reviews, and recommendations.</p>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <section className="product-not-found">
          <div className="product-not-found-icon">🔎</div>
          <span>Product Details</span>
          <h1>Product not found</h1>
          <p>
            The product you are looking for may have been removed or does not
            exist.
          </p>
          <Link to="/products">Back to Products</Link>
        </section>
      </main>
    );
  }

  const recommendedProducts = getRecommendedProducts(product, allProducts);
  const reviews = product.reviews || [];
  const stock = Number(product.countInStock || 0);
  const rating = Number(product.rating || 0).toFixed(1);

  return (
    <main className="product-details-page">
      <Link to="/products" className="product-back-link">
        ← Back to Products
      </Link>

      <section className="product-details-hero">
        <div className="product-image-panel">
          <div className="product-image-glow"></div>

          <img
            src={product.image}
            alt={product.name}
            className="product-main-image"
          />

          <div className="product-image-badge">
            <span>⭐</span>
            <strong>{rating}</strong>
            <small>{product.numReviews || 0} reviews</small>
          </div>
        </div>

        <div className="product-info-panel">
          <span className="product-category-pill">
            {product.category || "Product"}
          </span>

          <h1>{product.name}</h1>

          <div className="product-price-row">
            <h2>£{Number(product.price).toFixed(2)}</h2>

            {stock > 0 ? (
              <span className="product-stock in-stock">In Stock</span>
            ) : (
              <span className="product-stock out-stock">Out of Stock</span>
            )}
          </div>

          <div className="product-meta-grid">
            <div>
              <span>Brand</span>
              <strong>{product.brand || "No Brand"}</strong>
            </div>

            <div>
              <span>Rating</span>
              <strong>⭐ {rating} / 5</strong>
            </div>

            <div>
              <span>Stock</span>
              <strong>{stock} available</strong>
            </div>
          </div>

          <p className="product-description">{product.description}</p>

          {cartMessage && <p className="product-cart-message">{cartMessage}</p>}

          <div className="product-actions">
            {stock > 0 ? (
              <button
                type="button"
                className="product-add-btn"
                onClick={addToCartHandler}
              >
                Add to Cart
              </button>
            ) : (
              <button type="button" className="product-disabled-btn" disabled>
                Out of Stock
              </button>
            )}

            <Link to="/cart" className="product-cart-link">
              View Cart
            </Link>
          </div>

          <div className="product-trust-strip">
            <div>
              <span>🔐</span>
              <p>Secure account shopping</p>
            </div>

            <div>
              <span>🤖</span>
              <p>AI-style recommendations</p>
            </div>

            <div>
              <span>🛒</span>
              <p>Smooth cart journey</p>
            </div>
          </div>
        </div>
      </section>

      <section className="product-review-section">
        <div className="product-section-header">
          <div>
            <span>Customer Feedback</span>
            <h2>Customer Reviews</h2>
            <p>
              Reviews help users understand product quality and improve trust in
              the shopping experience.
            </p>
          </div>

          <div className="product-review-summary">
            <strong>{rating}</strong>
            <span>Average rating</span>
          </div>
        </div>

        <div className="product-review-layout">
          <div className="product-review-list">
            {reviews.length === 0 ? (
              <div className="product-empty-reviews">
                <h3>No reviews yet</h3>
                <p>Be the first person to review this product.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <article key={review._id} className="product-review-card">
                  <div className="product-review-header">
                    <div>
                      <strong>{review.name}</strong>
                      <p>
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <span>⭐ {review.rating}/5</span>
                  </div>

                  <p className="product-review-comment">{review.comment}</p>
                </article>
              ))
            )}
          </div>

          <aside className="product-review-form-box">
            <span className="product-form-kicker">Write a Review</span>
            <h3>Share your experience</h3>

            {!userInfo && (
              <p className="product-info-message">
                Please <Link to="/login">login</Link> to write a review.
              </p>
            )}

            {reviewError && <p className="product-error">{reviewError}</p>}
            {reviewSuccess && (
              <p className="product-success">{reviewSuccess}</p>
            )}

            {userInfo && (
              <form onSubmit={submitReviewHandler} className="product-review-form">
                <div className="product-field">
                  <label htmlFor="reviewRating">Rating</label>
                  <select
                    id="reviewRating"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                <div className="product-field">
                  <label htmlFor="reviewComment">Comment</label>
                  <textarea
                    id="reviewComment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your honest review..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="product-submit-review"
                  disabled={reviewLoading}
                >
                  {reviewLoading ? (
                    <>
                      <span className="product-review-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            )}
          </aside>
        </div>
      </section>

      <section className="product-recommend-section">
        <div className="product-section-header">
          <div>
            <span>Smart Suggestions</span>
            <h2>Recommended Products</h2>
            <p>
              Suggestions are based on category, brand, price similarity, and
              product tags.
            </p>
          </div>
        </div>

        {recommendedProducts.length === 0 ? (
          <div className="product-empty-recommendations">
            <h3>No recommended products available yet</h3>
            <p>
              Add more related products with category, brand, price, and tags to
              improve recommendations.
            </p>
          </div>
        ) : (
          <div className="product-recommend-grid">
            {recommendedProducts.map((item) => (
              <div key={item._id} className="product-recommend-card">
                <ProductCard product={item} />

                <p className="product-score-text">
                  Match score: {item.recommendationScore}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductDetails;