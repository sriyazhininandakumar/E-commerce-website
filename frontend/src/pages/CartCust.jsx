import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const CartCust = () => {
  const { cart, setCart } = useOutletContext();
  const [quantities, setQuantities] = useState({});
  const [notification, setNotification] = useState(null); // New notification state

  useEffect(() => {
    const initialQuantities = cart.reduce((acc, item) => {
      acc[item.id] = item.quantity || 1;
      return acc;
    }, {});
    setQuantities(initialQuantities);
  }, [cart]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 sec
  };

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
      if (newQuantity <= 0) return prev;
      return { ...prev, [productId]: newQuantity };
    });
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    updateCart(updatedCart);
    setQuantities((prev) => {
      const updatedQuantities = { ...prev };
      delete updatedQuantities[productId];
      return updatedQuantities;
    });

    showNotification("Product removed from cart.", "error");
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showNotification("Your cart is empty!", "error");
      return;
    }

    const storedUserId = Number(localStorage.getItem("userId"));
    if (!storedUserId) {
      showNotification("User ID not found. Please sign in again.", "error");
      return;
    }

    const orderData = {
      userId: storedUserId,
      cartItems: cart.map((item) => ({
        productId: item.id,
        quantity: quantities[item.id] || 1,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/orders/place-order",
        orderData,
        { headers: { "Content-Type": "application/json" } }
      );

      showNotification(`Order placed successfully! Order ID: ${response.data.orderId}`, "success");
      setCart([]);
      setQuantities({});
    } catch (error) {
      console.error("Error placing order:", error);
      showNotification("Error placing order. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart</h2>

      {/* Notification */}
      {notification && (
        <div
          className={`p-3 mb-4 text-white text-center rounded-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {cart.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((product) => (
            <li key={product.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
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
