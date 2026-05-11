import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import API from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/products");

      setProducts(data);
    } catch (error) {
      console.log("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sortOption === "low-high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  }

  if (sortOption === "high-low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }

  if (sortOption === "rating") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
    );
  }

  if (loading) {
    return (
      <section>
        <h1>Products</h1>
        <p>Loading products...</p>
      </section>
    );
  }

  return (
    <section>
      <div style={styles.header}>
        <div>
          <h1>Products</h1>
          <p>Browse products with search, filter, and smart sorting.</p>
        </div>

        <p style={styles.count}>{filteredProducts.length} products found</p>
      </div>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={styles.select}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
          style={styles.select}
        >
          <option value="">Sort By</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p style={styles.noResult}>No products matched your search.</p>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  count: {
    background: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  filters: {
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "15px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
  },
  select: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
  },
  grid: {
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  noResult: {
    marginTop: "25px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
  },
};

export default Products;