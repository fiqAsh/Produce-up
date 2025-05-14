import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const sendPriceDropNotification = async ({
  produceName,
  marketName,
  oldPrice,
  newPrice,
}) => {
  try {
    const users = await User.find({}, "_id");

    const notifications = users.map((user) => ({
      user: user._id,
      message: `Price dropped for ${produceName} at ${marketName}: ${oldPrice} → ${newPrice}`,
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error("Failed to send price drop notifications:", error.message);
  }
};
export const sendOrderNotification = async (order) => {
  try {
    const notifications = [];

    if (order.manager) {
      const managerMessage = `A new delivery order (${order._id}) has been created.`;
      notifications.push({
        user: order.manager,
        message: managerMessage,
      });
    }

    if (order.deliveryman) {
      const deliverymanMessage = `You have been assigned to a new delivery order (${order._id}).`;
      notifications.push({
        user: order.deliveryman,
        message: deliverymanMessage,
      });
    }

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`✅ Notifications sent for order ${order._id}`);
    }
  } catch (error) {
    console.error("❌ Failed to send/save notifications:", error.message);
  }
};
export const sendManagerApplicationNotification = async (
  applicantId,
  market
) => {
  try {
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      console.warn("⚠️ Admin not found. Cannot send notification.");
      return;
    }

    const applicant = await User.findById(applicantId);
    const message = `${applicant.name || "A user"} has applied to manage ${
      market.name
    }`;

    await Notification.create({
      user: admin._id,
      message,
    });

    console.log(`✅ Notification sent to admin about manager application`);
  } catch (error) {
    console.error(
      "❌ Failed to send manager application notification:",
      error.message
    );
  }
};
export const sendDeliveryManApplicationNotification = async (
  applicantId,
  market,
  marketmanager
) => {
  try {
    const manager = await User.findById(marketmanager);

    if (!manager) {
      console.warn("⚠️ manager not found. Cannot send notification.");
      return;
    }

    const applicant = await User.findById(applicantId);
    const message = `${
      applicant.name || "A user"
    } has applied to be  a deliveryman of this ${market.name}`;

    await Notification.create({
      user: manager._id,
      message,
    });

    console.log(
      `✅ Notification sent to manager about deliveryman application`
    );
  } catch (error) {
    console.error(
      "❌ Failed to send manager application notification:",
      error.message
    );
  }
};
export const sendUserRoleNotification = async (
  userId,
  approved = true,
  role
) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const message = approved
      ? `🎉 Your ${role} application has been approved! Your role has been upgraded to ${role}.`
      : `❌ Your ${role} application has been rejected.`;

    await Notification.create({
      user: user._id,
      message,
    });

    console.log(`✅ Notification sent to user ${user.name || user._id}`);
  } catch (error) {
    console.error("❌ Failed to send user role notification:", error.message);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch notifications", error: error.message });
  }
};
