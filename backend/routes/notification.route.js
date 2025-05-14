import express from "express";
import { authenticateUser } from "../utils/auth.middleware.js";
import { getNotifications } from "../controllers/notification.controller.js";

const router = express.Router();
router.get("/getNotifications", authenticateUser, getNotifications);

export default router;
