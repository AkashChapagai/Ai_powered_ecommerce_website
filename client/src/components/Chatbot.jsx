import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I’m your AI shopping assistant. Ask me to find products, compare options, suggest items by budget, or help with checkout.",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "Show me the best products",
    "Suggest products under £100",
    "What categories do you have?",
    "Help me choose a product",
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async (messageText) => {
    const userMessage = messageText.trim();

    if (!userMessage || loading) return;

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
          text:
            res.data.reply ||
            "I found some useful information for your shopping journey.",
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
            "Sorry, I could not respond right now. Please try again.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  return (
    <>
      {isOpen && (
        <section className="chatbot-window" aria-label="AI shopping assistant">
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <span>AI</span>
              </div>

              <div>
                <h3>AI Shop Assistant</h3>

                <div className="chatbot-status">
                  <span></span>
                  Online now
                </div>
              </div>
            </div>

            <button
              type="button"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            <div className="chatbot-intro-card">
              <span>Smart Assistant</span>
              <strong>Find products faster</strong>
              <p>Ask about products, prices, categories, stock, or checkout.</p>
            </div>

            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={
                  message.sender === "user"
                    ? "chatbot-message-row user"
                    : "chatbot-message-row bot"
                }
              >
                {message.sender === "bot" && (
                  <div className="chatbot-small-avatar">AI</div>
                )}

                <div
                  className={
                    message.sender === "user"
                      ? "chatbot-bubble user-bubble"
                      : "chatbot-bubble bot-bubble"
                  }
                >
                  {message.text.split("\n").map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}

                  {message.products && message.products.length > 0 && (
                    <div className="chatbot-products">
                      {message.products.map((product) => {
                        const productId = product._id || product.id;

                        return (
                          <article
                            key={productId || product.name}
                            className="chatbot-product-card"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="chatbot-product-image"
                            />

                            <div className="chatbot-product-info">
                              <span>{product.category || "Product"}</span>
                              <strong>{product.name}</strong>
                              <p>£{Number(product.price || 0).toFixed(2)}</p>

                              <Link
                                to={`/products/${productId}`}
                                onClick={() => setIsOpen(false)}
                              >
                                View Product
                              </Link>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chatbot-message-row bot">
                <div className="chatbot-small-avatar">AI</div>

                <div className="chatbot-bubble bot-bubble typing-bubble">
                  <div className="chatbot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="chatbot-input-form" onSubmit={sendMessageHandler}>
            <div className="chatbot-input-wrap">
              <input
                type="text"
                placeholder="Ask about products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              ➜
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={isOpen ? "chatbot-floating-btn open" : "chatbot-floating-btn"}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? "×" : "💬"}
      </button>
    </>
  );
}

export default Chatbot;