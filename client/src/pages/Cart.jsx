import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const formatPrice = (price) => Number(price || 0).toFixed(2);

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-empty">
          <div className="cart-empty-glow"></div>

          <div className="cart-empty-card">
            <div className="cart-empty-icon">🛒</div>

            <span className="cart-kicker">Your Cart</span>
            <h1>Your cart is empty</h1>
            <p>
              Looks like you have not added anything yet. Explore products and
              start building your shopping cart.
            </p>

            <Link to="/products" className="cart-primary-link">
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-hero">
        <div>
          <span className="cart-kicker">Shopping Cart</span>
          <h1>Your Cart</h1>
          <p>
            Review your selected products, update quantities, remove unwanted
            items, and continue to checkout securely.
          </p>
        </div>

        <div className="cart-hero-stats">
          <div>
            <strong>{totalItems}</strong>
            <span>{totalItems === 1 ? "Item" : "Items"}</span>
          </div>

          <div>
            <strong>£{formatPrice(cartTotal)}</strong>
            <span>Cart Total</span>
          </div>
        </div>
      </section>

      <section className="cart-layout">
        <div className="cart-items-panel">
          <div className="cart-panel-header">
            <div>
              <h2>Cart Items</h2>
              <p>{cartItems.length} product type(s) in your cart</p>
            </div>

            <button
              type="button"
              className="cart-clear-top"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => {
              const itemId = item._id || item.id;
              const itemPrice = Number(item.price || 0);
              const itemQuantity = Number(item.quantity || 0);
              const itemSubtotal = itemPrice * itemQuantity;

              return (
                <article key={itemId} className="cart-item">
                  <div className="cart-product-image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-product-image"
                    />
                  </div>

                  <div className="cart-product-info">
                    <span>{item.category || "Product"}</span>
                    <h3>{item.name}</h3>
                    <p>£{formatPrice(item.price)} each</p>
                  </div>

                  <div className="cart-quantity-control">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(itemId)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(itemId)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <span>Subtotal</span>
                    <strong>£{formatPrice(itemSubtotal)}</strong>
                  </div>

                  <button
                    type="button"
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(itemId)}
                  >
                    Remove
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="cart-summary-card">
          <div className="cart-summary-header">
            <span>Order Summary</span>
            <h2>£{formatPrice(cartTotal)}</h2>
            <p>Total before delivery and any future checkout charges.</p>
          </div>

          <div className="cart-summary-lines">
            <div>
              <span>Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div>
              <span>Products</span>
              <strong>{cartItems.length}</strong>
            </div>

            <div>
              <span>Subtotal</span>
              <strong>£{formatPrice(cartTotal)}</strong>
            </div>

            <div>
              <span>Delivery</span>
              <strong>Calculated later</strong>
            </div>
          </div>

          <div className="cart-secure-box">
            <span>🔒</span>
            <p>Secure checkout flow with account-based shopping experience.</p>
          </div>

          <div className="cart-summary-actions">
            <Link to="/checkout" className="cart-checkout-btn">
              Go to Checkout
            </Link>

            <Link to="/products" className="cart-continue-btn">
              Continue Shopping
            </Link>

            <button
              type="button"
              className="cart-clear-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Cart;