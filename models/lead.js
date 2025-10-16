import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    customer_id: String,
    pickup_address: String,
    drop_address: String,
    pickup_date: String,
    pickup_time: String,
    return_pickup_address: String,
    return_drop_address: String,
    return_date: String,
    return_time: String,
    distance: Number,
    trip_type: String,
    status: {
      type: String,
      default: "pending",
    },
    drivers: [],
    otp: String,
    seater:Number,
  },
  { timestamps: true }
);


export const Lead = mongoose.model("Lead",leadSchema);