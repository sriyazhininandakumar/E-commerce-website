import React from 'react'
import { Link } from "react-router-dom";
const NavCust = () => {
  return (
    <div>
    <nav>
      <ul>
        <li><Link to="/customer">Home</Link></li>
        <li><Link to="/customer/menu">Menu</Link></li>
        <li><Link to="/customer/profile">Profile</Link></li>
        <li><Link to="/customer/cart">Cart</Link></li>
      </ul>
    </nav> 
    </div>
  )
}

export default NavCust
