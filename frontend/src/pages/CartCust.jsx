import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const CartCust = () => {
  const { cart, setCart, userId } = useOutletContext(); // Ensure userId is available
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData = {
      userId, 
      cartItems: cartItems.map((item) => ({
        productId: item.id, 
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:3000/api/orders/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const data = await response.json();
      alert(`Order placed successfully! Order ID: ${data.orderId}`);
      setCart([]); 

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price} x {product.quantity}
              <button onClick={() => removeFromCart(product.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && <button onClick={placeOrder}>Place Order</button>}
    </div>
  );
};

export default CartCust;
