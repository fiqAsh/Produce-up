import Market from "./models/market.model.js";
import User from "./models/user.model.js";
import Produce from "./models/produce.model.js";

export const seedMarkets = async () => {
  try {
    const manager = await User.findOne({ role: "manager" });
    const deliveryman = await User.findOne({ role: "deliveryman" });
    const produces = await Produce.find();

    if (!manager) {
      console.log("❌ No manager found. Please create a manager first.");
      return;
    }

    if (!deliveryman) {
      console.log(
        "❌ No deliveryman found. Please create a deliveryman first."
      );
      return;
    }

    if (produces.length === 0) {
      console.log("❌ No produce items found. Please seed Produce first.");
      return;
    }

    const markets = [
      {
        name: "Dhaka Market",
        location: { type: "Point", coordinates: [90.4125, 23.8103] },
      },
      {
        name: "Chittagong Market",
        location: { type: "Point", coordinates: [91.7832, 22.3569] },
      },
      {
        name: "Khulna Market",
        location: { type: "Point", coordinates: [89.5644, 22.8456] },
      },
      {
        name: "Rajshahi Market",
        location: { type: "Point", coordinates: [88.6, 24.3667] },
      },
      {
        name: "Sylhet Market",
        location: { type: "Point", coordinates: [91.8833, 24.8917] },
      },
      {
        name: "Barisal Market",
        location: { type: "Point", coordinates: [90.3667, 22.7] },
      },
      {
        name: "Rangpur Market",
        location: { type: "Point", coordinates: [89.25, 25.75] },
      },
      {
        name: "Mymensingh Market",
        location: { type: "Point", coordinates: [90.4074, 24.7471] },
      },
      {
        name: "Comilla Market",
        location: { type: "Point", coordinates: [91.1839, 23.4607] },
      },
      {
        name: "Cox's Bazar Market",
        location: { type: "Point", coordinates: [91.9833, 21.45] },
      },
    ];

    const marketsWithDetails = markets.map((market) => {
      const selectedProduces = produces
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 3); // pick 3 to 5

      const producePrices = selectedProduces.map((produce) => ({
        produce: produce._id,
        price: Math.floor(Math.random() * 100) + 20,
        quantity: Math.floor(Math.random() * 50) + 10,
      }));

      return {
        ...market,
        manager: manager._id,
        deliveryman: deliveryman._id,
        producePrices,
      };
    });

    await Market.insertMany(marketsWithDetails);

    console.log(
      "✅ Successfully seeded markets with manager, deliveryman, and producePrices."
    );
  } catch (error) {
    console.error("❌ Failed to seed markets:", error.message);
  }
};
