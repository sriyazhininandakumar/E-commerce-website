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
      const response = await fetch("http://localhost:3000/api/manufacturers/update-status", {
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

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Manufacturer Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            order.OrderDetails.map((detail) => (
              <tr key={detail.id}>
                <td>{order.id}</td>
                <td>{detail.Product.name}</td>
                <td>{order.User.name} ({order.User.email})</td>
                <td>{detail.status}</td>
                <td>
                  <button
                    onClick={() => updateOrderStatus(detail.id, "Shipped")}
                    disabled={updating}
                  >
                    Mark as Shipped
                  </button>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManufacturerOrders;