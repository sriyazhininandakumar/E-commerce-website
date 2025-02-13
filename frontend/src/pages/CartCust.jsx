import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const CartCust = () => {
  const { cart, setCart } = useOutletContext();
  
  // Initialize quantity state for each product in cart
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    // When cart updates, initialize quantity for each product if not already set
    const initialQuantities = cart.reduce((acc, item) => {
      acc[item.id] = item.quantity || 1; // Default to 1 if not set
      return acc;
    }, {});
    setQuantities(initialQuantities);
  }, [cart]);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
  };

  const increaseQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decreaseQuantity = (productId) => {
    setQuantities((prev) => {
      const newQuantity = (prev[productId] || 1) - 1;
      if (newQuantity <= 0) {
        return prev; // Prevent going below 1
      }
      return {
        ...prev,
        [productId]: newQuantity,
      };
    });
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    updateCart(updatedCart);

    // Remove quantity from state
    setQuantities((prev) => {
      const updatedQuantities = { ...prev };
      delete updatedQuantities[productId];
      return updatedQuantities;
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const storedUserId = Number(localStorage.getItem("userId"));
    if (!storedUserId) {
      alert("User ID not found. Please sign in again.");
      return;
    }

    // Send final updated quantities
    const orderData = {
      userId: storedUserId,
      cartItems: cart.map((item) => ({
        productId: item.id,
        quantity: quantities[item.id] || 1,
      })),
    };

    console.log("Order Data:", orderData);

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
      setCart([]); // Clear cart after successful order
      setQuantities({}); // Reset quantities
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                <p className="text-gray-600">Rs {product.price} x {quantities[product.id] || 1}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => decreaseQuantity(product.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  -
                </button>
                <span className="mx-2 text-lg">{quantities[product.id] || 1}</span>
                <button
                  onClick={() => increaseQuantity(product.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="ml-4 px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                   Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && (
        <button
          onClick={placeOrder}
          className="mt-6 w-full bg-blue-500 text-white text-lg font-semibold py-2 rounded-md hover:bg-blue-600 transition"
        >
          Place Order
        </button>
      )}
    </div>
  );
};

export default CartCust;
