import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager", "deliveryman"],
      default: "user",
    },
    phone: {
      type: Number,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // GeoJSON format
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },

  {
    timestamps: true,
  }
);
userSchema.index({ location: "2dsphere" });
const User = mongoose.model("User", userSchema);

export default User;
