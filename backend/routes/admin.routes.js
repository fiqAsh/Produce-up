import express from "express";
import { authenticateAdmin } from "../utils/auth.middleware.js";

import {
  createMarket,
  deleteMarket,
  updateMarket,
  handleManagerRequest,
  getAllManagerRequests,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/createMarket", authenticateAdmin, createMarket);
router.delete("/deleteMarket", authenticateAdmin, deleteMarket);

router.patch("/updateMarket", authenticateAdmin, updateMarket);
router.patch(
  "/manager-requests/:requestId",
  authenticateAdmin,
  handleManagerRequest
);
router.get("/getAllManagerRequests", authenticateAdmin, getAllManagerRequests);

export default router;
