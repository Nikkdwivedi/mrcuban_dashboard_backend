import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    title:String,
    message:String,
    driverId:String
},{timestamps:true});



export const Notification = mongoose.model("Notifications",notificationSchema);