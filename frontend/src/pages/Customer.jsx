import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavCust from "../components/NavCust";
import pic3 from "../assets/pic3.jpg";
const CustomerDashboard = () => {
  const [cart, setCart] = useState([]);
  const location = useLocation(); 

  return (
    <div>
      
      <NavCust />


      {location.pathname === "/customer" && (
        <div className="home-content">
          <div className="image-container">
            <img src={pic3} alt="pic 1" className="home-image" />
          </div>
        </div>
      )}

      
      <Outlet context={{ cart, setCart }} />
    </div>
  );
};

export default CustomerDashboard;
