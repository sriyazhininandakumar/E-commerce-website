import { useState, useEffect, useRef } from "react";

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

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
            const response = await fetch("http://localhost:3000/api/products");
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            alert(error.message);
        }
    };

    const addProduct = async () => {
        if (!token) return alert("Authentication required.");

        const name = nameRef.current.value;
        const description = descriptionRef.current.value;
        const price = parseFloat(priceRef.current.value);

        if (!name || !description || isNaN(price) || price <= 0) return alert("Invalid input!");

        try {
            const response = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, description, price }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert(data.message);
            nameRef.current.value = "";
            descriptionRef.current.value = "";
            priceRef.current.value = "";
            fetchProducts();
        } catch (error) {
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
            alert(error.message);
        }
    };

    const editProduct = (product) => {
        setEditingProduct(product);
        nameRef.current.value = product.name;
        descriptionRef.current.value = product.description;
        priceRef.current.value = product.price;
    };

    const updateProduct = async () => {
        if (!editingProduct) return;
        if (!token) return alert("Authentication required.");

        const name = nameRef.current.value;
        const description = descriptionRef.current.value;
        const price = parseFloat(priceRef.current.value);

        if (!name || !description || isNaN(price) || price <= 0) return alert("Invalid input!");

        try {
            const response = await fetch(`http://localhost:3000/api/products/${editingProduct.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, description, price }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert("Product updated successfully!");
            setEditingProduct(null);
            nameRef.current.value = "";
            descriptionRef.current.value = "";
            priceRef.current.value = "";
            fetchProducts();
        } catch (error) {
            alert(error.message);
        }
    };

    const assignManufacturer = async () => {
        if (!token) return alert("Authentication required.");

        const manufacturerId = manufacturerIdRef.current.value;
        const productId = productIdRef.current.value;

        if (!manufacturerId || !productId) return alert("Please fill all fields.");

        try {
            const response = await fetch("http://localhost:3000/api/manufacturerproduct", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ manufacturerId, productId }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert(data.message);
            manufacturerIdRef.current.value = "";
            productIdRef.current.value = "";
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>

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
                                <button onClick={() => editProduct(product)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">Edit</button>
                                <button onClick={() => deleteProduct(product.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <h3 className="text-lg font-semibold mt-4">Assign Manufacturer</h3>
            <input ref={manufacturerIdRef} type="number" placeholder="Manufacturer ID" className="w-full p-2 mb-2 border rounded" />
            <input ref={productIdRef} type="number" placeholder="Product ID" className="w-full p-2 mb-2 border rounded" />
            <button onClick={assignManufacturer} className="bg-purple-500 text-white px-4 py-2 rounded w-full hover:bg-purple-600">
                Assign
            </button>
        </div>
    );
};

export default Admin;
