import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Driver",
    },
    driverName: { type: String, required: true },
    tripType: { 
      type: String, 
      enum: ["One Way", "Round Trip"], 
      required: true 
    },
    pickupDate: { type: String, required: true },
    pickupTimeStart: { type: String, required: true },
    pickupTimeEnd: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    dropAddress: { type: String, required: true },
    returnPickupAddress: { type: String }, // For round trip
    returnDropAddress: { type: String }, // For round trip
    distance: { type: Number, required: true },
    returnDistance: { type: Number }, // For round trip
    amount: { type: Number, required: true },
    modelName: { type: String },
    modelNumber: { type: String },
    seat: { type: Number },
    status: {
      type: String,
      enum: ["active", "accepted", "completed", "cancelled"],
      default: "active",
    },
    acceptedBy: {
      customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      customerName: { type: String },
      acceptedAt: { type: Date },
    },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerOrder" },
    customerOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerOrder" },
    driverOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "DriverOrder" },
    rideStatus: {
      type: String,
      enum: ["accepted", "started", "completed", "cancelled"],
      default: "accepted"
    },
  },
  { timestamps: true }
);

export const Offer = mongoose.model("Offer", offerSchema);
