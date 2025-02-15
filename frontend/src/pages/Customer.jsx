import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavCust from "../components/NavCust";
import pic3 from "../assets/pic3.jpg";

const CustomerDashboard = () => {
  const [cart, setCart] = useState([]);
  const location = useLocation();
  

  

  return (
    <div className="min-h-screen bg-white font-sans">
      
      <NavCust cart={cart} />

     
      {location.pathname === "/customer" && (
        <>

          <div
            className="relative w-full h-[500px] bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${pic3})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative text-center text-white px-6">
            <h1 className="text-4xl uppercase tracking-wide">
                Summer Collection 2025
              </h1>
              <p className="text-lg mt-2 opacity-80">
                Light as air, bold as the sun.
              </p>
              <a
                href="/customer/products"
                className="mt-6 inline-block border border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-all shadow-md uppercase tracking-wide"
              >
                Explore Collection
              </a>
            </div>
          </div>

          <div className="text-center my-5 px-6">
            <h2 className="text-3xl tracking-widest uppercase text-gray-900">
              Effortless. Bold. Timeless.
            </h2>
            <p className="text-lg text-gray-600 mt-1 tracking-wide">
              Less noise. More statement.
            </p>
          </div>

         
         
        </>
      )}

      <div className="container mx-auto p-6">
        <Outlet context={{ cart, setCart }} />
      </div>
    </div>
  );
};

export default CustomerDashboard;
