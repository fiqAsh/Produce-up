import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./utils/db.js";

//routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import produceRoutes from "./routes/produce.route.js";
import managerRoutes from "./routes/manager.route.js";
import notificationRoutes from "./routes/notification.route.js";
import deliveryRoutes from "./routes/deliver.route.js";
import deliverymanRoutes from "./routes/deliveryman.route.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/deliveryman", deliverymanRoutes);

app.listen(8000, () => {
  console.log("server started at http://localhost:8000");
  connectDB();
});
