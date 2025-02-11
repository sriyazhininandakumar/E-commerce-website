import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";


const MenuCust = () => {
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useOutletContext(); 

  useEffect(() => {
    fetch("http://localhost:3000/api/products") 
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]); 
  };

  return (
    <div>
      
      <h2>Menu</h2>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Price: {product.price}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default MenuCust;
