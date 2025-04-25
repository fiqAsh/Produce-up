import Market from "../models/market.model.js";

export const createMarket = async (req, res) => {
  try {
    const { name, latitude, longitude, manager, producePrices } = req.body;

    if (!name || !latitude || !longitude || !manager || !producePrices) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingMarket = await Market.findOne({
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    if (existingMarket) {
      return res.status(400).json({
        message: "Two market cannot be created at the same location ",
      });
    }

    const newMarket = await Market.create({
      name,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      manager,
      producePrices,
    });

    res
      .status(201)
      .json({ message: "Market created successfully", market: newMarket });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create market", error: error.message });
  }
};

export const getAllMarkets = async (req, res) => {
  try {
    const markets = await Market.find({});
    res.status(200).json({ markets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get markets", error: error.message });
  }
};

export const updateMarket = async (req, res) => {
  try {
    const marketid = req.market.id;
    const { name, manager } = req.body;

    let market = await Market.findById(marketid);

    if (!market) {
      res.status(404).json({ message: "Market not found" });
    }
    market.name = name || market.name;
    market.manager = manager || market.manager;

    await market.save();

    res.status(200).json({ message: "Market updated successfully", market });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update market", error: error.message });
  }
};

export const deleteMarket = async (req, res) => {
  try {
    const marketid = req.market.id;

    await Market.findByIdAndDelete(marketid);

    res.status(200).json({ message: "Market deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete market", error: error.message });
  }
};
