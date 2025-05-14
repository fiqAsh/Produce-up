import Produce from "../models/produce.model.js";
import Market from "../models/market.model.js";

export const createProduce = async (req, res) => {
  try {
    const { name, unit } = req.body;
    const existingProduce = await Produce.findOne({ name });
    if (existingProduce) {
      res.status(400).json({ message: "Produce already exists" });
    }

    const newProduce = await Produce.create({ name, unit });
    res
      .status(201)
      .json({ message: "Produce created successfully", newProduce });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create produce", error: error.message });
  }
};

export const findLowestPriceForProduce = async (req, res) => {
  try {
    const { produceid } = req.params;

    // Check if the produce exists
    const produce = await Produce.findById(produceid);
    if (!produce) {
      return res.status(404).json({ message: "Produce not found" });
    }

    // Find the lowest price for the given produce across markets
    const markets = await Market.find({
      "producePrices.produce": produceid,
    }).select("name location producePrices");

    if (!markets.length) {
      return res
        .status(404)
        .json({ message: "No markets selling this produce" });
    }

    // Go through all markets and find the lowest price
    let lowestMarket = null;
    let lowestPrice = Infinity;

    markets.forEach((market) => {
      const priceInfo = market.producePrices.find(
        (p) => p.produce.toString() === produceid
      );
      if (priceInfo && priceInfo.price < lowestPrice) {
        lowestPrice = priceInfo.price;
        lowestMarket = {
          marketId: market._id,
          marketName: market.name,
          location: market.location,
          price: priceInfo.price,
          quantity: priceInfo.quantity,
        };
      }
    });

    if (!lowestMarket) {
      return res
        .status(404)
        .json({ message: "No price found for this produce" });
    }

    res.status(200).json({ lowestMarket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllProduce = async (req, res) => {
  try {
    const produces = await Produce.find({});
    res.status(200).json({ produces });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get produces", error: error.message });
  }
};
