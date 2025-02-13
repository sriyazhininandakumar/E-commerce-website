import { useEffect, useState } from "react";
import axios from "axios";

const ManufacturerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/manufacturers/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const updateOrderStatus = async (orderDetailId, newStatus) => {
    setUpdating(true);
    try {
      await axios.put(
        "http://localhost:3000/api/manufacturers/orders/update-status",
        { orderDetailId, newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
    setUpdating(false);
  };

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
            {orders.length > 0 ? (
              orders.map((order) =>
                order.OrderDetails.map((detail) => (
                  <tr key={detail.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{order.id}</td>
                    <td className="py-3 px-6 text-left">{detail.Product.name}</td>
                    <td className="py-3 px-6 text-left">
                      {order.User.name} ({order.User.email})
                    </td>
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
              )
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-600">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManufacturerOrders;
