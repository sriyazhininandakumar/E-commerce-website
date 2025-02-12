import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const MenuCust = () => {
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useOutletContext();
  const [clickedProducts, setClickedProducts] = useState(new Set()); // Track clicked products

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    setClickedProducts((prev) => new Set(prev).add(product.id)); // Mark as clicked
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Menu</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-300 rounded-lg shadow-md p-4 bg-white text-center"
          >
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">Price: ₹{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className={`mt-3 px-4 py-2 rounded-md transition ${
                clickedProducts.has(product.id)
                  ? "bg-green-600 text-white" // Change color after click
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {clickedProducts.has(product.id) ? "Added" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCust;
