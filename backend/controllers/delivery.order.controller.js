import DeliveryOrder from "../models/delivery.order.model.js";

import Market from "../models/market.model.js";
import { sendOrderNotification } from "./notification.controller.js";

const DELIVERY_SPEED_KMH = 40;

const toRadians = (deg) => (deg * Math.PI) / 180;

const haversineDistance = (coords1, coords2) => {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371; // Radius of Earth in km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
};
//hjb
export const createDeliveryOrder = async (req, res) => {
  try {
    const { marketFromId, marketToId, items, deliverymanId, managerid } =
      req.body;
    const userId = req.user._id;

    const [marketFrom, marketTo] = await Promise.all([
      Market.findById(marketFromId),
      Market.findById(marketToId),
    ]);

    if (!marketFrom || !marketTo) {
      return res
        .status(404)
        .json({ message: "One or both markets not found." });
    }

    const distance = haversineDistance(
      marketFrom.location.coordinates,
      marketTo.location.coordinates
    );

    const estimatedTime = (distance / DELIVERY_SPEED_KMH) * 60;

    let totalPrice = 0;
    for (const item of items) {
      totalPrice += item.price * item.quantity;
    }

    const orderData = {
      marketA: marketFrom._id,
      marketB: marketTo._id,
      user: userId,
      distance,
      estimatedTime,
      totalPrice,
      items: items.map((item) => ({
        produce: item.produceId,
        quantity: item.quantity,
        pricePerUnit: item.price,
      })),
      deliveryman: marketFrom.deliveryman, // assign from marketFrom
      manager: marketFrom.manager,
    };

    const newOrder = await DeliveryOrder.create(orderData);
    await sendOrderNotification(newOrder);

    res.status(201).json({ message: "Delivery order created", newOrder });
  } catch (error) {
    console.error("Error creating delivery order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//hjb
export const getDeliveryEstimate = async (req, res) => {
  try {
    const { marketFromId, marketToId, items } = req.body;

    if (!marketFromId || !marketToId || !items || !items.length) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const [marketFrom, marketTo] = await Promise.all([
      Market.findById(marketFromId),
      Market.findById(marketToId),
    ]);

    if (!marketFrom || !marketTo) {
      return res
        .status(404)
        .json({ message: "One or both markets not found." });
    }

    const distance = haversineDistance(
      marketFrom.location.coordinates,
      marketTo.location.coordinates
    );

    const estimatedTime = (distance / DELIVERY_SPEED_KMH) * 60; // in minutes

    let totalPrice = 0;
    for (const item of items) {
      totalPrice += item.price * item.quantity;
    }

    res.status(200).json({
      distance: distance.toFixed(2),
      estimatedTime: estimatedTime.toFixed(1), // minutes
      totalPrice: totalPrice.toFixed(2),
    });
  } catch (error) {
    console.error("Error getting delivery estimate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
