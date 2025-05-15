import { useEffect } from "react";

import { useManagerStore } from "../stores/useManagerStore";

const HandleDeliveryman = () => {
  const {
    deliverymanRequests,
    handleDeliveryRequest,
    fetchdeliverymanrequests,
    loading,
    successMessage,
    error,
    clearMessages,
  } = useManagerStore();

  useEffect(() => {
    fetchdeliverymanrequests();
  }, []);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const handleAction = (requestId, action) => {
    handleDeliveryRequest(requestId, action);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manager Requests</h2>

      {loading && <p className="text-blue-500 mb-2">Loading...</p>}
      {successMessage && (
        <p className="text-green-600 mb-2">{successMessage}</p>
      )}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {deliverymanRequests.length === 0 ? (
        <p>No manager requests found.</p>
      ) : (
        <ul className="space-y-4">
          {deliverymanRequests.map((request) => (
            <li
              key={request._id}
              className="border p-4 rounded-lg flex justify-between items-center shadow-sm"
            >
              <div>
                <p>
                  <strong>User:</strong> {request.user?.name || request.user}
                </p>
                <p>
                  <strong>Market:</strong>{" "}
                  {request.market?.name || request.market}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`ml-1 font-semibold ${
                      request.status === "pending"
                        ? "text-yellow-600"
                        : request.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </p>
              </div>

              {request.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(request._id, "approve")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(request._id, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span className="text-gray-400 italic">Handled</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HandleDeliveryman;
