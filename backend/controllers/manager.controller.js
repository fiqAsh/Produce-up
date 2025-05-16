import DeliveryManRequest from "../models/delivery.request.model.js";
import Market from "../models/market.model.js";
import Produce from "../models/produce.model.js";
import {
  sendPriceDropNotification,
  sendUserRoleNotification,
} from "./notification.controller.js";
//m
export const updateProducePriceQuantity = async (req, res) => {
  try {
    const { marketId, produceId, price, quantity } = req.body;
    const userId = req.user._id;

    const market = await Market.findById(marketId);

    if (!market) {
      return res.status(404).json({ message: "Market not found" });
    }

    if (market.manager.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const produceExists = await Produce.findById(produceId);
    if (!produceExists) {
      return res
        .status(404)
        .json({ message: "Produce not found in master list" });
    }

    const priceIndex = market.producePrices.findIndex(
      (p) => p.produce.toString() === produceId
    );

    if (priceIndex === -1) {
      return res.status(400).json({
        message:
          "This produce is not already listed in the market. New additions are not allowed.",
      });
    }

    const oldPrice = market.producePrices[priceIndex].price;

    if (price !== undefined) {
      market.producePrices[priceIndex].price = price;

      if (price < oldPrice) {
        await sendPriceDropNotification({
          produceName: produceExists.name,
          marketName: market.name,
          oldPrice,
          newPrice: price,
        });
      }
    }

    if (quantity !== undefined) {
      market.producePrices[priceIndex].quantity = quantity;
    }

    await market.save();

    res.status(200).json({ message: "Price updated successfully", market });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//m
export const handleDeliveryManRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;

    const request = await DeliveryManRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "deliveryman request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been handled" });
    }

    if (action === "approve") {
      request.status = "approved";
      request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await User.findByIdAndUpdate(request.user, { role: "deliveryman" });
      const role = "deliveryman";

      await sendUserRoleNotification(request.user, true, role);
    } else if (action === "reject") {
      request.status = "rejected";
      request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const role = "deliveryman";

      await sendUserRoleNotification(request.user, false, role);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await request.save();

    res.status(200).json({ message: `Request ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({
      message: "Error handling manager request",
      error: error.message,
    });
  }
};
//m
export const getDeliverymanRequests = async (req, res) => {
  try {
    const managerId = req.user.id;

    // Get all markets managed by this manager
    const markets = await Market.find({ manager: managerId });

    const marketIds = markets.map((m) => m._id);

    if (marketIds.length === 0) {
      return res
        .status(200)
        .json({ message: "No markets assigned", requests: [] });
    }

    // Find deliveryman requests tied to those markets
    const requests = await DeliveryManRequest.find({
      market: { $in: marketIds },
    })
      .populate("user", "name email") // Optional: populate user info
      .populate("market", "name"); // Optional: populate market name

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch deliveryman requests",
      error: error.message,
    });
  }
};
