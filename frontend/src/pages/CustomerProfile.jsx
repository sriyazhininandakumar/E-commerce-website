import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch customer data from localStorage
        console.log("Fetching customer from localStorage...");
        const storedCustomer = localStorage.getItem("customer");
        console.log("Stored Customer Data:", storedCustomer);

        if (storedCustomer) {
            try {
                const parsedCustomer = JSON.parse(storedCustomer);
                console.log("Parsed Customer Data:", parsedCustomer);
                setCustomer(parsedCustomer);
            } catch (error) {
                console.error("Error parsing customer data:", error);
            }
        }

        // Fetch orders for the authenticated customer
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/api/customer/orders", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Failed to fetch orders");

                setOrders(data.orders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("customer");
        localStorage.removeItem("token");
        navigate("/");
    };

    if (!customer) {
        return (
            <div className="text-center text-gray-500 mt-6">
                <p>Loading customer data...</p>
            </div>
        );
    }

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6 text-center">
            <h2 className="text-2xl font-bold">Hi, {customer.name}!</h2>
            <p className="text-gray-700">Role: {customer.role}</p>
            <button 
                onClick={handleSignOut} 
                className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
            >
                Sign Out
            </button>

            <h3 className="text-xl font-semibold mt-6">Your Orders</h3>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className="min-w-full mt-6 table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b">Product Name</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <React.Fragment key={order.orderId}>
                                {order.products.map((product, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-6 py-4 text-gray-800">{product.productName}</td>
                                        <td className="px-6 py-4 text-gray-800">
                                            <span
                                                className={`${
                                                    product.status === "Delivered" ? "text-green-500" : "text-yellow-500"
                                                }`}
                                            >
                                                {product.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CustomerProfile;
