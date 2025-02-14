import React from "react";
import { useNavigate } from "react-router-dom";

const ManufacturerProfile = ({ manufacturer }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("manufacturer");
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6 text-center">
            <h2 className="text-2xl font-bold">Hi, {manufacturer.name || "Manufacturer"}!</h2>
            <p className="text-gray-700">Role: {manufacturer.role || "Manufacturer"}</p>
            <button 
                onClick={handleSignOut} 
                className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
            >
                Sign Out
            </button>
        </div>
    );
};

export default ManufacturerProfile;
