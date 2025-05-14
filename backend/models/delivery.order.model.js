import mongoose from "mongoose";

const deliveryOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    marketA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Market",
      required: true,
    },
    marketB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Market",
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    estimatedTime: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
      required: true,
    },
    items: [
      {
        produce: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Produce",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        pricePerUnit: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const DeliveryOrder = mongoose.model("DeliveryOrder", deliveryOrderSchema);
export default DeliveryOrder;
