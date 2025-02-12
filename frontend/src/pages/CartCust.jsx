import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const CartCust = () => {
  const { cart, setCart } = useOutletContext();
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

    const storedUserId = Number(localStorage.getItem("userId"));
    console.log(storedUserId, "Type:", typeof storedUserId);
    if (!storedUserId) {
      alert("User ID not found. Please sign in again.");
      return;
    }

    const orderData = {
      userId: storedUserId,
      cartItems: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity || 1,
      })),
    };

    console.log("Sending request:", orderData);
    console.log("Payload Type:", typeof orderData);
    console.log("Order Data Sent:", JSON.stringify(orderData, null, 2));

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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                <p className="text-gray-600">
                  Rs {product.price}  {product.quantity}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(product.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
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
