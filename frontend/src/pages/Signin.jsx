import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response Status:", response.status);
console.log("Response Data:", data);

      if (response.ok) {
        localStorage.setItem("token", data.accessToken); 
        localStorage.setItem("role", data.role); 
        console.log(localStorage.getItem("token"));
        console.log(localStorage.getItem("role"));
        
        
        if (data.role === "Customer") navigate("/customer");
        else if (data.role === "Admin") navigate("/admin");
        else if (data.role === "Manufacturer") navigate("/manufacturer");
      } else {
        setMessage(data.message || "Invalid credentials!");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign In</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default SignIn;
