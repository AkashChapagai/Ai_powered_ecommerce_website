import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import API from "../services/api";
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/products");

      setProducts(data);
    } catch (error) {
      console.log("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products
          .map((item) => item.category)
          .filter(Boolean)
          .map((item) => item.trim())
      ),
    ];
  }, [products]);

  const sortLabels = {
    newest: "Newest first",
    "low-high": "Price: Low to high",
    "high-low": "Price: High to low",
    "rating-high": "Highest rated",
    "most-reviewed": "Most reviewed",
    "stock-high": "Stock: High to low",
  };

  const filteredProducts = useMemo(() => {
    const searchValue = searchText.trim().toLowerCase();

    let result = products.filter((product) => {
      const searchableText = [
        product.name,
        product.brand,
        product.category,
        product.description,
        ...(product.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchValue.length === 0 || searchableText.includes(searchValue);

      const matchesCategory =
        category === "All" ||
        product.category?.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortOption === "newest") {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    if (sortOption === "low-high") {
      result = [...result].sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    }

    if (sortOption === "high-low") {
      result = [...result].sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    }

    if (sortOption === "rating-high") {
      result = [...result].sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    if (sortOption === "most-reviewed") {
      result = [...result].sort(
        (a, b) => Number(b.numReviews || 0) - Number(a.numReviews || 0)
      );
    }

    if (sortOption === "stock-high") {
      result = [...result].sort(
        (a, b) => Number(b.countInStock || 0) - Number(a.countInStock || 0)
      );
    }

    return result;
  }, [products, searchText, category, sortOption]);

  const totalProducts = products.length;
  const totalCategories = Math.max(categories.length - 1, 0);
  const inStockProducts = products.filter(
    (product) => Number(product.countInStock || 0) > 0
  ).length;

  const hasActiveFilters =
    searchText.trim() !== "" || category !== "All" || sortOption !== "newest";

  const resetFilters = () => {
    setSearchText("");
    setCategory("All");
    setSortOption("newest");
  };

  if (loading) {
    return (
      <main className="products-page">
        <section className="products-catalog-shell products-loading-shell">
          <div className="products-loader"></div>

          <span className="products-kicker">Product Catalog</span>

          <h1>Loading products...</h1>

          <p>
            Preparing the product catalog, search tools, category filters, and
            sorting options.
          </p>
        </section>

        <section className="products-skeleton-grid">
          <div className="products-skeleton-card"></div>
          <div className="products-skeleton-card"></div>
          <div className="products-skeleton-card"></div>
          <div className="products-skeleton-card"></div>
        </section>
      </main>
    );
  }

  return (
    <main className="products-page">
      <section className="products-catalog-shell">
        <div className="products-catalog-header">
          <div className="products-catalog-copy">
            <span className="products-kicker">Product Catalog</span>

            <h1>Shop smarter. Find products faster.</h1>

            <p>
              Search, filter, and sort your full e-commerce catalog with a clean
              premium shopping experience designed for speed and clarity.
            </p>
          </div>

          <div className="products-catalog-metrics">
            <div className="products-metric-card">
              <strong>{filteredProducts.length}</strong>
              <span>
                {filteredProducts.length === 1
                  ? "Product found"
                  : "Products found"}
              </span>
            </div>

            <div className="products-metric-card">
              <strong>{totalProducts}</strong>
              <span>Total products</span>
            </div>

            <div className="products-metric-card">
              <strong>{totalCategories}</strong>
              <span>Categories</span>
            </div>

            <div className="products-metric-card">
              <strong>{inStockProducts}</strong>
              <span>In stock</span>
            </div>
          </div>
        </div>

        <div className="products-filter-card">
          <div className="products-search-box">
            <label htmlFor="productSearch">Search products</label>

            <div className="products-search-input-wrap">
              <span>⌕</span>

              <input
                id="productSearch"
                type="text"
                placeholder="Search by name, brand, category, description, or tags..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>
          </div>

          <div className="products-select-box">
            <label htmlFor="productCategory">Category</label>

            <select
              id="productCategory"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="products-select-box">
            <label htmlFor="productSort">Sort by</label>

            <select
              id="productSort"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating-high">Highest Rated</option>
              <option value="most-reviewed">Most Reviewed</option>
              <option value="stock-high">Stock: High to Low</option>
            </select>
          </div>
        </div>

        <div className="products-category-strip" aria-label="Product categories">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={
                category === item
                  ? "products-category-chip active"
                  : "products-category-chip"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <div className="products-active-filters">
            <div>
              <span>Active view</span>

              <strong>
                {category !== "All" ? category : "All categories"} ·{" "}
                {sortLabels[sortOption]}
              </strong>
            </div>

            <button type="button" onClick={resetFilters}>
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section id="products-grid" className="products-grid-section">
        <div className="products-grid-topbar">
          <div>
            <span>Showing catalog results</span>
            <strong>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </strong>
          </div>

          {hasActiveFilters && (
            <button type="button" onClick={resetFilters}>
              Reset view
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="products-empty-state">
            <div className="products-empty-icon">🛍️</div>

            <span className="products-kicker">No Results</span>

            <h2>No products matched your search</h2>

            <p>
              Try a different keyword, choose another category, or clear the
              current filters to view the full product catalog.
            </p>

            <button type="button" onClick={resetFilters}>
              Reset Search
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                className="products-card-frame"
                key={product._id || product.id || product.name}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;