import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import useDeliveryOrderStore from "../stores/useDeliveryOrderStore";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DeliveryOrderComponent = ({ markets }) => {
  const {
    getEstimate,
    createOrder,
    deliveryEstimate,
    deliveryOrder,
    loading,
    error,
  } = useDeliveryOrderStore();

  const [marketFromId, setMarketFromId] = useState("");
  const [marketToId, setMarketToId] = useState("");
  const [orderItems, setOrderItems] = useState([]); // [{ produceId, price, quantity }]

  // Update orderItems when marketFrom changes
  useEffect(() => {
    if (!marketFromId) {
      setOrderItems([]);
      return;
    }
    const market = markets.find((m) => m._id === marketFromId);
    if (!market) return;
    const items = market.producePrices.map((p) => ({
      produceId: p.produce._id,
      price: p.price,
      quantity: 0,
      name: p.produce.name,
      unit: p.produce.unit,
      maxQuantity: p.quantity,
    }));
    setOrderItems(items);
  }, [marketFromId, markets]);

  // Handle quantity input change per produce item
  const handleQuantityChange = (index, value) => {
    const qty = Math.max(
      0,
      Math.min(value, orderItems[index].maxQuantity || 0)
    );
    const newItems = [...orderItems];
    newItems[index].quantity = qty;
    setOrderItems(newItems);
  };

  // Prepare items for API call: filter out zero quantities
  const itemsToSend = orderItems
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      produceId: item.produceId,
      price: item.price,
      quantity: item.quantity,
    }));

  // Get estimate handler
  const handleGetEstimate = () => {
    if (!marketFromId || !marketToId || itemsToSend.length === 0) {
      alert("Select markets and enter quantities before getting estimate");
      return;
    }
    getEstimate({ marketFromId, marketToId, items: itemsToSend });
  };

  // Place order handler
  const handlePlaceOrder = () => {
    if (!marketFromId || !marketToId || itemsToSend.length === 0) {
      alert("Select markets and enter quantities before placing order");
      return;
    }
    createOrder({ marketFromId, marketToId, items: itemsToSend });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Delivery Order</h2>

      {/* Market Selectors */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block font-semibold">From Market:</label>
          <select
            value={marketFromId}
            onChange={(e) => setMarketFromId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select From Market</option>
            {markets.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">To Market:</label>
          <select
            value={marketToId}
            onChange={(e) => setMarketToId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select To Market</option>
            {markets
              .filter((m) => m._id !== marketFromId)
              .map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={7}
        style={{ height: "300px", width: "100%" }}
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
              click: () => setMarketFromId(market._id),
              dblclick: () => setMarketToId(market._id),
            }}
          >
            <Popup>
              <div>
                <strong>{market.name}</strong>
                <br />
                Click to select as <em>From Market</em>
                <br />
                Double click to select as <em>To Market</em>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Produce List & Quantity Inputs */}
      {orderItems.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">
            Produce in {markets.find((m) => m._id === marketFromId)?.name}
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Produce</th>
                <th className="border border-gray-300 p-2">Price per Unit</th>
                <th className="border border-gray-300 p-2">
                  Available Quantity
                </th>
                <th className="border border-gray-300 p-2">Order Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, i) => (
                <tr key={item.produceId}>
                  <td className="border border-gray-300 p-2">
                    {item.name} ({item.unit})
                  </td>
                  <td className="border border-gray-300 p-2">{item.price}</td>
                  <td className="border border-gray-300 p-2">
                    {item.maxQuantity}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      min={0}
                      max={item.maxQuantity}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(i, parseInt(e.target.value) || 0)
                      }
                      className="border p-1 w-20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Actions and Results */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleGetEstimate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Get Estimate
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Place Order
        </button>
      </div>

      {loading && <p className="mt-2 text-gray-600">Loading...</p>}

      {error && (
        <p className="mt-2 text-red-600 font-semibold">Error: {error}</p>
      )}

      {deliveryEstimate && (
        <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
          <h4 className="font-semibold">Delivery Estimate:</h4>
          <p>Distance: {deliveryEstimate.distance} km</p>
          <p>Estimated Time: {deliveryEstimate.estimatedTime} minutes</p>
          <p>Total Price: ৳{deliveryEstimate.totalPrice}</p>
        </div>
      )}

      {deliveryOrder && (
        <div className="mt-4 p-4 border border-green-500 rounded bg-green-50">
          <h4 className="font-semibold">Order Created Successfully!</h4>
          <p>Order ID: {deliveryOrder._id}</p>
          <p>
            From: {markets.find((m) => m._id === deliveryOrder.marketA)?.name}
          </p>
          <p>
            To: {markets.find((m) => m._id === deliveryOrder.marketB)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryOrderComponent;
