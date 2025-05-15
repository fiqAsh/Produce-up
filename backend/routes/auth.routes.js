import express from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../utils/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);

router.post("/refreshAccessToken", refreshAccessToken);

export default router;
