import express from "express";
import { authenticateUser } from "../utils/auth.middleware.js";

import {
  getUserProfile,
  getAllUser,
  updateUser,
  getNearestMarkets,
  getSingleMarket,
  getAllMarkets,
  applyForDeliveryman,
  applyForManager,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/getUserProfile", authenticateUser, getUserProfile);
router.get("/getAllUser", authenticateUser, getAllUser);
router.patch("/updateUser", authenticateUser, updateUser);
router.get("/getNearestMarkets", authenticateUser, getNearestMarkets);
router.get("/getSingleMarket/:marketid", authenticateUser, getSingleMarket);
router.get("/getAllMarkets", authenticateUser, getAllMarkets);
router.post("/applyForDeliveryman", authenticateUser, applyForDeliveryman);
router.post("/applyForManager", authenticateUser, applyForManager);
export default router;
