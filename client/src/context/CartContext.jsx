import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const getProductId = (product) => {
  return product._id || product.id;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");

    if (savedCart) {
      return JSON.parse(savedCart);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product) {
    const productId = getProductId(product);

    if (product.countInStock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => getProductId(item) === productId
      );

      if (existingItem) {
        if (existingItem.quantity >= product.countInStock) {
          alert("You cannot add more than the available stock.");
          return prevItems;
        }

        return prevItems.map((item) =>
          getProductId(item) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          id: productId,
          _id: productId,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setCartItems((prevItems) =>
      prevItems.filter((item) => getProductId(item) !== productId)
    );
  }

  function increaseQuantity(productId) {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (getProductId(item) === productId) {
          if (item.quantity >= item.countInStock) {
            alert("You cannot add more than the available stock.");
            return item;
          }

          return { ...item, quantity: item.quantity + 1 };
        }

        return item;
      })
    );
  }

  function decreaseQuantity(productId) {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        getProductId(item) === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}