import mongoose from "mongoose";


const vicheleSchema = new mongoose.Schema({
    name:String,
    seat:Number,
    type:String,
},{timestamps:true})



export const Vichele = mongoose.model("Vichele",vicheleSchema);