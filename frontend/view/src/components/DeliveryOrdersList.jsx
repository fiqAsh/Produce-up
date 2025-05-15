import React, { useEffect } from "react";
import useDeliverymanStore from "../stores/useDeliverymanStore";

const DeliveryOrdersList = () => {
  const { orders, loading, error, fetchOrders, markAsDelivered } =
    useDeliverymanStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">My Delivery Orders</h2>

      {loading && <p className="text-blue-600">Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {orders.length === 0 && !loading && <p>No orders found.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 rounded p-4 shadow"
          >
            <div className="mb-2">
              <p>
                <strong>From Market:</strong> {order.marketA?.name}
              </p>
              <p>
                <strong>To Market:</strong> {order.marketB?.name}
              </p>
              <p>
                <strong>Ordered by:</strong> {order.user?.name} (
                {order.user?.email})
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {order.isDelivered ? "✅ Delivered" : "🕗 Pending"}
              </p>
              <p>
                <strong>Total Price:</strong> ৳{order.totalPrice}
              </p>
              <p>
                <strong>Estimated Time:</strong> {order.estimatedTime} mins
              </p>
              <p>
                <strong>Distance:</strong> {order.distance} km
              </p>
            </div>

            <div className="mb-2">
              <strong>Items:</strong>
              <ul className="list-disc pl-5 mt-1">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.produce?.name || "Unknown Produce"} - {item.quantity}{" "}
                    units @ ৳{item.pricePerUnit}/unit
                  </li>
                ))}
              </ul>
            </div>

            {!order.isDelivered && (
              <button
                onClick={() => markAsDelivered(order._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2"
              >
                Mark as Delivered
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryOrdersList;
