import { useEffect, useState } from "react";
import { useManagerStore } from "../stores/useManagerStore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MarketProduceUpdater = ({ markets }) => {
  const {
    updatePriceAndQuantity,
    loading,
    successMessage,
    error,
    clearMessages,
  } = useManagerStore();

  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (successMessage || error) {
      setTimeout(() => clearMessages(), 3000);
    }
  }, [successMessage, error]);

  const handleUpdate = () => {
    if (!selectedMarket || !selectedProduce) return;
    updatePriceAndQuantity({
      marketId: selectedMarket._id,
      produceId: selectedProduce.produce._id,
      price: price !== "" ? Number(price) : undefined,
      quantity: quantity !== "" ? Number(quantity) : undefined,
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="text-xl font-bold">Update Market Produce</h2>

      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={7}
        className="h-96 w-full max-w-4xl rounded-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markets.map((market) => (
          <Marker
            key={market._id}
            position={[
              market.location.coordinates[1],
              market.location.coordinates[0],
            ]}
            eventHandlers={{
              click: () => {
                setSelectedMarket(market);
                setSelectedProduce(null);
              },
            }}
          >
            <Popup>
              <strong>{market.name}</strong>
              <br />
              Click to manage
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedMarket && (
        <div className="w-full max-w-xl p-4 border rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">
            Update {selectedMarket.name}
          </h3>

          <select
            className="select select-bordered w-full mb-2"
            onChange={(e) => {
              const selected = selectedMarket.producePrices.find(
                (p) => p.produce._id === e.target.value
              );
              setSelectedProduce(selected);
              setPrice(selected?.price?.toString() || "");
              setQuantity(selected?.quantity?.toString() || "");
            }}
          >
            <option>Select Produce</option>
            {selectedMarket.producePrices.map((p) => (
              <option key={p.produce._id} value={p.produce._id}>
                {p.produce.name}
              </option>
            ))}
          </select>

          {selectedProduce && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Price (৳)
                </label>
                <input
                  type="number"
                  placeholder="New Price"
                  className="input input-bordered w-full"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Quantity (kg)
                </label>
                <input
                  type="number"
                  placeholder="New Quantity"
                  className="input input-bordered w-full"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary w-full"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          )}

          {successMessage && (
            <div className="text-green-600 font-medium mt-2">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="text-red-600 font-medium mt-2">{error}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketProduceUpdater;
