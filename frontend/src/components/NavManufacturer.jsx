import React from "react";
import { Link } from "react-router-dom";

const ManufacturerOrders= () => {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
            <Link to="/manufacturer/orders" className="text-lg font-semibold hover:text-gray-400">
                 Orders
            </Link>
            <Link to="/manufacturer/home" className="text-xl font-bold hover:text-gray-400">
                La Blanca
            </Link>
            <Link to="/manufacturer/profile" className="hover:text-gray-400">
                Profile
            </Link>
        </nav>
    );
};

export default ManufacturerOrders;
