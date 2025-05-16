import React, { useEffect, useState } from "react";
import { useAdminStore } from "../stores/useAdminStore";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const CreateMarket = () => {
  const {
    getAllUsers,
    getAllProduces,
    createMarket,
    users,
    produces,
    successMessage,
    error,
    clearMessages,
    loading,
  } = useAdminStore();

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    producePrices: [],
  });

  const [selectedProduceIds, setSelectedProduceIds] = useState([]);

  useEffect(() => {
    getAllUsers();
    getAllProduces();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      clearMessages();
    }, 3000);
    return () => clearTimeout(timer);
  }, [successMessage, error]);

  const handleMapClick = (e) => {
    setSelectedPosition(e.latlng);
  };

  const handleInputChange = (produceId, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.producePrices];
      const index = updated.findIndex((item) => item.produce === produceId);
      if (index !== -1) {
        updated[index] = { ...updated[index], [field]: value };
      } else {
        updated.push({ produce: produceId, [field]: value });
      }
      return { ...prev, producePrices: updated };
    });
  };

  const toggleProduce = (produceId) => {
    setSelectedProduceIds((prevIds) => {
      const newIds = prevIds.includes(produceId)
        ? prevIds.filter((id) => id !== produceId)
        : [...prevIds, produceId];

      setFormData((prevForm) => ({
        ...prevForm,
        producePrices: prevForm.producePrices.filter((item) =>
          newIds.includes(item.produce)
        ),
      }));

      return newIds;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPosition || !formData.name || !formData.manager) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedProduceIds.length === 0) {
      alert("Please select at least one produce");
      return;
    }

    const produceData = formData.producePrices.filter((item) =>
      selectedProduceIds.includes(item.produce)
    );

    const marketData = {
      name: formData.name,
      latitude: selectedPosition.lat,
      longitude: selectedPosition.lng,
      manager: formData.manager,
      producePrices: produceData,
    };

    await createMarket(marketData);
    setFormData({ name: "", manager: "", producePrices: [] });
    setSelectedProduceIds([]);
    setSelectedPosition(null);
  };

  const LocationMarker = () => {
    useMapEvents({ click: handleMapClick });
    return selectedPosition ? (
      <Marker
        position={selectedPosition}
        icon={L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      />
    ) : null;
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Create Market</h2>

      {/* Map */}
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        style={{ height: "300px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 shadow rounded"
      >
        <input
          type="text"
          placeholder="Market Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input input-bordered w-full"
        />

        {/* Manager select */}
        <select
          value={formData.manager}
          onChange={(e) =>
            setFormData({ ...formData, manager: e.target.value })
          }
          className="select select-bordered w-full"
        >
          <option value="">Select Manager</option>
          {users
            .filter((user) => user.role === "manager")
            .map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
        </select>

        {/* Produce Selection */}
        <div>
          <p className="font-medium mb-2">Select Produces</p>
          <div className="grid grid-cols-2 gap-2">
            {produces.map((produce) => (
              <label key={produce._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedProduceIds.includes(produce._id)}
                  onChange={() => toggleProduce(produce._id)}
                />
                {produce.name} ({produce.unit})
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic Price/Quantity Inputs */}
        {selectedProduceIds.map((id) => {
          const produce = produces.find((p) => p._id === id);
          const data =
            formData.producePrices.find((p) => p.produce === id) || {};

          return (
            <div
              key={id}
              className="grid grid-cols-2 gap-2 items-center border p-2 rounded"
            >
              <span className="font-medium">
                {produce.name} ({produce.unit})
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={data.price || ""}
                  onChange={(e) =>
                    handleInputChange(id, "price", e.target.value)
                  }
                  className="input input-bordered"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Quantity"
                  value={data.quantity || ""}
                  onChange={(e) =>
                    handleInputChange(id, "quantity", e.target.value)
                  }
                  className="input input-bordered"
                />
              </div>
            </div>
          );
        })}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Market"}
        </button>
      </form>

      {/* Messages */}
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default CreateMarket;
