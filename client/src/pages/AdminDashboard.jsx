import { useEffect, useMemo, useRef, useState } from "react";
import API from "../services/api";
import AdminAnalytics from "../components/AdminAnalytics";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [editingProductId, setEditingProductId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  const formRef = useRef(null);

  const fetchProducts = async () => {
    try {
      setFetchingProducts(true);
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (error) {
      console.log("Failed to fetch products:", error);
      setMessageType("error");
      setMessage("Failed to fetch products from database.");
    } finally {
      setFetchingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, item) => total + Number(item.countInStock || 0),
    0
  );

  const totalValue = products.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.countInStock || 0),
    0
  );

  const lowStockCount = products.filter(
    (item) =>
      Number(item.countInStock || 0) > 0 &&
      Number(item.countInStock || 0) <= 5
  ).length;

  const outOfStockCount = products.filter(
    (item) => Number(item.countInStock || 0) === 0
  ).length;

  const categories = useMemo(() => {
    const uniqueCategories = products
      .map((product) => product.category)
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(search) ||
          product.brand?.toLowerCase().includes(search) ||
          product.category?.toLowerCase().includes(search)
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    if (stockFilter === "In Stock") {
      result = result.filter((product) => Number(product.countInStock || 0) > 5);
    }

    if (stockFilter === "Low Stock") {
      result = result.filter(
        (product) =>
          Number(product.countInStock || 0) > 0 &&
          Number(product.countInStock || 0) <= 5
      );
    }

    if (stockFilter === "Out of Stock") {
      result = result.filter(
        (product) => Number(product.countInStock || 0) === 0
      );
    }

    if (sortOption === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sortOption === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sortOption === "stock-low") {
      result.sort(
        (a, b) => Number(a.countInStock || 0) - Number(b.countInStock || 0)
      );
    }

    if (sortOption === "stock-high") {
      result.sort(
        (a, b) => Number(b.countInStock || 0) - Number(a.countInStock || 0)
      );
    }

    return result;
  }, [products, searchTerm, categoryFilter, stockFilter, sortOption]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      image: "",
      description: "",
    });

    setEditingProductId(null);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      countInStock: Number(formData.stock),
      image: formData.image,
      description: formData.description,
    };

    try {
      setLoading(true);
      setMessage("");

      if (editingProductId) {
        await API.put(`/products/${editingProductId}`, productData);
        setMessageType("success");
        setMessage("Product updated successfully!");
      } else {
        await API.post("/products", productData);
        setMessageType("success");
        setMessage("Product added successfully!");
      }

      resetForm();
      await fetchProducts();
    } catch (error) {
      console.log("Product submit error:", error);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);

    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      price: product.price ?? "",
      stock: product.countInStock ?? "",
      image: product.image || "",
      description: product.description || "",
    });

    setMessageType("success");
    setMessage("Editing product. Update the form and click Update Product.");

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setMessage("");

      await API.delete(`/products/${productId}`);

      setMessageType("success");
      setMessage("Product deleted successfully!");

      if (editingProductId === productId) {
        resetForm();
      }

      await fetchProducts();
    } catch (error) {
      console.log("Delete product error:", error);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <section className="admin-page-pro">
      <div className="admin-orb admin-orb-one"></div>
      <div className="admin-orb admin-orb-two"></div>
      <div className="admin-orb admin-orb-three"></div>

      <div className="admin-layout-pro">
        <aside className="admin-sidebar-pro">
          <div className="admin-brand-block">
            <div className="admin-logo-mark">A</div>
            <div>
              <h2>Akash AI</h2>
              <p>Commerce Admin</p>
            </div>
          </div>

          <nav className="admin-nav-pro">
            <a className="active">Dashboard</a>
            <a>Products</a>
            <a>Analytics</a>
            <a>Inventory</a>
            <a>Orders</a>
          </nav>

          <div className="sidebar-insight-card">
            <span>Stock Health</span>
            <h3>
              {outOfStockCount === 0 && lowStockCount === 0
                ? "Excellent"
                : "Needs Review"}
            </h3>
            <p>
              {lowStockCount} low stock · {outOfStockCount} out of stock
            </p>
          </div>
        </aside>

        <main className="admin-main-pro">
          <header className="admin-topbar-pro">
            <div>
              <p className="eyebrow">Welcome back</p>
              <h1>Admin Control Centre</h1>
            </div>

            <div className="topbar-actions">
              <button type="button" className="ghost-action">
                Export
              </button>
              <button
                type="button"
                className="main-action"
                onClick={() =>
                  formRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
              >
                Add Product
              </button>
            </div>
          </header>

          <section className="admin-hero-pro">
            <div className="hero-left-pro">
              <span className="hero-status-pill">Live Admin Dashboard</span>
              <h2>Manage your AI-powered shop with clarity and speed.</h2>
              <p>
                Control products, stock levels, catalogue quality, analytics,
                and inventory health through one polished admin experience.
              </p>

              <div className="hero-mini-grid">
                <div>
                  <strong>{totalProducts}</strong>
                  <span>Products</span>
                </div>
                <div>
                  <strong>{totalStock}</strong>
                  <span>Stock Units</span>
                </div>
                <div>
                  <strong>£{totalValue.toFixed(0)}</strong>
                  <span>Stock Value</span>
                </div>
              </div>
            </div>

            <div className="hero-right-pro">
              <div className="revenue-ring">
                <div>
                  <span>Inventory</span>
                  <strong>£{totalValue.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </section>

          <AdminAnalytics />

          {message && (
            <div className={`admin-toast-pro ${messageType}`}>
              <span>{messageType === "success" ? "✓" : "!"}</span>
              <p>{message}</p>
              <button type="button" onClick={() => setMessage("")}>
                ×
              </button>
            </div>
          )}

          <section className="admin-stats-pro">
            <div className="stat-card-pro">
              <span className="stat-glow blue"></span>
              <div className="stat-icon-pro blue">📦</div>
              <p>Total Products</p>
              <h3>{totalProducts}</h3>
              <small>Catalogue items</small>
            </div>

            <div className="stat-card-pro">
              <span className="stat-glow emerald"></span>
              <div className="stat-icon-pro emerald">📊</div>
              <p>Total Stock</p>
              <h3>{totalStock}</h3>
              <small>Available units</small>
            </div>

            <div className="stat-card-pro premium">
              <span className="stat-glow purple"></span>
              <div className="stat-icon-pro purple">💷</div>
              <p>Inventory Value</p>
              <h3>£{totalValue.toFixed(2)}</h3>
              <small>Live stock value</small>
            </div>

            <div className="stat-card-pro">
              <span className="stat-glow amber"></span>
              <div className="stat-icon-pro amber">⚠️</div>
              <p>Low Stock</p>
              <h3>{lowStockCount}</h3>
              <small>Need attention</small>
            </div>

            <div className="stat-card-pro">
              <span className="stat-glow red"></span>
              <div className="stat-icon-pro red">⛔</div>
              <p>Out of Stock</p>
              <h3>{outOfStockCount}</h3>
              <small>Unavailable</small>
            </div>
          </section>

          <section className="admin-workspace-pro">
            <form
              ref={formRef}
              className={`product-form-pro ${
                editingProductId ? "editing-active" : ""
              }`}
              onSubmit={handleSubmitProduct}
            >
              <div className="panel-heading-pro">
                <div>
                  <span>{editingProductId ? "Edit Mode" : "Product Studio"}</span>
                  <h2>{editingProductId ? "Edit Product" : "Add Product"}</h2>
                </div>

                {editingProductId && <em>Editing</em>}
              </div>

              <div className="form-body-pro">
                <div className="field-pro full">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. iPhone 17 Pro"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row-pro">
                  <div className="field-pro">
                    <label>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="Apple"
                      value={formData.brand}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field-pro">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="Electronics"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-pro">
                  <div className="field-pro">
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="999.00"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="field-pro">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="20"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="field-pro full">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    placeholder="Paste product image URL"
                    value={formData.image}
                    onChange={handleChange}
                    required
                  />
                </div>

                {formData.image && (
                  <div className="preview-card-pro">
                    <img src={formData.image} alt="Product preview" />
                    <div>
                      <strong>Live Preview</strong>
                      <span>This is how the product image will appear.</span>
                    </div>
                  </div>
                )}

                <div className="field-pro full">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Write a clear, customer-friendly product description..."
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-actions-pro">
                <button type="submit" className="submit-pro" disabled={loading}>
                  {loading
                    ? editingProductId
                      ? "Updating..."
                      : "Adding..."
                    : editingProductId
                    ? "Update Product"
                    : "Add Product"}
                </button>

                {editingProductId && (
                  <button
                    type="button"
                    className="cancel-pro"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="inventory-pro">
              <div className="panel-heading-pro inventory-heading">
                <div>
                  <span>Inventory Manager</span>
                  <h2>Product Catalogue</h2>
                </div>

                <strong>
                  {filteredProducts.length}/{products.length} shown
                </strong>
              </div>

              <div className="inventory-toolbar-pro">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock-low">Stock: Low to High</option>
                  <option value="stock-high">Stock: High to Low</option>
                </select>
              </div>

              {fetchingProducts ? (
                <div className="table-loading-pro">
                  <div className="pulse-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p>Loading products...</p>
                </div>
              ) : (
                <div className="table-shell-pro">
                  <table className="product-table-pro">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Brand</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="empty-table-pro">
                            No products match your current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => {
                          const stockNumber = Number(
                            product.countInStock || 0
                          );

                          const stockClass =
                            stockNumber === 0
                              ? "out"
                              : stockNumber <= 5
                              ? "low"
                              : "good";

                          return (
                            <tr key={product._id}>
                              <td>
                                <div className="product-cell-pro">
                                  <img src={product.image} alt={product.name} />
                                  <div>
                                    <strong>{product.name}</strong>
                                    <span>ID: {product._id?.slice(-8)}</span>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <span className="chip-pro">
                                  {product.category}
                                </span>
                              </td>

                              <td>
                                <strong className="price-pro">
                                  £{Number(product.price).toFixed(2)}
                                </strong>
                              </td>

                              <td>
                                <span className={`stock-pro ${stockClass}`}>
                                  {stockNumber}
                                </span>
                              </td>

                              <td>{product.brand || "No Brand"}</td>

                              <td>
                                <div className="row-actions-pro">
                                  <button
                                    type="button"
                                    className="edit-pro"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="delete-pro"
                                    onClick={() =>
                                      handleDeleteProduct(product._id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default AdminDashboard;