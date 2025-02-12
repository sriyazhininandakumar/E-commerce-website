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
        localStorage.setItem("userId", data.id);

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>
        {message && <p className="mt-2 text-center text-red-500">{message}</p>}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
