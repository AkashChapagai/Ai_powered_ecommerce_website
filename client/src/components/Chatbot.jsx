import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I can help you find products, check categories, suggest items by budget, and explain checkout.",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = input.trim();

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "user",
        text: userMessage,
        products: [],
      },
    ]);

    setInput("");

    try {
      setLoading(true);

      const res = await API.post("/chatbot", {
        message: userMessage,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: res.data.reply,
          products: res.data.products || [],
        },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text:
            error.response?.data?.message ||
            error.message ||
            "Sorry, I could not respond right now.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <div>
              <h3 style={styles.title}>AI Shop Assistant</h3>
              <p style={styles.status}>Online</p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
            >
              ×
            </button>
          </div>

          <div style={styles.messagesBox}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={
                  message.sender === "user"
                    ? styles.userMessageWrapper
                    : styles.botMessageWrapper
                }
              >
                <div
                  style={
                    message.sender === "user"
                      ? styles.userMessage
                      : styles.botMessage
                  }
                >
                  {message.text.split("\n").map((line, lineIndex) => (
                    <p key={lineIndex} style={styles.messageLine}>
                      {line}
                    </p>
                  ))}

                  {message.products && message.products.length > 0 && (
                    <div style={styles.productsBox}>
                      {message.products.map((product) => (
                        <div key={product._id} style={styles.productCard}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={styles.productImage}
                          />

                          <div style={styles.productInfo}>
                            <strong>{product.name}</strong>
                            <span>£{Number(product.price).toFixed(2)}</span>
                            <small>{product.category}</small>

                            <Link
                              to={`/products/${product._id}`}
                              style={styles.productLink}
                              onClick={() => setIsOpen(false)}
                            >
                              View Product
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={styles.botMessageWrapper}>
                <div style={styles.botMessage}>
                  <p style={styles.messageLine}>Typing...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessageHandler} style={styles.inputForm}>
            <input
              type="text"
              placeholder="Ask about products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
            />

            <button type="submit" style={styles.sendButton} disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={styles.floatingButton}
      >
        {isOpen ? "×" : "💬"}
      </button>
    </>
  );
}

const styles = {
  floatingButton: {
    position: "fixed",
    right: "25px",
    bottom: "25px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    background: "#111827",
    color: "white",
    fontSize: "26px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    zIndex: 1000,
  },
  chatWindow: {
    position: "fixed",
    right: "25px",
    bottom: "95px",
    width: "380px",
    maxWidth: "calc(100vw - 40px)",
    height: "520px",
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 999,
  },
  header: {
    background: "#111827",
    color: "white",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
  },
  status: {
    margin: "4px 0 0",
    color: "#86efac",
    fontSize: "13px",
  },
  closeButton: {
    background: "transparent",
    color: "white",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
  },
  messagesBox: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    background: "#f9fafb",
  },
  userMessageWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "12px",
  },
  botMessageWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "12px",
  },
  userMessage: {
    maxWidth: "80%",
    background: "#2563eb",
    color: "white",
    padding: "10px 12px",
    borderRadius: "14px 14px 0 14px",
  },
  botMessage: {
    maxWidth: "90%",
    background: "white",
    color: "#111827",
    padding: "10px 12px",
    borderRadius: "14px 14px 14px 0",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  messageLine: {
    margin: "4px 0",
    lineHeight: "1.4",
    fontSize: "14px",
  },
  inputForm: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid #e5e7eb",
    background: "white",
  },
  input: {
    flex: 1,
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "14px",
  },
  sendButton: {
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "0 14px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  productsBox: {
    marginTop: "10px",
    display: "grid",
    gap: "8px",
  },
  productCard: {
    display: "grid",
    gridTemplateColumns: "55px 1fr",
    gap: "10px",
    background: "#f3f4f6",
    borderRadius: "10px",
    padding: "8px",
  },
  productImage: {
    width: "55px",
    height: "55px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  productInfo: {
    display: "grid",
    gap: "2px",
    fontSize: "13px",
  },
  productLink: {
    color: "#2563eb",
    fontWeight: "bold",
    textDecoration: "none",
    marginTop: "4px",
  },
};

export default Chatbot;