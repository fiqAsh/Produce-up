import Market from "../models/market.model.js";
import ManagerRequest from "../models/manager.request.model.js";
import User from "../models/user.model.js";
import { sendUserRoleNotification } from "./notification.controller.js";

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

export const handleManagerRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;

    const request = await ManagerRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Manager request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been handled" });
    }

    if (action === "approve") {
      request.status = "approved";
      request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await User.findByIdAndUpdate(request.user, { role: "manager" });
      const role = "manager";

      await sendUserRoleNotification(request.user, true, role);
    } else if (action === "reject") {
      request.status = "rejected";
      request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const role = "user";

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
