import { useState, useEffect } from "react";

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [manufacturerId, setManufacturerId] = useState("");
    const [productId, setProductId] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/products");
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            console.log("Fetched Products:", data); // Debugging output
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            alert(error.message);
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

    const editProduct = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
    };

    const updateProduct = async () => {
        if (!editingProduct) return;
        if (!name || !description || !price) return alert("Please fill all fields.");
        if (!token) return alert("Authentication required.");

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) return alert("Invalid price!");

        try {
            const response = await fetch(`http://localhost:3000/api/products/${editingProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, price: parsedPrice }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert("Product updated successfully!");
            setEditingProduct(null);
            setName("");
            setDescription("");
            setPrice("");
            fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error);
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

            <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

            {editingProduct ? (
                <button onClick={updateProduct}>Update Product</button>
            ) : (
                <button onClick={addProduct}>Add Product</button>
            )}

            <h3>Products List</h3>
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            {product.name} - Rs {product.price}
                            <button onClick={() => editProduct(product)}>Edit</button>
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

export default Admin;
