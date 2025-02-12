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
            console.log("Fetched Products:", data);
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
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>

           
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{editingProduct ? "Edit Product" : "Add Product"}</h3>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-2 border rounded" />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 mb-2 border rounded" />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 mb-2 border rounded" />
                {editingProduct ? (
                    <button onClick={updateProduct} className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
                        Update Product
                    </button>
                ) : (
                    <button onClick={addProduct} className="bg-blue-500  text-white px-4 py-2 rounded w-full hover:bg-blue-600">
                        Add Product
                    </button>
                )}
            </div>

          
            <h3 className="text-lg font-semibold mb-2">Products List</h3>
            {products.length === 0 ? (
                <p className="text-gray-500">No products available.</p>
            ) : (
                <ul className="space-y-2">
                    {products.map((product) => (
                        <li key={product.id} className="flex justify-between items-center p-3 border rounded bg-white shadow">
                            <span>{product.name} - Rs {product.price}</span>
                            <div>
                                <button onClick={() => editProduct(product)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">Edit</button>
                                <button onClick={() => deleteProduct(product.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

           
            <h3 className="text-lg font-semibold mt-4">Assign Manufacturer</h3>
            <input type="number" placeholder="Manufacturer ID" value={manufacturerId} onChange={(e) => setManufacturerId(e.target.value)}
                className="w-full p-2 mb-2 border rounded" />
            <input type="number" placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)}
                className="w-full p-2 mb-2 border rounded" />
            <button onClick={assignManufacturer} className="bg-purple-500 text-white px-4 py-2 rounded w-full hover:bg-purple-600">
                Assign
            </button>
        </div>
    );
};

export default Admin;
