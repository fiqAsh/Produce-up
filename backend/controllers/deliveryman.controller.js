import DeliveryOrder from "../models/delivery.order.model.js";
import Market from "../models/market.model.js";
import Notification from "../models/notification.model.js";

export const getDeliverymanOrders = async (req, res) => {
  try {
    const deliverymanId = req.user._id; // Assuming you use auth middleware to get user

    const orders = await DeliveryOrder.find({ deliveryman: deliverymanId })
      .populate("user", "name email") // populate ordering user info
      .populate("marketA marketB", "name") // populate market names
      .populate("items.produce", "name") // populate produce names
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching deliveryman orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markOrderDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliverymanId = req.user._id;

    const order = await DeliveryOrder.findOne({
      _id: orderId,
      deliveryman: deliverymanId,
      isDelivered: false,
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or already delivered" });
    }

    // Mark as delivered
    order.isDelivered = true;
    await order.save();

    // Fetch the source market (marketA)
    const sourceMarket = await Market.findById(order.marketA);

    if (!sourceMarket) {
      return res.status(404).json({ message: "Source market not found" });
    }

    // Deduct produce quantities from source market
    for (const item of order.items) {
      const produceEntry = sourceMarket.producePrices.find(
        (p) => p.produce.toString() === item.produce.toString()
      );

      if (produceEntry) {
        produceEntry.quantity -= item.quantity;
        if (produceEntry.quantity < 0) produceEntry.quantity = 0; // prevent negative stock
      }
    }

    await sourceMarket.save();

    // Send notification to the orderer
    await Notification.create({
      user: order.user,
      message: `Your delivery from ${sourceMarket.name} has been completed.`,
    });

    res.status(200).json({ message: "Order marked as delivered" });
  } catch (err) {
    console.error("Error delivering order:", err);
    res.status(500).json({ message: "Server error" });
  }
};
