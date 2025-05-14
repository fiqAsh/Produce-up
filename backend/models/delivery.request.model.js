import mongoose from "mongoose";

const deliverymanrequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    market: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Market",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      default: null,
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

const DeliveryManRequest = mongoose.model(
  "DeliveryManRequest",
  deliverymanrequestSchema
);

export default DeliveryManRequest;
