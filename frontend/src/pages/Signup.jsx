import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [message, setMessage] = useState("");

 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === "roleId" ? Number(e.target.value) : e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending to backend:", formData);
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: "Unexpected error" };
      }

      console.log("Response from backend:", data); 

      if (response.ok) {
        setMessage("Signup Successful! Redirecting...");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setMessage(data.message || "Something went wrong!");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <select name="roleId" value={formData.roleId} onChange={handleChange} required>
          <option value="" disabled>Select Role</option>
          <option value="2">Customer</option>
          <option value="3">Manufacturer</option>
          <option value="1">Admin</option>
        </select>

        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
      <p>Already have an account? <a href="/signin">Sign in</a></p>
    </div>
  );
};

export default Signup;
