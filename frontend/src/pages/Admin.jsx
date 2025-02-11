import { useState, useEffect } from "react";

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [manufacturerId, setManufacturerId] = useState("");
    const [productId, setProductId] = useState("");
    const [loading, setLoading] = useState(false);
    
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/products");
            if (!response.ok) throw new Error("Failed to fetch products");
            
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async () => {
        if (!token) return alert("Authentication required.");
        if (!name || !description || !price) return alert("Please fill all fields.");

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) return alert("Invalid price!");

        try {
            const response = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, price: parsedPrice }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert(data.message);
            setName("");
            setDescription("");
            setPrice("");
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
            alert(error.message);
        }
    };

    const deleteProduct = async (id) => {
        if (!token) return alert("Authentication required.");

        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to delete product");

            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(error.message);
        }
    };

    const assignManufacturer = async () => {
        if (!token) return alert("Authentication required.");
        if (!manufacturerId || !productId) return alert("Please fill all fields.");

        try {
            const response = await fetch("http://localhost:3000/api/manufacturerproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ manufacturerId, productId }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert(data.message);
            setManufacturerId("");
            setProductId("");
        } catch (error) {
            console.error("Error assigning manufacturer:", error);
            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>

            <h3>Add Product</h3>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button onClick={addProduct}>Add Product</button>

            <h3>Products List</h3>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            {product.name} - {product.price}
                            <button onClick={() => deleteProduct(product.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            <h3>Assign Manufacturer</h3>
            <input type="number" placeholder="Manufacturer ID" value={manufacturerId} onChange={(e) => setManufacturerId(e.target.value)} />
            <input type="number" placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
            <button onClick={assignManufacturer}>Assign</button>
        </div>
    );
};

export default AdminDashboard;
