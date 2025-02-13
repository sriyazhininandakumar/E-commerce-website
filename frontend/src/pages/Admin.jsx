import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [notification, setNotification] = useState(null); // New state for notification

    const nameRef = useRef();
    const descriptionRef = useRef();
    const priceRef = useRef();
    const manufacturerIdRef = useRef();
    const productIdRef = useRef();

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/products");
            setProducts(response.data);
        } catch (error) {
            showNotification(error.response?.data?.message || "Error fetching products", "error");
        }
    };

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 sec
    };

    const addProduct = async () => {
        if (!token) return showNotification("Authentication required.", "error");

        const name = nameRef.current.value;
        const description = descriptionRef.current.value;
        const price = parseFloat(priceRef.current.value);

        if (!name || !description || isNaN(price) || price <= 0) {
            return showNotification("Invalid input!", "error");
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/products",
                { name, description, price },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showNotification(response.data.message, "success");
            nameRef.current.value = "";
            descriptionRef.current.value = "";
            priceRef.current.value = "";
            fetchProducts();
        } catch (error) {
            showNotification(error.response?.data?.message || "Error adding product", "error");
        }
    };

    const deleteProduct = async (id) => {
        if (!token) return showNotification("Authentication required.", "error");

        try {
            await axios.delete(`http://localhost:3000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            showNotification("Product deleted successfully.", "success");
            fetchProducts();
        } catch (error) {
            showNotification(error.response?.data?.message || "Error deleting product", "error");
        }
    };

    const updateProduct = async () => {
        if (!editingProduct) return;
        if (!token) return showNotification("Authentication required.", "error");

        const name = nameRef.current.value;
        const description = descriptionRef.current.value;
        const price = parseFloat(priceRef.current.value);

        if (!name || !description || isNaN(price) || price <= 0) {
            return showNotification("Invalid input!", "error");
        }

        try {
            const response = await axios.put(
                `http://localhost:3000/api/products/${editingProduct.id}`,
                { name, description, price },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showNotification(response.data.message, "success");
            setEditingProduct(null);
            nameRef.current.value = "";
            descriptionRef.current.value = "";
            priceRef.current.value = "";
            fetchProducts();
        } catch (error) {
            showNotification(error.response?.data?.message || "Error updating product", "error");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>

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

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{editingProduct ? "Edit Product" : "Add Product"}</h3>
                <input ref={nameRef} type="text" placeholder="Name" className="w-full p-2 mb-2 border rounded" />
                <input ref={descriptionRef} type="text" placeholder="Description" className="w-full p-2 mb-2 border rounded" />
                <input ref={priceRef} type="number" placeholder="Price" className="w-full p-2 mb-2 border rounded" />
                
                {editingProduct ? (
                    <button onClick={updateProduct} className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
                        Update Product
                    </button>
                ) : (
                    <button onClick={addProduct} className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
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
                                <button onClick={() => setEditingProduct(product)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">Edit</button>
                                <button onClick={() => deleteProduct(product.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Admin;
