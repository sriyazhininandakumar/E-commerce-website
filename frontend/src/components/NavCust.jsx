import React from 'react';
import { Link } from "react-router-dom";

const NavCust = () => {
  return (
    <nav className="bg-black py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">

        {/* Left Section - Menu */}
        <ul className="flex space-x-6">
          <li>
            <Link to="/customer/menu" className="text-white text-lg font-semibold hover:text-gray-400 transition">
              Menu
            </Link>
          </li>
        </ul>

        {/* Center - Store Name */}
        <h1 className="text-2xl font-bold text-white">
          <Link to="/customer" className="hover:text-gray-400 transition">
            La Blanca
          </Link>
        </h1>

        {/* Right Section - Profile & Cart */}
        <ul className="flex space-x-6">
          <li>
            <Link to="/customer/profile" className="text-white text-lg font-semibold hover:text-gray-400 transition">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/customer/cart" className="text-white text-lg font-semibold hover:text-gray-400 transition">
              Cart
            </Link>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default NavCust;
