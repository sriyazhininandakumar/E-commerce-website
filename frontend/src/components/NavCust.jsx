import React from "react";
import { Link } from "react-router-dom";

const NavCust = ({ cart }) => {
  return (
    <nav className="bg-black py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
     
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/customer/products"
              className="text-white text-lg hover:text-gray-400 transition"
            >
              PRODUCTS
            </Link>
          </li>
        </ul>

        <h1 className="text-XL  text-white">
          <Link to="/customer" 
          className="text-white text-lg hover:text-gray-400 transition">
            LA BLANCA
          </Link>
        </h1>

        <ul className="flex space-x-6">
          <li>
            <Link
              to="/customer/profile"
              className="text-white text-lg hover:text-gray-400 transition"
            >
              PROFILE
            </Link>
          </li>
          <li className="relative">
            <Link
              to="/customer/cart"
              className="text-white text-lg hover:text-gray-400 transition"
            >
              CART
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
