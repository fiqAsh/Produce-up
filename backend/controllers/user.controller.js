import User from "../models/user.model.js";
import Market from "../models/market.model.js";
import ManagerRequest from "../models/manager.request.model.js";
import {
  sendDeliveryManApplicationNotification,
  sendManagerApplicationNotification,
} from "./notification.controller.js";
import DeliveryManRequest from "../models/delivery.request.model.js";

export const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user profile", error: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get users", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userid = req.user.id;

    const { name, password, email, phone, latitude, longitude } = req.body;

    let user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let hashedPassword = user.password;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = hashedPassword;
    user.phone = phone || user.phone;

    if (
      latitude !== undefined &&
      longitude !== undefined &&
      latitude !== null &&
      longitude !== null
    ) {
      user.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

export const applyForManager = async (req, res) => {
  try {
    const userid = req.user.id;
    const { marketId } = req.body;

    const market = await Market.findById(marketId);

    if (!market) {
      return res.status(404).json({ message: "Market not found" });
    }

    const existingRequest = await ManagerRequest.findOne({
      user: userid,
      market: marketId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You have already applied for this market" });
    }

    const newRequest = await ManagerRequest.create({
      user: userid,
      market: marketId,
    });
    await sendManagerApplicationNotification(userid, market);

    res
      .status(200)
      .json({ message: "Request sent successfully", request: newRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to apply for manager", error: error.message });
  }
};
export const applyForDeliveryman = async (req, res) => {
  try {
    const userid = req.user.id;
    const { marketId } = req.body;

    const market = await Market.findById(marketId);

    const marketmanager = market.manager;

    if (!market) {
      return res.status(404).json({ message: "Market not found" });
    }

    const existingRequest = await DeliveryManRequest.findOne({
      user: userid,
      market: marketId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You have already applied for this market" });
    }

    const newRequest = await DeliveryManRequest.create({
      user: userid,
      market: marketId,
    });
    await sendDeliveryManApplicationNotification(userid, market, marketmanager);

    res
      .status(200)
      .json({ message: "Request sent successfully", request: newRequest });
  } catch (error) {
    res.status(500).json({
      message: "Failed to apply for delivery man",
      error: error.message,
    });
  }
};

export const getNearestMarkets = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const markets = await Market.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 50000, // 50 kilometers in meters
        },
      },
    });

    res.status(200).json({ markets });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to find nearest markets",
      error: error.message,
    });
  }
};

export const getSingleMarket = async (req, res) => {
  try {
    const { marketid } = req.params;
    const market = await Market.findById(marketid);

    if (!market) {
      return res.status(404).json({ message: "Market not found" });
    }
    res.status(200).json({ market });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get market", error: error.message });
  }
};

export const getAllMarkets = async (req, res) => {
  try {
    const markets = await Market.find({}).populate("producePrices.produce");
    res.status(200).json({ markets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get markets", error: error.message });
  }
};
