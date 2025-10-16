import mongoose from "mongoose";


const ratingSchema = new mongoose.Schema({
    driverId: String,
    comment: String,
    rating: String,
    customerId: String,
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });



export const Rating = mongoose.model("Ratings", ratingSchema);