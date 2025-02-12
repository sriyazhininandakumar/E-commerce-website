import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Customer from "./pages/Customer";  
import Admin from "./pages/Admin";
import Manufacturer from "./pages/Manufacturer";
import MenuCust from "./pages/MenuCust";
import ProfileCust from "./pages/ProfileCust";
import CartCust from "./pages/CartCust";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/manufacturer" element={<Manufacturer />} />

        {/* Customer Dashboard with Home Page at /customer */}
        <Route path="/customer" element={<Customer />}>
          <Route index element={<div />} /> {/* Placeholder for home content in CustomerDashboard */}
          <Route path="menu" element={<MenuCust />} />
          <Route path="profile" element={<ProfileCust />} />
          <Route path="cart" element={<CartCust />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
