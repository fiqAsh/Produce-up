import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";

const LowestPriceFinder = () => {
  const {
    getAllProduces,
    produces,
    findLowestPriceForProduce,
    loading,
    error,
    lowestMarket,
  } = useUserStore();

  const [selectedProduceId, setSelectedProduceId] = useState("");

  useEffect(() => {
    getAllProduces();
  }, [getAllProduces]);

  const handleChange = async (e) => {
    const produceId = e.target.value;
    setSelectedProduceId(produceId);

    if (produceId) {
      await findLowestPriceForProduce(produceId);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Find Lowest Price for Produce</h2>

      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedProduceId}
        onChange={handleChange}
      >
        <option value="">Select a produce</option>
        {Array.isArray(produces) &&
          produces.map((produce) => (
            <option key={produce._id} value={produce._id}>
              {produce.name}
            </option>
          ))}
      </select>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {lowestMarket && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Lowest Price Found:</h3>
          <p>
            <strong>Market:</strong> {lowestMarket.marketName}
          </p>
          <p>
            <strong>Location:</strong> {lowestMarket.location?.district},{" "}
            {lowestMarket.location?.division}
          </p>
          <p>
            <strong>Price:</strong> ৳{lowestMarket.price}
          </p>
          <p>
            <strong>Quantity:</strong> {lowestMarket.quantity}
          </p>
        </div>
      )}
    </div>
  );
};

export default LowestPriceFinder;
