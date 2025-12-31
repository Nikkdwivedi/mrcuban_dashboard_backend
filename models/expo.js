import mongoose from "mongoose";


const tokenSchema = new mongoose.Schema({
    partnerId:String,
    token:String,
    appType:String // "customer" or "driver"
})



export const Tokens = mongoose.model("Tokens",tokenSchema);