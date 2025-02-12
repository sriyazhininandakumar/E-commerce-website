import { useEffect, useState } from "react";

const ManufacturerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/manufacturers/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderDetailId, newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch("http://localhost:3000/api/manufacturers/orders/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderDetailId, newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchOrders();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Manufacturer Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Customer</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((order) => (
              order.OrderDetails.map((detail) => (
                <tr key={detail.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{order.id}</td>
                  <td className="py-3 px-6 text-left">{detail.Product.name}</td>
                  <td className="py-3 px-6 text-left">{order.User.name} ({order.User.email})</td>
                  <td className="py-3 px-6 text-left font-medium text-blue-600">{detail.status}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => updateOrderStatus(detail.id, "Shipped")}
                      disabled={updating}
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                      {updating ? "Updating..." : "Mark as Shipped"}
                    </button>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManufacturerOrders;