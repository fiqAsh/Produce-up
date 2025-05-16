import React, { useState, useEffect } from "react";
import { useAdminStore } from "../stores/useAdminStore";
import { useUserStore } from "../stores/useUserStore";

const ManageMarkets = () => {
  const { updateMarket, deleteMarket, successMessage, error, clearMessages } =
    useAdminStore();
  const { markets, fetchAllMarkets } = useUserStore();

  const [editingMarket, setEditingMarket] = useState(null);
  const [formData, setFormData] = useState({ name: "", manager: "" });

  useEffect(() => {
    clearMessages();
    fetchAllMarkets();
  }, []);

  const handleEditClick = (market) => {
    setEditingMarket(market._id);
    setFormData({ name: market.name, manager: market.manager });
    clearMessages();
  };

  const handleUpdate = async () => {
    await updateMarket({ id: editingMarket, ...formData });
    setEditingMarket(null);
  };

  const handleDelete = async (marketId) => {
    if (window.confirm("Are you sure you want to delete this market?")) {
      await deleteMarket(marketId);
      fetchAllMarkets();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Manage Markets</h2>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-600">{error}</p>}

      {markets.length === 0 ? (
        <p>No markets available</p>
      ) : (
        <div className="space-y-4">
          {markets.map((market) => (
            <div
              key={market._id}
              className="border p-4 rounded shadow bg-white space-y-2"
            >
              {editingMarket === market._id ? (
                <>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        manager: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingMarket(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>{market.name}</strong>
                  </p>
                  <p>Manager: {market.manager}</p>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleEditClick(market)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(market._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMarkets;
