import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState({ name: "", role: "" });

    useEffect(() => {
        
        const storedAdmin = JSON.parse(localStorage.getItem("admin"));
        console.log(localStorage.getItem("admin"));

        if (storedAdmin) {
            setAdmin(storedAdmin);
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("token"); 
        localStorage.removeItem("admin"); 
        navigate("/"); 
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6 text-center">
            <h2 className="text-2xl font-bold">Name : {admin.name || "Admin"}</h2>
            <p className="text-gray-700">Role : {admin.role || "Administrator"}</p>
            <button 
                onClick={handleSignOut} 
                className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
            >
                Sign Out
            </button>
        </div>
    );
};

export default AdminProfile;
