import express from "express";
import { authenticateManager } from "../utils/auth.middleware.js";
import {
  updateProducePriceQuantity,
  handleDeliveryManRequest,
} from "../controllers/manager.controller.js";

const router = express.Router();

router.patch(
  "/updateProducePrice",
  authenticateManager,
  updateProducePriceQuantity
);

router.patch(
  "/deliveryman-requests/:requestId",
  authenticateManager,
  handleDeliveryManRequest
);

export default router;
