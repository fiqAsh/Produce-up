import express from "express";
import { authenticateUser } from "../utils/auth.middleware.js";

import {
  getDeliverymanOrders,
  markOrderDelivered,
} from "../controllers/deliveryman.controller.js";

const router = express.Router();

router.get("/getDeliverymanOrders", authenticateUser, getDeliverymanOrders);
router.patch(
  "/markOrderDelivered/:orderId",
  authenticateUser,
  markOrderDelivered
);

export default router;
