import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavCust from "../components/NavCust";

const CustomerDashboard = () => {
  const [cart, setCart] = useState([]);
    return (
      <div>
        <h1>Welcome, Customer!</h1>
        <p>This is your dashboard.</p>

        
      <NavCust /> 
      <h2>Customer Dashboard</h2>
      <Outlet context={{ cart, setCart }} />
      </div>
    );
  };
  
  export default CustomerDashboard;
  