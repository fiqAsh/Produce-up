import mongoose from "mongoose";

const marketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
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
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    producePrices: [
      {
        produce: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Produce",
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

marketSchema.index({ location: "2dsphere" });

const Market = mongoose.model("Market", marketSchema);

export default Market;
