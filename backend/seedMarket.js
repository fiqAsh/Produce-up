import mongoose from "mongoose";
import { seedMarkets } from "./seedMarkets.js"; // path to your seeder
import User from "./models/user.model.js";
import Produce from "./models/produce.model.js";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();

  const managers = await User.find({ role: "manager" });
  const produces = await Produce.find({});

  const managerIds = managers.map((manager) => manager._id);
  const produceIds = produces.map((produce) => produce._id);

  await seedMarkets();

  process.exit();
};

runSeeder();
