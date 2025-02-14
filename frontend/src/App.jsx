import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Customer from "./pages/Customer";  
import AdminLayout from "./pages/AdminLayout";
import ManufacturerLayout from "./pages/ManufacturerLayout";
import CustomerProduct from "./pages/CustomerProduct";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerCart from "./pages/CustomerCart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signin />} />
        <Route path="/admin/*" element={<AdminLayout/>} />
        <Route path="/manufacturer/*" element={<ManufacturerLayout />} />


        <Route path="/customer" element={<Customer />}>
          <Route index element={<div />} /> 
          <Route path="menu" element={<CustomerProduct />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="cart" element={<CustomerCart />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
