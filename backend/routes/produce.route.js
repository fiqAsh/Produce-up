import express from "express";

import { authenticateUser } from "../utils/auth.middleware.js";
import {
  createProduce,
  findLowestPriceForProduce,
  getAllProduce,
} from "../controllers/produce.controller.js";

const router = express.Router();

router.get(
  "/findLowestPriceForProduce/:produceid",
  authenticateUser,
  findLowestPriceForProduce
);
router.post("/createProduce", authenticateUser, createProduce);
router.get("/getAllProduce", authenticateUser, getAllProduce);

export default router;
