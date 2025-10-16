import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    phone: {
      type: String,
      unique: true,
    },
    dl: String,
    doc: [],
    verify: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiary: {
      type: Date,
    },
    orders: {
      type: String,
      default: "0",
    },
    ratings: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
  }
);

export const Driver = mongoose.model("Driver", driverSchema);
