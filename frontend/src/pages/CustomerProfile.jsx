import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
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
        </div>
    );
};

export default CustomerProfile;
