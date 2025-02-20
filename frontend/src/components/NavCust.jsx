import React from "react";
import { Link } from "react-router-dom";

const NavCust = ({ cart }) => {
  return (
    <nav className="bg-[#0a0a0a] py-6 px-12 shadow-lg backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Left Section */}
        <ul className="flex space-x-12">
          <li>
            <Link
              to="/customer/products"
              className="text-white text-lg font-light uppercase tracking-wider transition duration-300 hover:text-[#d4af37] hover:scale-105"
            >
              Products
            </Link>
          </li>
        </ul>

        {/* Center Logo */}
        <h1 className="text-4xl font-extrabold tracking-widest">
          <Link
            to="/customer"
            className="text-white text-lg font-light uppercase tracking-wider transition duration-300 hover:text-[#d4af37] hover:scale-105"
            >
            LA BLANCA
          </Link>
        </h1>

        {/* Right Section */}
        <ul className="flex space-x-12 items-center">
          <li>
            <Link
              to="/customer/profile"
              className="text-white text-lg font-light uppercase tracking-wider transition duration-300 hover:text-[#d4af37] hover:scale-105"
            >
              Profile
            </Link>
          </li>
          <li className="relative">
            <Link
              to="/customer/cart"
              className="text-white text-lg font-light uppercase tracking-wider transition duration-300 hover:text-[#d4af37] hover:scale-105"
            >
              Cart
            </Link>
            {cart.length > 0 && (
              <span className="absolute -top-3 -right-4 bg-red-500 text-black text-sm font-bold px-3 py-1 rounded-full ">
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
