import mongoose from "mongoose";


const tokenSchema = new mongoose.Schema({
    partnerId:String,
    token:String
})



export const Tokens = mongoose.model("Tokens",tokenSchema);