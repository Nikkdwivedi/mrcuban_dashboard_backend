import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    driverId: String,
    modelName: String,
    seat: Number,
    modelNumber: String,
    img: [],
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Rides = mongoose.model("Rides", rideSchema);
