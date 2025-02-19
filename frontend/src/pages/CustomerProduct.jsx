import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const CustomerProduct = () => {
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useOutletContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        console.log("fetched Products : ", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product, event) => {
    setCart((prevCart) => [...prevCart, product]);

    
    event.target.innerText = "Added to Cart";
    event.target.classList.remove("bg-black", "hover:bg-gray-800");
    event.target.classList.add("bg-green-500");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-300 rounded-lg shadow-md p-4 bg-white text-center"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-32 h-32 object-cover mx-auto rounded"
            />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">Price: ₹{product.price}</p>
            <button
              onClick={(event) => addToCart(product, event)}
              className="mt-3 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerProduct;