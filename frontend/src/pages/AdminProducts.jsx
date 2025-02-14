import { useState, useEffect, useRef } from "react";
import axios from "axios";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [notification, setNotification] = useState(null); // ✅ State for notifications

    const nameRef = useRef();
    const descriptionRef = useRef();
    const priceRef = useRef();
    const imageUrlRef = useRef(); 
    const manufacturerIdRef = useRef();
    const productIdRef = useRef();

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProducts();
    }, []);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/products");
            setProducts(response.data);
        } catch (error) {
            showNotification(error.response?.data?.message || "Error fetching products", "error");
        }
    };

    const addProduct = async () => {
        if (!token) return showNotification("Authentication required.", "error");

        const name = nameRef.current.value;
        const description = descriptionRef.current.value;
        const price = parseFloat(priceRef.current.value);
        const imageUrl = imageUrlRef.current.value;

        if (!name || !description || isNaN(price) || price <= 0) {
            return showNotification("Invalid input!", "error");
        }

        try {
            await axios.post(
                "http://localhost:3000/api/products",
                { name, description, price, imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showNotification("Product added successfully!");
            nameRef.current.value = "";
            descriptionRef.current.value = "";
            priceRef.current.value = "";
            imageUrlRef.current.value = "";
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

            showNotification("Product deleted successfully!", "success");
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
        const imageUrl = imageUrlRef.current.value;

        if (!name || !description || isNaN(price) || price <= 0) {
            return showNotification("Invalid input!", "error");
        }

        try {
            await axios.put(
                `http://localhost:3000/api/products/${editingProduct.id}`,
                { name, description, price, imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showNotification("Product updated successfully!", "success");
            setEditingProduct(null);
            nameRef.current.value = "";
            descriptionRef.current.value = "";
            priceRef.current.value = "";
            imageUrlRef.current.value = "";
            fetchProducts();
        } catch (error) {
            showNotification(error.response?.data?.message || "Error updating product", "error");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>

            {/* Notification Banner */}
            {notification && (
                <div className={`p-3 mb-4 text-white text-center rounded ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                    {notification.message}
                </div>
            )}

            {/* Add or Edit Product */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{editingProduct ? "Edit Product" : "Add Product"}</h3>
                <input ref={nameRef} type="text" placeholder="Name" className="w-full p-2 mb-2 border rounded" />
                <input ref={descriptionRef} type="text" placeholder="Description" className="w-full p-2 mb-2 border rounded" />
                <input ref={priceRef} type="number" placeholder="Price" className="w-full p-2 mb-2 border rounded" />
                <input ref={imageUrlRef} type="text" placeholder="Image URL" className="w-full p-2 mb-2 border rounded" />

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

            {/* Product List */}
            <h3 className="text-lg font-semibold mb-2">Products List</h3>
            {products.length === 0 ? (
                <p className="text-gray-500">No products available.</p>
            ) : (
                <ul className="space-y-2">
                    {products.map((product) => (
                        <li key={product.id} className="flex justify-between items-center p-3 border rounded bg-white shadow">
                            <div className="flex items-center space-x-4">
                                {product.imageUrl && (
                                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                )}
                                <span>{product.name} - Rs {product.price}</span>
                            </div>
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

export default AdminProducts;
