import React from "react";
import { Link } from "react-router-dom";

const NavCust = ({ cart }) => {
  return (
    <nav className="bg-black py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Side - Menu Link */}
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/customer/menu"
              className="text-white text-lg font-semibold hover:text-gray-400 transition"
            >
              Menu
            </Link>
          </li>
        </ul>

        <h1 className="text-2xl font-bold text-white">
          <Link to="/customer" className="hover:text-gray-400 transition">
            La Blanca
          </Link>
        </h1>

        <ul className="flex space-x-6">
          <li>
            <Link
              to="/customer/profile"
              className="text-white text-lg font-semibold hover:text-gray-400 transition"
            >
              Profile
            </Link>
          </li>
          <li className="relative">
            <Link
              to="/customer/cart"
              className="text-white text-lg font-semibold hover:text-gray-400 transition"
            >
              Cart
            </Link>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cart.length}
              </span>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavCust;
