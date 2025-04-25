import express from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getUserProfile,
  getAllUser,
  updateUser,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../utils/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
router.post("/refreshAccessToken", refreshAccessToken);
router.get("/getUserProfile", authenticateUser, getUserProfile);
router.get("/getAllUser", authenticateUser, getAllUser);
router.patch("/updateUser", authenticateUser, updateUser);

export default router;
