import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    accountOtp: {
      type: String,
      unique: true,
    },
    otp:{
        type:String
    },
    otpExpiary:{
        type:Date
    },
    verify:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
