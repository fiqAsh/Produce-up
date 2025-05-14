import mongoose from "mongoose";
import dotenv from "dotenv";
import Produce from "./models/produce.model.js"; // adjust the path if needed

dotenv.config();

const seedProduce = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Optional: Clear existing produces first
    await Produce.deleteMany();

    const produces = [
      { name: "Tomato", unit: "kg" },
      { name: "Potato", unit: "kg" },
      { name: "Carrot", unit: "kg" },
      { name: "Cucumber", unit: "kg" },
      { name: "Onion", unit: "kg" },
      { name: "Garlic", unit: "kg" },
      { name: "Spinach", unit: "bunch" },
      { name: "Banana", unit: "dozen" },
      { name: "Apple", unit: "kg" },
      { name: "Rice", unit: "kg" },
    ];

    await Produce.insertMany(produces);

    console.log("Produce Seeded Successfully");
    process.exit(); // Exit after success
  } catch (error) {
    console.error("Error seeding produce:", error.message);
    process.exit(1); // Exit with failure
  }
};

seedProduce();
