import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);

      const res = await API.get("/products");

      setFeaturedProducts(res.data.slice(0, 8));
    } catch (error) {
      console.log("Failed to fetch featured products:", error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const heroProducts = useMemo(() => {
    return featuredProducts.slice(0, 5);
  }, [featuredProducts]);

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const slider = setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % heroProducts.length);
    }, 3200);

    return () => clearInterval(slider);
  }, [heroProducts.length]);

  const activeProduct = heroProducts[activeIndex] || featuredProducts[0];

  const categories = useMemo(() => {
    return [
      ...new Set(
        featuredProducts
          .map((product) => product.category)
          .filter(Boolean)
          .map((category) => category.trim())
      ),
    ].slice(0, 4);
  }, [featuredProducts]);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-aurora home-aurora-one"></div>
        <div className="home-aurora home-aurora-two"></div>
        <div className="home-grid-light"></div>

        <div className="home-hero-copy">
          <span className="home-eyebrow">AI Shopping Studio</span>

          <h1>
            Discover products in a more beautiful way.
          </h1>

          <p>
            A premium animated shopping experience with smart discovery, clean
            navigation, and fast product browsing.
          </p>

          <div className="home-hero-actions">
            <Link to="/products" className="home-primary-btn">
              Start Shopping
            </Link>

            <Link to="/cart" className="home-secondary-btn">
              View Cart
            </Link>
          </div>

          <div className="home-hero-mini">
            <div>
              <strong>Live</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>Smart</strong>
              <span>Discovery</span>
            </div>

            <div>
              <strong>Clean</strong>
              <span>Checkout</span>
            </div>
          </div>
        </div>

        <div className="home-art-stage">
          <div className="home-stage-orbit"></div>
          <div className="home-stage-orbit home-stage-orbit-two"></div>

          {heroProducts.length > 0 && (
            <div className="home-orbit-products">
              {heroProducts.slice(0, 4).map((product, index) => (
                <button
                  type="button"
                  key={product._id || product.id || product.name}
                  className="home-orbit-card"
                  style={{ "--orbit-index": index }}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${product.name}`}
                >
                  <img src={product.image} alt={product.name} />
                </button>
              ))}
            </div>
          )}

          <div className="home-main-product-card">
            <div className="home-card-shine"></div>

            <div className="home-card-top">
              <span></span>
              <span></span>
              <span></span>
            </div>

            {activeProduct ? (
              <>
                <div className="home-product-art">
                  <img src={activeProduct.image} alt={activeProduct.name} />
                </div>

                <div className="home-product-meta">
                  <span>{activeProduct.category || "Featured"}</span>

                  <h2>{activeProduct.name}</h2>

                  <div className="home-product-price-row">
                    <strong>
                      £{Number(activeProduct.price || 0).toFixed(2)}
                    </strong>

                    <Link to={`/products/${activeProduct._id || activeProduct.id}`}>
                      View
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="home-product-empty">
                <span>Featured</span>
                <h2>Add products to reveal the animated showcase.</h2>
              </div>
            )}
          </div>

          <div className="home-float-note home-float-note-one">
            <span>AI Pick</span>
            <strong>Matched</strong>
          </div>

          <div className="home-float-note home-float-note-two">
            <span>Cart</span>
            <strong>Ready</strong>
          </div>

          <div className="home-float-note home-float-note-three">
            <span>Secure</span>
            <strong>Checkout</strong>
          </div>
        </div>
      </section>

      <section className="home-marquee" aria-label="Store highlights">
        <div className="home-marquee-track">
          <span>Fast Browsing</span>
          <span>Smart Recommendations</span>
          <span>Premium Product Cards</span>
          <span>Secure Checkout</span>
          <span>Live Store Data</span>
          <span>Animated Shopping UI</span>
          <span>Fast Browsing</span>
          <span>Smart Recommendations</span>
          <span>Premium Product Cards</span>
          <span>Secure Checkout</span>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="home-category-showcase">
          <div className="home-section-heading">
            <span>Explore</span>
            <h2>Shop by collection.</h2>
          </div>

          <div className="home-category-grid">
            {categories.map((category, index) => (
              <Link
                to="/products"
                key={category}
                className="home-category-card"
                style={{ "--category-index": index }}
              >
                <span>0{index + 1}</span>
                <strong>{category}</strong>
                <p>Explore now</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="home-spotlight">
        <div className="home-spotlight-card">
          <div className="home-spotlight-copy">
            <span>Designed to impress</span>
            <h2>Every product feels like a feature launch.</h2>
          </div>

          <div className="home-spotlight-visual">
            {heroProducts.slice(0, 3).map((product, index) => (
              <div
                className="home-spotlight-image"
                key={product._id || product.id || product.name}
                style={{ "--spotlight-index": index }}
              >
                <img src={product.image} alt={product.name} />
              </div>
            ))}

            {heroProducts.length === 0 && (
              <div className="home-spotlight-placeholder">
                Add products to show this animated layer.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="home-featured-section">
        <div className="home-featured-header">
          <div>
            <span>Featured Products</span>
            <h2>Fresh picks from your store.</h2>
          </div>

          <Link to="/products" className="home-view-all">
            View All Products
          </Link>
        </div>

        {loading ? (
          <div className="home-products-grid">
            <div className="home-product-skeleton"></div>
            <div className="home-product-skeleton"></div>
            <div className="home-product-skeleton"></div>
            <div className="home-product-skeleton"></div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="home-empty-box">
            <h3>No products yet</h3>
            <p>Add products from the admin dashboard to show them here.</p>
            <Link to="/admin">Go to Admin</Link>
          </div>
        ) : (
          <div className="home-products-grid">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id || product.id || product.name}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      <section className="home-final-banner">
        <div className="home-final-glow"></div>

        <div>
          <span>Ready?</span>
          <h2>Enter the full product catalogue.</h2>
        </div>

        <Link to="/products" className="home-light-btn">
          Browse Products
        </Link>
      </section>
    </main>
  );
}

export default Home;