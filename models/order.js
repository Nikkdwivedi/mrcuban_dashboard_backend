import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: String,
    distance1: String,
    distance2: String,
    distance3: String,
    distance4: String,
    date1: String,
    date2: String,
    status: String,
    price: String,
    paymentStatus: String,
    type:String,
    otp:String,
    driver:[],
    driverOrderId:String,
    seater:Number,
    km:Number,
    isOffer: { type: Boolean, default: false },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" }
  },
  { timestamps: true }
);


export const CustomerOrder = mongoose.model("CustomerOrder",orderSchema);
