import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore"; // adjust path as needed

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ApplyForManager = () => {
  const {
    markets,
    fetchAllMarkets,
    applyForManager,
    successMessage,
    error,
    clearMessages,
    loading,
  } = useUserStore();

  const [selectedMarket, setSelectedMarket] = useState(null);

  useEffect(() => {
    fetchAllMarkets();
  }, [fetchAllMarkets]);

  const handleMarkerClick = (market) => {
    setSelectedMarket(market);
    clearMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMarket) {
      await applyForManager(selectedMarket._id);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Apply for Market Manager
      </h2>

      <div className="h-[400px] mb-6">
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {markets.map((market) => (
            <Marker
              key={market._id}
              position={[
                market.location.coordinates[1],
                market.location.coordinates[0],
              ]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick(market),
              }}
            >
              <Popup>
                <strong>{market.name}</strong>
                <br />
                Click to select this market
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow space-y-4"
      >
        <div>
          <label className="block font-medium">Selected Market:</label>
          <input
            type="text"
            value={selectedMarket ? selectedMarket.name : ""}
            readOnly
            className="mt-1 p-2 border rounded w-full"
            placeholder="Click a market marker to select"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedMarket || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Apply for Manager"}
        </button>

        {successMessage && (
          <div className="text-green-600 font-medium">{successMessage}</div>
        )}
        {error && <div className="text-red-600 font-medium">{error}</div>}
      </form>
    </div>
  );
};

export default ApplyForManager;
