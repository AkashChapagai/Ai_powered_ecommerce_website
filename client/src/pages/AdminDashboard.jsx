import { useEffect, useState } from "react";
import API from "../services/api";

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    <section>
      <h1>Admin Dashboard</h1>
      <p>Manage products, orders, users, and platform activity.</p>

      {message && (
        <p
          style={
            messageType === "success" ? styles.successMessage : styles.errorMessage
          }
        >
          {message}
        </p>
      )}

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total Products</h3>
          <h2>{totalProducts}</h2>
        </div>

        <div style={styles.statCard}>
          <h3>Total Stock</h3>
          <h2>{totalStock}</h2>
        </div>

        <div style={styles.statCard}>
          <h3>Inventory Value</h3>
          <h2>£{totalValue.toFixed(2)}</h2>
        </div>

        <div style={styles.statCard}>
          <h3>Total Orders</h3>
          <h2>0</h2>
        </div>
      </div>

      <div style={styles.layout}>
        <form style={styles.formBox} onSubmit={handleSubmitProduct}>
          <h2>{editingProductId ? "Edit Product" : "Add Product"}</h2>

          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            style={styles.input}
            min="0"
            step="0.01"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            style={styles.input}
            min="0"
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {formData.image && (
            <img
              src={formData.image}
              alt="Product preview"
              style={styles.previewImage}
            />
          )}

          <textarea
            name="description"
            placeholder="Product description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            required
          ></textarea>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading
              ? editingProductId
                ? "Updating..."
                : "Adding..."
              : editingProductId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingProductId && (
            <button type="button" style={styles.cancelButton} onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </form>

        <div style={styles.tableBox}>
          <h2>Product List</h2>

          {fetchingProducts ? (
            <p>Loading products...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td style={styles.td} colSpan="7">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td style={styles.td}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={styles.tableImage}
                        />
                      </td>

                      <td style={styles.td}>{product.name}</td>
                      <td style={styles.td}>{product.category}</td>
                      <td style={styles.td}>£{Number(product.price).toFixed(2)}</td>
                      <td style={styles.td}>{product.countInStock}</td>
                      <td style={styles.td}>{product.brand}</td>

                      <td style={styles.td}>
                        <button
                          type="button"
                          style={styles.editButton}
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          style={styles.deleteButton}
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

const styles = {
  successMessage: {
    marginTop: "15px",
    padding: "12px",
    background: "#ecfdf5",
    color: "#065f46",
    borderRadius: "8px",
    fontWeight: "bold",
  },

  errorMessage: {
    marginTop: "15px",
    padding: "12px",
    background: "#fef2f2",
    color: "#991b1b",
    borderRadius: "8px",
    fontWeight: "bold",
  },

  statsGrid: {
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },

  statCard: {
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  layout: {
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "30px",
    alignItems: "start",
  },

  formBox: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    display: "grid",
    gap: "14px",
    height: "fit-content",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
  },

  textarea: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    resize: "vertical",
  },

  previewImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  button: {
    padding: "12px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },

  cancelButton: {
    padding: "12px",
    background: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },

  tableBox: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    overflowX: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    marginTop: "15px",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e5e7eb",
    background: "#f9fafb",
    fontSize: "14px",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "middle",
    fontSize: "14px",
  },

  tableImage: {
    width: "65px",
    height: "55px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  editButton: {
    padding: "7px 10px",
    marginRight: "8px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteButton: {
    padding: "7px 10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminDashboard;