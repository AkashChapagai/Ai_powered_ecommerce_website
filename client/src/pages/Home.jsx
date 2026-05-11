import { Link } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
//running code 
//cd ~/ai-ecommerce-project/client
//npm run dev
function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <section>
      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div>
          <p style={styles.badge}>AI-Powered E-Commerce Platform</p>

          <h1 style={styles.title}>
            Shop smarter with intelligent product recommendations
          </h1>

          <p style={styles.subtitle}>
            Discover products faster using a modern e-commerce platform with
            smart recommendations, chatbot assistance, cart functionality, and
            personalised shopping support.
          </p>

          <div style={styles.heroButtons}>
            <Link to="/products" style={styles.primaryButton}>
              Start Shopping
            </Link>

            <Link to="/products" style={styles.secondaryButton}>
              View Products
            </Link>
          </div>
        </div>

        <div style={styles.heroPanel}>
          <h2>Smart Shopping Assistant</h2>

          <div style={styles.messageUser}>
            I need headphones for travel under £60.
          </div>

          <div style={styles.messageBot}>
            Based on your budget and travel needs, wireless headphones would be
            a suitable choice.
          </div>

          <div style={styles.aiStats}>
            <div>
              <strong>4.6★</strong>
              <span>Top Rating</span>
            </div>

            <div>
              <strong>£49.99</strong>
              <span>Best Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI FEATURES SECTION */}
      <div style={styles.aiSection}>
        <div>
          <p style={styles.sectionLabel}>AI Features</p>
          <h2 style={styles.sectionTitle}>
            Intelligent features designed for better product discovery
          </h2>
          <p style={styles.sectionText}>
            This project includes AI-enhanced functionality such as
            behaviour-based recommendations and chatbot product assistance. The
            system helps users find relevant products based on category, price,
            tags, and shopping intent.
          </p>
        </div>

        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <h3>Recommendation System</h3>
            <p>
              Suggests products using category, price range, brand, and product
              tags.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>Chatbot Assistant</h3>
            <p>
              Helps users search for products using natural shopping questions.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>User Behaviour</h3>
            <p>
              Tracks viewed products and shopping actions to improve future
              suggestions.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>Smart Search</h3>
            <p>
              Supports faster product discovery through search, filter, and
              sorting tools.
            </p>
          </div>
        </div>
      </div>

      {/* CATEGORY SECTION */}
      <div style={styles.categorySection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionLabel}>Categories</p>
            <h2>Shop by Category</h2>
          </div>
        </div>

        <div style={styles.categoryGrid}>
          <Link to="/products" style={styles.categoryCard}>
            <h3>Electronics</h3>
            <p>Laptops, headphones, smart devices</p>
          </Link>

          <Link to="/products" style={styles.categoryCard}>
            <h3>Shoes</h3>
            <p>Trainers and everyday footwear</p>
          </Link>

          <Link to="/products" style={styles.categoryCard}>
            <h3>Accessories</h3>
            <p>Smart watches and lifestyle items</p>
          </Link>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.sectionLabel}>Featured Collection</p>
          <h2>Featured Products</h2>
        </div>

        <Link to="/products" style={styles.viewAll}>
          View All Products
        </Link>
      </div>

      <div style={styles.grid}>
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      
    </section>
  );
}

const styles = {
  hero: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "35px",
    alignItems: "center",
    background: "linear-gradient(135deg, #111827, #1e3a8a)",
    color: "white",
    padding: "60px",
    borderRadius: "22px",
  },

  badge: {
    display: "inline-block",
    background: "#2563eb",
    padding: "8px 14px",
    borderRadius: "999px",
    marginBottom: "20px",
    fontWeight: "bold",
  },

  title: {
    fontSize: "48px",
    lineHeight: "1.1",
    marginBottom: "20px",
    maxWidth: "760px",
  },

  subtitle: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#dbeafe",
    maxWidth: "700px",
  },

  heroButtons: {
    marginTop: "30px",
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "14px 20px",
    background: "white",
    color: "#111827",
    borderRadius: "10px",
    fontWeight: "bold",
  },

  secondaryButton: {
    padding: "14px 20px",
    background: "#2563eb",
    color: "white",
    borderRadius: "10px",
    fontWeight: "bold",
  },

  heroPanel: {
    background: "white",
    color: "#111827",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
  },

  messageUser: {
    marginTop: "20px",
    background: "#f3f4f6",
    padding: "14px",
    borderRadius: "12px",
  },

  messageBot: {
    marginTop: "14px",
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "bold",
  },

  aiStats: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  aiStats: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  aiSection: {
    marginTop: "45px",
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "30px",
    background: "white",
    padding: "40px",
    borderRadius: "18px",
  },

  sectionLabel: {
    color: "#2563eb",
    fontWeight: "bold",
    marginBottom: "8px",
  },

  sectionTitle: {
    fontSize: "30px",
    marginBottom: "14px",
  },

  sectionText: {
    lineHeight: "1.7",
    color: "#4b5563",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  featureCard: {
    background: "#f9fafb",
    padding: "22px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    lineHeight: "1.6",
  },

  categorySection: {
    marginTop: "45px",
  },

  sectionHeader: {
    marginTop: "45px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  categoryCard: {
    background: "white",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },

  viewAll: {
    color: "#2563eb",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },

  whySection: {
    marginTop: "50px",
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "30px",
    background: "#111827",
    color: "white",
    padding: "40px",
    borderRadius: "18px",
    lineHeight: "1.7",
  },

  whyList: {
    background: "rgba(255,255,255,0.08)",
    padding: "24px",
    borderRadius: "14px",
    lineHeight: "2",
  },
};

export default Home;