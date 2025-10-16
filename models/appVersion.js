import mongoose from "mongoose";

const appVersionSchema = new mongoose.Schema(
  {
    appFor: {
      type: String,
      enum: ["Customer", "Driver"],
      required: true,
    },

    appVersion: {
      type: String,
      required: true,
    },

    apkUrl: {
      type: String,
      required: true,
    },

    appMsg: {
      type: String,
      default: "A new version of the app is available. Please update to continue.",
    },

    timeToShow: {
      type: Number,
      default: 24, 
      min: 1,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

export const AppVersion = mongoose.model("AppVersion", appVersionSchema);
