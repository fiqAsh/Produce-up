import express from "express";
import { authenticateUser } from "../utils/auth.middleware.js";
import {
  createDeliveryOrder,
  getDeliveryEstimate,
} from "../controllers/delivery.order.controller.js";

const router = express.Router();

router.post("/createDeliveryOrder", authenticateUser, createDeliveryOrder);
router.get("/getDeliveryEstimate", authenticateUser, getDeliveryEstimate);
export default router;
