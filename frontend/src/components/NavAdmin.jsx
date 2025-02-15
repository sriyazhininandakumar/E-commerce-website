import React from "react";
import { Link } from "react-router-dom";

const NavAdmin = () => {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
            <Link to="/admin/products" className="text-lg  hover:text-gray-400">
                 Products
            </Link>
            <Link to="/admin/home" className="text-lg  hover:text-gray-400">
                La Blanca
            </Link>
            <Link to="/admin/profile" className="hover:text-gray-400">
                Profile
            </Link>
        </nav>
    );
};

export default NavAdmin;
